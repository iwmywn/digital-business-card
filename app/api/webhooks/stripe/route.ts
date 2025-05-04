import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { createResponse } from "@/app/api/utils";
import { processSuccessfulPayment } from "@/actions/stripe-utils";
import { session } from "@/lib/session";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return createResponse({ error: `Webhook Error: ${errorMessage}` }, 400);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      if (checkoutSession.payment_status === "paid") {
        const userId = checkoutSession.metadata?.userId;
        const planId = checkoutSession.metadata?.planId as
          | "basic"
          | "professional"
          | undefined;

        if (!userId || !planId) {
          console.error("Missing user ID or plan ID!");
          return createResponse(
            { received: true, warning: "Missing user ID or plan ID!" },
            200,
          );
        }

        const paymentIntentId =
          typeof checkoutSession.payment_intent === "string"
            ? checkoutSession.payment_intent
            : checkoutSession.payment_intent?.id;

        if (!paymentIntentId) {
          console.error("Missing payment intent ID!");
          return createResponse(
            { received: true, warning: "Missing payment intent ID!" },
            200,
          );
        }

        const amount = checkoutSession.amount_total
          ? checkoutSession.amount_total / 100
          : 0;

        const { userId: id } = await session.user.get();
        const idType = typeof id;
        const idValue = id;
        const userIdType = typeof userId;
        const userIdValue = userId;

        if (userId !== id) {
          console.error(
            "User ID mismatch: Webhook called with different user ID than current session!",
          );
          return createResponse(
            {
              received: true,
              warning: `User ID mismatch! ${idType} ${idValue} ${userIdType} ${userIdValue}`,
            },
            200,
          );
        }

        const { success, error, alreadyProcessed } =
          await processSuccessfulPayment({
            userId,
            planId,
            paymentIntentId,
            amount,
          });

        if (error || !success) {
          console.error(`Error processing payment: ${error}`);
          return createResponse({ received: true, warning: error }, 200);
        }

        if (alreadyProcessed) {
          console.log(`Payment ${paymentIntentId} already processed!`);
          return createResponse(
            { received: true, status: "already_processed" },
            200,
          );
        }

        return createResponse({ received: true, status: "processed" }, 200);
      }
    }

    return createResponse({ received: true }, 200);
  } catch (error) {
    console.error(`Error processing webhook: ${error}`);
    return createResponse(
      { received: true, error: "Failed to process webhook!" },
      200,
    );
  }
}
