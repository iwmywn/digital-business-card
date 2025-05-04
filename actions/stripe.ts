"use server";

import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { getUserCollection } from "@/lib/collections";
import { session } from "@/lib/session";
import { getUserById } from "@/lib/data";
import { basicId, professionalId } from "@/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
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
      expand: ["line_items"],
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

        const user = await userCollection.findOne({
          _id: new ObjectId(userId),
        });

        if (user) {
          const purchasedPlans = user.purchasedPlans || [];

          purchasedPlans.push({
            planId,
            purchasedAt: now,
            expiresAt,
          });

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
        }
      }

      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return { error: "Failed to verify checkout session!" };
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
