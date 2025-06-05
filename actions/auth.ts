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
import { User } from "@/lib/definitions";
import { sendEmailWithRetry } from "@/lib/email";
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
  try {
    if (!recaptchaToken) return { error: "Missing recaptcha token!" };

    const parsedValues = signUpSchema.safeParse(values);

    if (!parsedValues.success) return { error: "Invalid data provided!" };

    const { fullName, email, phone, password } = parsedValues.data;

    const [verify, existingUser] = await Promise.all([
      verifyRecaptchaToken(recaptchaToken),
      getUserByEmail(email),
    ]);

    if (!verify) return { error: "Captcha challenge failed!" };
    if (existingUser) return { error: "Email already signed up!" };

    const [hashedPassword, avatars, customer] = await Promise.all([
      bcrypt.hash(password, 10),
      getAvatars(),
      createStripeCustomer(email, fullName),
    ]);

    if (customer.error || !customer.customerId) {
      console.error(customer.error);
      return { error: "Account creation failed! Try again later." };
    }

    const verificationToken = nanoid();
    const avatar = avatars[Math.floor(Math.random() * 20)].image;
    const userCollection = await getUserCollection();

    const result = await userCollection.insertOne({
      username: "",
      email,
      phone,
      password: hashedPassword,
      emailVerified: false,
      verificationToken,
      resendVerification: 1,
      stripeCustomerId: customer.customerId,
      profile: {
        profileImage: ["duobwq5xg", avatar],
        // coverImage: undefined,
        fullName,
        gender: "",
        // dateOfBirth: undefined,
        jobTitle: "",
        company: "",
        website: "",
        bio: "",
        imageTransforms: {},
      },
      notificationSettings: {
        email: true,
        cardView: true,
        marketing: true,
        security: true,
      },
      currentPlan: "free",
      planExpiresAt: undefined,
      purchasedPlans: [],
      paymentHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!result.acknowledged)
      return { error: "Account creation failed! Try again later." };

    const emailResult = await sendEmailWithRetry(
      email,
      verificationToken,
      "verifyEmail",
    );

    if (emailResult.error) {
      await userCollection.deleteOne({ _id: result.insertedId });
      return { error: emailResult.error };
    }

    return { success: "Verification email sent.", error: undefined };
  } catch (error) {
    console.error("Error signing up: ", error);
    return { error: "Failed to sign up! Please try again later." };
  }
}

export async function signIn(values: SignInFormValues) {
  try {
    const parsedValues = signInSchema.safeParse(values);

    if (!parsedValues.success) return { error: "Invalid data provided!" };

    const { email, password } = parsedValues.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) return { error: "Email or password is incorrect!" };

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) return { error: "Email or password is incorrect!" };

    if (!existingUser.emailVerified)
      return {
        error: "Account not verified. Please check your email to verify!",
      };

    await session.user.create(existingUser._id.toString());

    return { error: undefined };
  } catch (error) {
    console.error("Error signing in: ", error);
    return { error: "Failed to sign in! Please try again later." };
  }
}

export async function forgotPassword(
  values: EmailFormValues,
  recaptchaToken: string | null,
) {
  try {
    if (!recaptchaToken) return { error: "Missing recaptcha token!" };

    const parsedValues = emailSchema.safeParse(values);

    if (!parsedValues.success) return { error: "Invalid data provided!" };

    const { email } = parsedValues.data;

    const [verify, existingUser] = await Promise.all([
      verifyRecaptchaToken(recaptchaToken),
      getUserByEmail(email),
    ]);

    if (!verify) return { error: "Captcha challenge failed!" };

    if (!existingUser)
      return {
        success:
          "If this email is valid, we will send a new password reset email.",
        error: undefined,
      };

    if (!existingUser.emailVerified)
      return {
        error: "Account not verified. Please check your email to verify!",
      };

    if (existingUser.resendVerification >= 2)
      return {
        error: "You have reached the maximum number of resend attempts!",
      };

    const verificationToken = nanoid();
    const userCollection = await getUserCollection();

    await userCollection.updateOne(
      { email },
      {
        $set: { verificationToken, updatedAt: new Date() },
        $inc: { resendVerification: 1 },
      },
    );

    const emailResult = await sendEmailWithRetry(
      email,
      verificationToken,
      "resetPassword",
    );

    if (emailResult.error) {
      await userCollection.updateOne(
        { email },
        { $inc: { resendVerification: -1 } },
      );
      return { error: emailResult.error };
    }

    return {
      success:
        "If this email is valid, we will send a new password reset email.",
      error: undefined,
    };
  } catch (error) {
    console.error("Error sending reset password email: ", error);
    return {
      error: "Failed to send reset password email! Please try again later.",
    };
  }
}

export async function resetPassword(
  values: ResetPasswordFormValues,
  email: string | undefined,
  token: string | undefined,
) {
  try {
    const parsedValues = resetPasswordSchema.safeParse(values);

    if (!parsedValues.success) return { error: "Invalid data provided!" };

    const { password } = parsedValues.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!token || !email) return { error: "Invalid data provided!" };

    const userCollection = await getUserCollection();
    const user = await userCollection.findOne({
      email: email,
      verificationToken: token,
    });

    if (!user) return { error: "Token expired!" };

    await userCollection.updateOne(
      { email: email, verificationToken: token },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
          resendVerification: 0,
        },
        $unset: { verificationToken: "" },
      },
    );

    return { success: "Your password has been changed.", error: undefined };
  } catch (error) {
    console.error("Error reseting password: ", error);
    return { error: "Failed to reset password! Please try again later." };
  }
}

export async function verifyEmail(
  email: string | undefined,
  token: string | undefined,
) {
  try {
    if (!token || !email) return { error: "Invalid data provided!" };

    const userCollection = await getUserCollection();
    const user = await userCollection.findOne({
      email: email,
      verificationToken: token,
    });

    if (!user) return { error: "Token expired or email already verified!" };

    await userCollection.updateOne(
      { verificationToken: token },
      {
        $set: {
          emailVerified: true,
          updatedAt: new Date(),
          resendVerification: 0,
        },
        $unset: { verificationToken: "" },
      },
    );

    return { success: "Email verified successfully.", error: undefined };
  } catch (error) {
    console.error("Error verifying email: ", error);
    return { error: "Failed to verify email! Please try again later." };
  }
}

export async function findEmailAndToken(
  email: string | undefined,
  token: string | undefined,
) {
  try {
    if (!token || !email) return { error: "Invalid data provided!" };

    const user = await (
      await getUserCollection()
    ).findOne({ email: email, verificationToken: token });

    if (!user) return { error: "Token expired!" };

    return { error: undefined };
  } catch (error) {
    console.error("Error finding email and token: ", error);
    return { error: "Failed to find email and token! Please try again later." };
  }
}

export async function signOut() {
  try {
    await session.user.delete();
    return { success: "You need to sign back in.", error: undefined };
  } catch (error) {
    console.error("Error signing out: ", error);
    return { error: "Failed to sign out! Please try again later." };
  }
}

export async function signInPrivate(
  values: PrivateFormValues,
  recaptchaToken: string | null,
) {
  try {
    if (!recaptchaToken) return { error: "Missing recaptcha token!" };

    const parsedValues = tokenSchema.safeParse(values);

    if (!parsedValues.success) return { error: "Invalid data provided!" };

    const { token } = parsedValues.data;

    const [verify, privateTokenCollection] = await Promise.all([
      verifyRecaptchaToken(recaptchaToken),
      getPrivateTokenCollection(),
    ]);

    if (!verify) return { error: "Captcha challenge failed!" };

    const existingToken = await privateTokenCollection.findOne({
      token,
    });

    if (!existingToken) return { error: "Token expired!" };

    await Promise.all([
      privateTokenCollection.deleteOne({ token }),
      session.private.create(),
    ]);

    return {
      success: "You have 2 hours for this session.",
      error: undefined,
    };
  } catch (error) {
    console.error("Error verifying private token: ", error);
    return { error: "Failed to verify private token! Please try again later." };
  }
}

export async function me() {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser) return { error: "User not found!" };

    const user = { ...existingUser, _id: existingUser._id.toString() } as User;

    return { user };
  } catch (error) {
    console.error("Error fetching me: ", error);
    return { error: "Failed to fetch me! Please try again later." };
  }
}
