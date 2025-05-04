import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { getUserCollection } from "@/lib/collections";
import { createResponse } from "@/app/api/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
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

        // Lấy userId từ metadata
        const userId = checkoutSession.metadata?.userId;
        if (!userId) {
          console.error("No userId found in checkout session metadata");
          break;
        }

        console.log(`Processing checkout session for user: ${userId}`);

        // For one-time payments, we need to determine the plan from the line items
        if (checkoutSession.payment_status === "paid") {
          console.log("Payment status is paid, processing...");

          // Get the line items to determine which plan was purchased
          const lineItems = await stripe.checkout.sessions.listLineItems(
            checkoutSession.id,
          );

          console.log("Line items:", JSON.stringify(lineItems.data));

          const priceId = lineItems.data[0]?.price?.id;
          console.log(`Price ID from line items: ${priceId}`);

          // Xác định planId dựa trên priceId
          let planId: "basic" | "professional" | null = null;
          if (priceId === "price_1RKWqsGLhvibmNX6JwNErxrI") {
            planId = "professional";
          } else if (priceId === "price_1RKWrNGLhvibmNX6gVIdO8tm") {
            planId = "basic";
          }

          if (!planId) {
            console.error(`Unknown price ID: ${priceId}`);
            break;
          }

          console.log(`Plan ID determined: ${planId}`);

          // Calculate plan expiration date
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setDate(now.getDate() + 30);

          console.log(`Plan expires at: ${expiresAt.toISOString()}`);

          // Get the user to update their purchased plans
          const user = await userCollection.findOne({
            _id: new ObjectId(userId),
          });

          if (!user) {
            console.error(`User not found: ${userId}`);
            break;
          }

          // Prepare purchased plans array
          const purchasedPlans = user.purchasedPlans || [];

          // Add the new plan
          purchasedPlans.push({
            planId,
            purchasedAt: now,
            expiresAt,
          });

          // Update user with new plan and expiration
          await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                currentPlan: planId,
                planExpiresAt: expiresAt,
                purchasedPlans: purchasedPlans,
                updatedAt: now,
              },
            },
          );

          console.log(`User updated with plan: ${planId}`);
        } else {
          console.log(
            `Payment status is not paid: ${checkoutSession.payment_status}`,
          );
        }

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);

        // Check if this payment intent has metadata with userId and planId
        const userId = paymentIntent.metadata?.userId;
        const planId = paymentIntent.metadata?.planId as
          | "basic"
          | "professional"
          | undefined;

        if (userId && planId) {
          console.log(
            `Processing payment intent for user: ${userId}, plan: ${planId}`,
          );

          // Calculate plan expiration date
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setDate(now.getDate() + 30);

          // Get the user to update their purchased plans
          const user = await userCollection.findOne({
            _id: new ObjectId(userId),
          });

          if (!user) {
            console.error(`User not found: ${userId}`);
            break;
          }

          // Prepare purchased plans array
          const purchasedPlans = user.purchasedPlans || [];

          // Add the new plan
          purchasedPlans.push({
            planId,
            purchasedAt: now,
            expiresAt,
          });

          // Update user with new plan and expiration
          await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                currentPlan: planId,
                planExpiresAt: expiresAt,
                purchasedPlans: purchasedPlans,
                updatedAt: now,
              },
            },
          );

          console.log(`User updated with plan: ${planId}`);
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

        // Lấy thông tin khách hàng
        const customer = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;

        // Xác định planId dựa trên priceId
        let planId: "free" | "basic" | "professional" = "free";
        if (priceId === "price_1RKWqsGLhvibmNX6JwNErxrI") {
          planId = "professional";
        } else if (priceId === "price_1RKWrNGLhvibmNX6gVIdO8tm") {
          planId = "basic";
        }

        // Cập nhật thông tin người dùng
        await userCollection.updateOne(
          { stripeCustomerId: customer },
          {
            $set: {
              currentPlan: planId,
              updatedAt: new Date(),
            },
          },
        );

        console.log(
          `Subscription ${event.type.split(".").pop()}: ${subscription.id}`,
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Lấy thông tin khách hàng
        const customer = subscription.customer as string;

        // Cập nhật thông tin người dùng về gói miễn phí
        await userCollection.updateOne(
          { stripeCustomerId: customer },
          {
            $set: {
              currentPlan: "free",
              updatedAt: new Date(),
            },
          },
        );

        console.log(`Subscription deleted: ${subscription.id}`);
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
