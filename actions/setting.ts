"use server";

import { getUserCollection } from "@/lib/collections";
import { getUserById } from "@/lib/data";
import { session } from "@/lib/session";
import {
  accountSchema,
  notificationSettingsSchema,
  publicProfileSchema,
} from "@/schemas";
import { ObjectId } from "mongodb";
import { uploadToCloudinary } from "@/lib/cloudinary";
import bcrypt from "bcryptjs";
import { type ProfileFormValues } from "@/components/information-form";
import { extractCloudinaryPath, isSameDate } from "@/lib/utils";
import { type ImageTransform } from "@/components/image-editor-dialog";
import { type SettingsFormValues } from "@/components/account-form";
import { NotificationSettingsFormValues } from "@/components/notification-settings";

export async function updateProfile(
  values: ProfileFormValues,
  imageTransform?: ImageTransform,
) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const parsedCredentials = publicProfileSchema.safeParse(values);

    if (!parsedCredentials.success) {
      return { error: "Invalid data provided!" };
    }

    const {
      avatar,
      fullName,
      gender,
      dateOfBirth,
      jobTitle,
      company,
      website,
      bio,
    } = parsedCredentials.data;
    const updatedProfile = { ...parsedCredentials.data };

    if (avatar) {
      if (avatar.startsWith("data:")) {
        const { path, error } = await uploadToCloudinary(avatar, "avatar");
        if (error || !path) {
          return { error };
        } else {
          updatedProfile.avatar = path;
        }
      } else if (avatar.startsWith("https://")) {
        const { path, error } = extractCloudinaryPath(avatar);
        if (error || !path) {
          return { error: error };
        } else {
          updatedProfile.avatar = path;
        }
      }
    }

    const updatedImageTransform = { ...imageTransform };

    if (updatedImageTransform) {
      updatedImageTransform.croppedImageUrl = null;
    }

    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return { error: "User not found!" };
    }

    const { profile } = existingUser;
    const isSame =
      avatar === profile.avatar &&
      fullName === profile.fullName &&
      gender === profile.gender &&
      isSameDate(dateOfBirth, profile.dateOfBirth) &&
      jobTitle === profile.jobTitle &&
      company === profile.company &&
      website === profile.website &&
      bio === profile.bio &&
      JSON.stringify(updatedImageTransform) ===
        JSON.stringify(profile.imageTransform);

    if (isSame) {
      return { success: "No changes were made." };
    }

    const result = await (
      await getUserCollection()
    ).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          profile: {
            ...updatedProfile,
            imageTransform: updatedImageTransform as ImageTransform | undefined,
          },
          updatedAt: new Date(),
        },
      },
    );

    if (!result.acknowledged) {
      return {
        error:
          "An error occurred while updating the public account! Please try again later.",
      };
    }

    return { success: "Your profile has been changed." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile! Please try again later." };
  }
}

export async function checkUsername(username: string) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const existingUser = await (
      await getUserCollection()
    ).findOne({
      username,
      _id: { $ne: new ObjectId(userId) },
    });

    if (existingUser) {
      return { error: `Username '${username}' is not available!` };
    }

    return { error: undefined };
  } catch (error) {
    console.error("Error checking username:", error);
    return { error: "Failed to check username! Please try again later." };
  }
}

export async function updateAccount(values: SettingsFormValues) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const parsedValues = accountSchema.safeParse(values);

    if (!parsedValues.success) {
      return { error: "Invalid data provided!" };
    }

    const { username, phone, currentPassword, newPassword } = parsedValues.data;

    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return { error: "User not found!" };
    }

    if (username) {
      const { error } = await checkUsername(username);

      if (error) {
        return { error: error };
      }
    }

    let hashedPassword: string;

    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        existingUser.password,
      );

      if (!isPasswordValid) {
        return { error: "Current password is incorrect!" };
      }

      hashedPassword = await bcrypt.hash(newPassword, 10);
    } else {
      hashedPassword = existingUser.password;
    }

    const isSame =
      username === existingUser.username &&
      phone === existingUser.phone &&
      hashedPassword === existingUser.password;

    if (isSame) {
      return { success: "No changes were made." };
    }

    const result = await (
      await getUserCollection()
    ).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          username,
          phone,
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    if (!result.acknowledged) {
      return {
        error:
          "An error occurred while updating the account! Please try again later.",
      };
    }

    return { success: "Your account has been changed." };
  } catch (error) {
    console.error("Error updating account:", error);
    return { error: "Failed to update account! Please try again later." };
  }
}

export async function updateNotificationSettings(
  values: NotificationSettingsFormValues,
) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const parsedValues = notificationSettingsSchema.safeParse(values);

    if (!parsedValues.success) {
      return { error: "Invalid data provided!" };
    }

    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return { error: "User not found!" };
    }

    const { notificationSettings } = existingUser;

    const { email, cardView, marketing, security } = parsedValues.data;

    const isSame =
      email === notificationSettings.email &&
      cardView === notificationSettings.cardView &&
      marketing === notificationSettings.marketing &&
      security === notificationSettings.security;

    if (isSame) {
      return { success: "No changes were made." };
    }

    const result = await (
      await getUserCollection()
    ).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          notificationSettings: parsedValues.data,
          updatedAt: new Date(),
        },
      },
    );

    if (!result.acknowledged) {
      return {
        error:
          "An error occurred while updating the notification settings! Please try again later.",
      };
    }

    return { success: "Your settings have been changed." };
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return {
      error: "Failed to update notification settings! Please try again later.",
    };
  }
}
