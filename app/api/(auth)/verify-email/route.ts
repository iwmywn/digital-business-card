"use server";

import { getUserCollection } from "@/lib/collections";
import { createResponse } from "@/app/api/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) return createResponse("Invalid field!", 400);

  const user = await (
    await getUserCollection()
  ).findOne({ email: email, verificationToken: token });

  if (!user)
    return createResponse("Token expired or email already verified!", 404);

  try {
    const userUpdateResult = await (
      await getUserCollection()
    ).updateOne(
      { verificationToken: token! },
      {
        $set: {
          emailVerified: true,
          updatedAt: new Date(),
          resendVerification: 0,
        },
        $unset: { verificationToken: "" },
      },
    );

    if (userUpdateResult.modifiedCount === 0)
      return createResponse("Email verification failed! Try again later.", 500);

    return createResponse("Email verified successfully.", 200);
  } catch (error) {
    console.error("Error during email verification:", error);
    return createResponse("An error occurred. Please try again later.", 500);
  }
}
