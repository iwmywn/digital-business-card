import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { getUserCollection } from "@/lib/collections";
import { createResponse } from "@/app/api/utils";
import { basicId, professionalId } from "@/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret || "",
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return createResponse({ error: `Webhook Error: ${errorMessage}` }, 400);
  }

  const userCollection = await getUserCollection();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        const userId = checkoutSession.metadata?.userId;
        if (!userId) {
          console.error("No userId found in checkout session metadata");
          break;
        }

        if (checkoutSession.payment_status === "paid") {
          const lineItems = await stripe.checkout.sessions.listLineItems(
            checkoutSession.id,
          );

          const priceId = lineItems.data[0]?.price?.id;

          let planId: "basic" | "professional" | null = null;
          if (priceId === basicId) {
            planId = "basic";
          } else if (priceId === professionalId) {
            planId = "professional";
          }

          if (!planId) {
            console.error(`Unknown price ID: ${priceId}`);
            break;
          }

          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setDate(now.getDate() + 30);

          const user = await userCollection.findOne({
            _id: new ObjectId(userId),
          });

          if (!user) {
            console.error(`User not found: ${userId}`);
            break;
          }

          const paymentIntentId =
            typeof checkoutSession.payment_intent === "string"
              ? checkoutSession.payment_intent
              : checkoutSession.payment_intent?.id;

          if (
            user.paymentHistory?.some(
              (payment) => payment.paymentIntentId === paymentIntentId,
            )
          ) {
            break;
          }

          const purchasedPlans = user.purchasedPlans || [];

          purchasedPlans.push({
            planId,
            purchasedAt: now,
            expiresAt,
          });

          const paymentHistory = user.paymentHistory || [];

          paymentHistory.push({
            paymentIntentId: paymentIntentId || "",
            amount: checkoutSession.amount_total
              ? checkoutSession.amount_total / 100
              : 0,
            planId: planId,
            status: "succeeded",
            createdAt: now,
          });

          await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                currentPlan: planId,
                planExpiresAt: expiresAt,
                purchasedPlans: purchasedPlans,
                paymentHistory: paymentHistory,
                updatedAt: now,
              },
            },
          );
        } else {
          console.log(
            `Payment status is not paid: ${checkoutSession.payment_status}`,
          );
        }

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const userId = paymentIntent.metadata?.userId;
        const planId = paymentIntent.metadata?.planId as
          | "basic"
          | "professional"
          | undefined;

        if (userId && planId) {
          const user = await userCollection.findOne({
            _id: new ObjectId(userId),
          });

          if (!user) {
            console.error(`User not found: ${userId}`);
            break;
          }

          if (
            user.paymentHistory?.some(
              (payment) => payment.paymentIntentId === paymentIntent.id,
            )
          ) {
            break;
          }

          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setDate(now.getDate() + 30);

          const purchasedPlans = user.purchasedPlans || [];

          purchasedPlans.push({
            planId,
            purchasedAt: now,
            expiresAt,
          });

          const paymentHistory = user.paymentHistory || [];

          paymentHistory.push({
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            planId: planId,
            status: "succeeded",
            createdAt: now,
          });

          await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                currentPlan: planId,
                planExpiresAt: expiresAt,
                purchasedPlans: purchasedPlans,
                paymentHistory: paymentHistory,
                updatedAt: now,
              },
            },
          );
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${failedPayment.id}`);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const customer = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;

        let planId: "free" | "basic" | "professional" = "free";
        if (priceId === basicId) {
          planId = "basic";
        } else if (priceId === professionalId) {
          planId = "professional";
        }

        await userCollection.updateOne(
          { stripeCustomerId: customer },
          {
            $set: {
              currentPlan: planId,
              updatedAt: new Date(),
            },
          },
        );

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const customer = subscription.customer as string;

        await userCollection.updateOne(
          { stripeCustomerId: customer },
          {
            $set: {
              currentPlan: "free",
              updatedAt: new Date(),
            },
          },
        );

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error processing webhook: ${error}`);
    return createResponse({ error: "Error processing webhook" }, 500);
  }

  return createResponse({ received: true }, 200);
}
