"use server";

import { createResponse } from "@/app/api/utils";
import { getUserCollection } from "@/lib/collections";
import { resetPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const data = await req.json();
  const parsedCredentials = resetPasswordSchema.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { password } = parsedCredentials.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!token || !email) return createResponse("Invalid field!", 400);

  const user = await (
    await getUserCollection()
  ).findOne({ email: email, verificationToken: token });

  if (!user) return createResponse("Token expired!", 404);

  const result = await (
    await getUserCollection()
  ).updateOne(
    { email: email!, verificationToken: token! },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
        resendVerification: 0,
      },
      $unset: { verificationToken: "" },
    },
  );

  if (result.matchedCount === 0) return createResponse("Token expired!", 404);

  if (result.modifiedCount === 0)
    return createResponse("Password update failed! Try again later.", 500);

  return createResponse("Your password has been changed.", 201);
}
