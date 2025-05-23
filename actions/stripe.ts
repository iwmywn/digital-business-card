"use server";

import Stripe from "stripe";
import { session } from "@/lib/session";
import { getUserById } from "@/lib/data";
import { processSuccessfulPayment } from "./stripe-utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function createCheckoutSession(priceId: string, planId: string) {
  try {
    if (!priceId) {
      return { error: "Invalid price ID!" };
    }

    if (!planId) {
      return { error: "Invalid plan ID!" };
    }

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
      success_url: `${url}/subscription/status?session_id={CHECKOUT_SESSION_ID}`,
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

    return { url: stripeSession.url, error: undefined };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      error: "Failed to create checkout session! Please try again later.",
    };
  }
}

export async function verifyCheckoutSession(sessionId: string) {
  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (checkoutSession.payment_status === "paid") {
      const userId = checkoutSession.metadata?.userId;
      const planId = checkoutSession.metadata?.planId as
        | "basic"
        | "professional"
        | undefined;

      if (!userId || !planId) {
        return {
          error: "Missing user ID or plan ID!",
        };
      }

      const paymentIntentId =
        typeof checkoutSession.payment_intent === "string"
          ? checkoutSession.payment_intent
          : checkoutSession.payment_intent?.id;

      if (!paymentIntentId) {
        return {
          error: "Missing payment intent ID!",
        };
      }

      const amount = checkoutSession.amount_total
        ? checkoutSession.amount_total / 100
        : 0;
      const { userId: id } = await session.user.get();

      if (userId !== id)
        return {
          error: "unauthorized_access",
        };

      const { error } = await processSuccessfulPayment({
        userId,
        planId,
        paymentIntentId,
        amount,
      });

      if (error) {
        return { error };
      }

      return {
        success: `Your ${planId} plan with the transaction ID ${paymentIntentId.slice(3)} is active. Thank you for your payment.`,
      };
    }

    return { error: undefined };
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return {
      error: "Failed to verify checkout session! PLease try again later.",
    };
  }
}

export async function createStripeCustomer(email: string, name: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return { customerId: customer.id, error: undefined };
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return {
      error: "Failed to create Stripe customer! Please try again later.",
    };
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

    return { data: receiptData, error: undefined };
  } catch (error) {
    console.error("Error retrieving payment details:", error);
    return {
      error: "Failed to retrieve payment details! Please try again later.",
    };
  }
}
