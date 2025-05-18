"use server";

import { ObjectId } from "mongodb";
import { getCardCollection, getUserCollection } from "@/lib/collections";
import { session } from "@/lib/session";
import { getUserById } from "@/lib/data";
import { getPaymentDetails } from "@/actions/stripe";
import { ReceiptData } from "@/components/payment-receipt-dialog";

export async function switchToPlan(planId: "free" | "basic" | "professional") {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) return { error: "User not found!" };

    const now = new Date();
    const [userCollection, cardCollection] = await Promise.all([
      getUserCollection(),
      getCardCollection(),
    ]);

    if (planId === "free") {
      await Promise.all([
        userCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              currentPlan: "free",
              planExpiresAt: undefined,
              updatedAt: now,
            },
          },
        ),
        cardCollection.updateMany(
          { userId },
          { $set: { isPublic: true, updatedAt: now } },
        ),
      ]);

      return { error: undefined };
    }

    const validPlan = existingUser.purchasedPlans?.find(
      (plan) => plan.planId === planId && new Date(plan.expiresAt) > now,
    );

    if (!validPlan) {
      return { error: "Plan not purchased or expired!" };
    }

    if (planId === "basic") {
      cardCollection.updateMany(
        { userId },
        { $set: { isPublic: true, updatedAt: now } },
      );
    }

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          currentPlan: planId,
          planExpiresAt: validPlan.expiresAt,
          updatedAt: now,
        },
      },
    );

    return { error: undefined };
  } catch (error) {
    console.error("Error switching plan:", error);
    return { error: "Failed to switch plan! Please try again later." };
  }
}

export async function getPaymentHistoryDetails(
  paymentIntentId: string,
): Promise<{
  data?: ReceiptData;
  error?: string;
}> {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) {
      return { error: "User not found!" };
    }

    const paymentRecord = existingUser.paymentHistory?.find(
      (payment) => payment.paymentIntentId === paymentIntentId,
    );

    if (!paymentRecord) {
      return { error: "Payment record not found!" };
    }

    const paymentDetails = await getPaymentDetails(paymentIntentId);

    return paymentDetails;
  } catch (error) {
    console.error("Error getting receipt details:", error);
    return { error: "Failed to get receipt details! Please try again later." };
  }
}

export async function getSubscriptionPlans() {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) return { error: "User not found!" };

    const now = new Date();
    const validBasicPlan = existingUser.purchasedPlans?.find(
      (plan) => plan.planId === "basic" && new Date(plan.expiresAt) > now,
    );
    const validProfessionalPlan = existingUser.purchasedPlans?.find(
      (plan) =>
        plan.planId === "professional" && new Date(plan.expiresAt) > now,
    );

    if (existingUser.planExpiresAt) {
      const expirationDate = new Date(existingUser.planExpiresAt);

      if (now > expirationDate) {
        const [userCollection, cardCollection] = await Promise.all([
          getUserCollection(),
          getCardCollection(),
        ]);

        await Promise.all([
          userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                currentPlan: "free",
                planExpiresAt: undefined,
                updatedAt: now,
              },
            },
          ),
          cardCollection.updateMany(
            { userId },
            { $set: { isPublic: true, updatedAt: now } },
          ),
        ]);

        return {
          basic: {
            hasAccess: validBasicPlan ? true : false,
            expiresAt: validBasicPlan
              ? new Date(validBasicPlan.expiresAt)
              : null,
          },
          professional: {
            hasAccess: validProfessionalPlan ? true : false,
            expiresAt: validProfessionalPlan
              ? new Date(validProfessionalPlan.expiresAt)
              : null,
          },
          paymentHistory: existingUser.paymentHistory,
        };
      }
    }

    return {
      basic: {
        hasAccess: validBasicPlan ? true : false,
        expiresAt: validBasicPlan ? new Date(validBasicPlan.expiresAt) : null,
      },
      professional: {
        hasAccess: validProfessionalPlan ? true : false,
        expiresAt: validProfessionalPlan
          ? new Date(validProfessionalPlan.expiresAt)
          : null,
      },
      paymentHistory: existingUser.paymentHistory,
    };
  } catch (error) {
    console.error("Error getting plan status: ", error);
    return { error: "Failed to get plan status! Please try again later." };
  }
}
