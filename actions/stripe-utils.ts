import { ObjectId } from "mongodb";
import { getUserCollection } from "@/lib/collections";

export async function processSuccessfulPayment({
  userId,
  planId,
  paymentIntentId,
  amount,
}: {
  userId: string;
  planId: "basic" | "professional";
  paymentIntentId: string;
  amount: number;
}) {
  try {
    const userCollection = await getUserCollection();

    const existingPayment = await userCollection.findOne({
      _id: new ObjectId(userId),
      "paymentHistory.paymentIntentId": paymentIntentId,
    });

    if (existingPayment) {
      return { success: true, alreadyProcessed: true, error: undefined };
    }

    const user = await userCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return {
        success: false,
        alreadyProcessed: false,
        error: "User not found!",
      };
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
      paymentIntentId,
      amount,
      planId,
      status: "succeeded",
      createdAt: now,
    });

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          currentPlan: planId,
          planExpiresAt: expiresAt,
          purchasedPlans,
          paymentHistory,
          updatedAt: now,
        },
      },
    );

    return { success: true, alreadyProcessed: false, error: undefined };
  } catch (error) {
    console.error("Error processing payment:", error);
    return {
      success: false,
      alreadyProcessed: false,
      error: "Failed to process payment!",
    };
  }
}
