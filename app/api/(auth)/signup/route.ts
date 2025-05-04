"use server";

import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { signUpSchema } from "@/schemas";
import { createResponse } from "@/app/api/utils";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { getUserCollection } from "@/lib/collections";
import { getAvatars, getUserByEmail } from "@/lib/data";
import { createStripeCustomer } from "@/actions/stripe";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const data = await req.json();
  const { recaptchaToken, ...userData } = data;

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return createResponse("Captcha challenge failed!", 422);

  const parsedCredentials = signUpSchema.safeParse(userData);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { name, email, phone, password } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser) return createResponse("Email already signed up!", 400);

  const [hashedPassword, avatars, customer] = await Promise.all([
    bcrypt.hash(password, 10),
    getAvatars(),
    createStripeCustomer(email, name),
  ]);

  if (customer.error) {
    return createResponse(customer.error, 400);
  }

  const verificationToken = nanoid();
  const avatar = avatars[Math.floor(Math.random() * 20)].image;

  const result = await (
    await getUserCollection()
  ).insertOne({
    name,
    email,
    phone,
    password: hashedPassword,
    emailVerified: false,
    avatar: `${avatar}`,
    verificationToken,
    resendVerification: 1,
    stripeCustomerId: customer.customerId,
    currentPlan: "free",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!result.acknowledged)
    return createResponse("Account creation failed! Try again later.", 500);

  await sendEmail(email, verificationToken, "verifyEmail");

  return createResponse("Verification email sent.", 201);
}
