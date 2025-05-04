"use server";

import { ObjectId } from "mongodb";
import { getUserCollection } from "@/lib/collections";
import { session } from "@/lib/session";
import { getUserById } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function updatePlanIfExpired() {
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
    (plan) => plan.planId === "professional" && new Date(plan.expiresAt) > now,
  );

  if (existingUser.planExpiresAt) {
    const expirationDate = new Date(existingUser.planExpiresAt);

    if (now > expirationDate) {
      const userCollection = await getUserCollection();

      await userCollection.updateOne(
        { _id: new ObjectId(existingUser._id) },
        {
          $set: {
            currentPlan: "free",
            planExpiresAt: undefined,
            updatedAt: now,
          },
        },
      );

      return {
        currentPlan: "free",
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
      };
    }
  }

  return {
    currentPlan: existingUser.currentPlan,
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
  };
}

export async function switchToPlan(planId: "free" | "basic" | "professional") {
  const { isSignedIn, userId } = await session.user.get();

  if (!isSignedIn || !userId) {
    return { error: "Unauthorized!" };
  }

  const existingUser = await getUserById(userId);

  if (!existingUser) return { error: "User not found!" };

  const now = new Date();
  const userCollection = await getUserCollection();

  if (planId === "free") {
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          currentPlan: "free",
          planExpiresAt: undefined,
          updatedAt: now,
        },
      },
    );
    return { success: true };
  }

  const validPlan = existingUser.purchasedPlans?.find(
    (plan) => plan.planId === planId && new Date(plan.expiresAt) > now,
  );

  if (!validPlan) {
    return { error: "Plan not purchased or expired" };
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

  revalidatePath("/subscription");
  return { success: true };
}
