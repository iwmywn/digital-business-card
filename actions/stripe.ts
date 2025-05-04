"use server";

import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { getUserCollection } from "@/lib/collections";
import { session } from "@/lib/session";
import { getUserById } from "@/lib/data";
import { basicId, professionalId } from "@/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function createCheckoutSession(priceId: string) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) return { error: "User not found!" };

    if (!existingUser.stripeCustomerId) {
      return { error: "No Stripe customer ID found" };
    }

    const url = process.env.NEXT_PUBLIC_URL;

    let planId: "basic" | "professional" | undefined;
    if (priceId === basicId) {
      planId = "basic";
    } else if (priceId === professionalId) {
      planId = "professional";
    }

    if (!planId) {
      return { error: "Invalid price ID" };
    }

    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      customer: existingUser.stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${url}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/subscription`,
      metadata: {
        userId: existingUser._id.toString(),
        planId: planId,
      },
      customer_update: {
        address: "auto",
        name: "auto",
      },
      billing_address_collection: "required",
    };

    const stripeSession = await stripe.checkout.sessions.create(sessionOptions);

    return { url: stripeSession.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { error: "Failed to create checkout session!" };
  }
}

export async function verifyCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

    if (session.payment_status === "paid") {
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId as
        | "basic"
        | "professional"
        | undefined;

      if (userId && planId) {
        const userCollection = await getUserCollection();

        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(now.getDate() + 30);

        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

        const user = await userCollection.findOne({
          _id: new ObjectId(userId),
          "paymentHistory.paymentIntentId": paymentIntentId,
        });

        if (user) {
          return {
            success: true,
            alreadyProcessed: true,
          };
        }

        const userToUpdate = await userCollection.findOne({
          _id: new ObjectId(userId),
        });

        if (userToUpdate) {
          const purchasedPlans = userToUpdate.purchasedPlans || [];

          purchasedPlans.push({
            planId,
            purchasedAt: now,
            expiresAt,
          });

          const paymentHistory = userToUpdate.paymentHistory || [];
          paymentHistory.push({
            paymentIntentId: paymentIntentId || "",
            amount: session.amount_total ? session.amount_total / 100 : 0,
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
      }

      return {
        success: true,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return { success: false, error: "Failed to verify checkout session!" };
  }
}

export async function createStripeCustomer(email: string, name: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return { customerId: customer.id };
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return { error: "Failed to create Stripe customer!" };
  }
}

export async function getPaymentDetails(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: [
          "customer",
          "payment_method",
          "latest_charge",
          "latest_charge.billing_details",
        ],
      },
    );

    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
      expand: ["data.line_items"],
    });

    const session = sessions.data[0];

    const receiptData = {
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
        created: new Date(paymentIntent.created * 1000).toISOString(),
      },
      customer: {
        name: session?.customer_details?.name || "",
        email: session?.customer_details?.email || "",
        address: {
          line1: session?.customer_details?.address?.line1 || "",
          line2: session?.customer_details?.address?.line2 || "",
          city: session?.customer_details?.address?.city || "",
          state: session?.customer_details?.address?.state || "",
          postal_code: session?.customer_details?.address?.postal_code || "",
          country: session?.customer_details?.address?.country || "",
        },
      },
      paymentMethod: {
        type:
          typeof paymentIntent.payment_method === "string"
            ? ""
            : paymentIntent.payment_method?.type || "",
        card: {
          brand:
            typeof paymentIntent.payment_method === "string"
              ? ""
              : paymentIntent.payment_method?.card?.brand || "",
          last4:
            typeof paymentIntent.payment_method === "string"
              ? ""
              : paymentIntent.payment_method?.card?.last4 || "",
          expMonth:
            typeof paymentIntent.payment_method === "string"
              ? ""
              : paymentIntent.payment_method?.card?.exp_month?.toString() || "",
          expYear:
            typeof paymentIntent.payment_method === "string"
              ? ""
              : paymentIntent.payment_method?.card?.exp_year?.toString() || "",
        },
      },
      lineItems:
        session?.line_items?.data.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          amount: item.amount_total / 100,
        })) || [],
    };

    return { success: true, data: receiptData };
  } catch (error) {
    console.error("Error retrieving payment details:", error);
    return { success: false, error: "Failed to retrieve payment details!" };
  }
}
