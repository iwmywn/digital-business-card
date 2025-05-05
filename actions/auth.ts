"use server";

import { createStripeCustomer } from "@/actions/stripe";
import { EmailFormValues } from "@/components/forgot-password-form";
import { PrivateFormValues } from "@/components/private-form";
import { ResetPasswordFormValues } from "@/components/reset-password-form";
import { SignInFormValues } from "@/components/signin-form";
import { SignUpFormValues } from "@/components/signup-form";
import {
  getPrivateTokenCollection,
  getUserCollection,
} from "@/lib/collections";
import { getAvatars, getUserByEmail, getUserById } from "@/lib/data";
import { sendEmail } from "@/lib/email";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { session } from "@/lib/session";
import {
  emailSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  tokenSchema,
} from "@/schemas";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function signUp(
  values: SignUpFormValues,
  recaptchaToken: string | null,
) {
  if (!recaptchaToken) return { error: "Missing recaptcha token!" };

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return { error: "Captcha challenge failed!" };

  const parsedCredentials = signUpSchema.safeParse(values);

  if (!parsedCredentials.success) return { error: "Invalid field!" };

  const { name, email, phone, password } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: "Email already signed up!" };

  const [hashedPassword, avatars, customer] = await Promise.all([
    bcrypt.hash(password, 10),
    getAvatars(),
    createStripeCustomer(email, name),
  ]);

  if (customer.error) {
    return { error: customer.error };
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
    return { error: "Account creation failed! Try again later." };

  await sendEmail(email, verificationToken, "verifyEmail");

  return { success: "Verification email sent." };
}

export async function signIn(values: SignInFormValues) {
  const parsedCredentials = signInSchema.safeParse(values);

  if (!parsedCredentials.success) return { error: "Invalid field!" };

  const { email, password } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: "Email or password is incorrect!" };

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) return { error: "Email or password is incorrect!" };

  if (!existingUser.emailVerified)
    return {
      error: "Account not verified. Please check your email to verify!",
    };

  await session.user.create(existingUser._id.toString());

  return { success: "Sign in successful." };
}

export async function forgotPassword(
  values: EmailFormValues,
  recaptchaToken: string | null,
) {
  if (!recaptchaToken) return { error: "Missing recaptcha token!" };

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return { error: "Captcha challenge failed!" };

  const parsedCredentials = emailSchema.safeParse(values);

  if (!parsedCredentials.success) return { error: "Invalid field!" };

  const { email } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser)
    return {
      success:
        "If this email is valid, we will send a new password reset email.",
    };

  if (existingUser.resendVerification >= 2)
    return { error: "You have reached the maximum number of resend attempts!" };

  const verificationToken = nanoid();

  const result = await (
    await getUserCollection()
  ).updateOne(
    { email: email },
    {
      $set: { verificationToken: verificationToken },
      $inc: { resendVerification: 1 },
    },
  );

  if (result.modifiedCount === 0)
    return { error: "Request failed! Try again later." };

  await sendEmail(email, verificationToken, "resetPassword");

  return {
    success: "If this email is valid, we will send a new password reset email.",
  };
}

export async function resetPassword(
  values: ResetPasswordFormValues,
  email: string | undefined,
  token: string | undefined,
) {
  const parsedCredentials = resetPasswordSchema.safeParse(values);

  if (!parsedCredentials.success) return { error: "Invalid field!" };

  const { password } = parsedCredentials.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!token || !email) return { error: "Invalid field!" };

  const user = await (
    await getUserCollection()
  ).findOne({ email: email, verificationToken: token });

  if (!user) return { error: "Token expired!" };

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

  if (result.matchedCount === 0) return { error: "Token expired!" };

  if (result.modifiedCount === 0)
    return { error: "Password update failed! Try again later." };

  return { success: "Your password has been changed." };
}

export async function verifyEmail(
  email: string | undefined,
  token: string | undefined,
) {
  if (!token || !email) return { error: "Invalid field!" };

  const user = await (
    await getUserCollection()
  ).findOne({ email: email, verificationToken: token });

  if (!user) return { error: "Token expired or email already verified!" };

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
    return { error: "Email verification failed! Try again later." };

  return { success: "Email verified successfully." };
}

export async function signOut() {
  await session.user.delete();
  return { success: "Sign out successful." };
}

export async function signInPrivate(
  values: PrivateFormValues,
  recaptchaToken: string | null,
) {
  if (!recaptchaToken) return { error: "Missing recaptcha token!" };

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return { error: "Captcha challenge failed!" };

  const parsedCredentials = tokenSchema.safeParse(values);

  if (!parsedCredentials.success) return { error: "Invalid field!" };

  const { token } = parsedCredentials.data;

  const privateTokenCollection = await getPrivateTokenCollection();
  const existingToken = await privateTokenCollection.findOne({ token: token });

  if (!existingToken) return { error: "Token expired!" };

  const [result] = await Promise.all([
    privateTokenCollection.deleteOne({ token: token }),
    session.private.create(),
  ]);

  if (!result.acknowledged) {
    return { error: "Request failed! Try again later." };
  }

  return { success: "Has access" };
}

export async function me() {
  const { isSignedIn, userId } = await session.user.get();

  if (!isSignedIn || !userId) {
    return { error: "Unauthorized!" };
  }

  const existingUser = await getUserById(userId);

  if (!existingUser) return { error: "User not found!" };

  const { name, email, avatar, currentPlan } = existingUser;

  return {
    name,
    email,
    avatar,
    currentPlan,
  };
}
