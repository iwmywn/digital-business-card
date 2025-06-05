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
import type { ProfileFormValues } from "@/components/information-form";
import { extractCloudinaryPath } from "@/lib/utils";
import type { ImageTransform } from "@/components/image-editor-dialog";
import type { SettingsFormValues } from "@/components/account-form";
import type { NotificationSettingsFormValues } from "@/components/notification-settings";

type ImageKey = "profileImage" | "coverImage";
export async function updateProfile(
  values: ProfileFormValues,
  imageTransforms?: {
    profile?: ImageTransform;
    cover?: ImageTransform;
  },
) {
  try {
    const { isSignedIn, userId } = await session.user.get();

    if (!isSignedIn || !userId) {
      return { error: "Unauthorized!" };
    }

    const parsedValues = publicProfileSchema.safeParse(values);

    if (!parsedValues.success) {
      return { error: "Invalid data provided!" };
    }

    const updatedProfile = { ...parsedValues.data };
    const updatedImageTransform = { ...imageTransforms };

    if (updatedImageTransform?.profile) {
      updatedImageTransform.profile.croppedImageUrl = null;
    }
    if (updatedImageTransform?.cover) {
      updatedImageTransform.cover.croppedImageUrl = null;
    }

    const imageKeys: ImageKey[] = ["profileImage", "coverImage"];

    for (const key of imageKeys) {
      const image = updatedProfile[key];
      const folder = key.replace("Image", "");

      if (!image) continue;

      if (image[1].startsWith("data:")) {
        const { path, error } = await uploadToCloudinary(image[1], folder);
        if (error || !path) {
          return { error };
        } else {
          updatedProfile[key] = [image[0], path];
        }
      } else if (image[1].startsWith("https://")) {
        const { path, error } = extractCloudinaryPath(image[1]);
        if (error || !path) {
          return { error: error };
        } else {
          updatedProfile[key] = [image[0], path];
        }
      }
    }

    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return { error: "User not found!" };
    }

    const { profile } = existingUser;

    const isSame =
      updatedProfile.profileImage?.[0] === profile.profileImage?.[0] &&
      updatedProfile.profileImage?.[1] === profile.profileImage?.[1] &&
      updatedProfile.coverImage?.[0] === profile.coverImage?.[0] &&
      updatedProfile.coverImage?.[1] === profile.coverImage?.[1] &&
      updatedProfile.fullName === profile.fullName &&
      updatedProfile.gender === profile.gender &&
      updatedProfile.dateOfBirth === profile.dateOfBirth &&
      updatedProfile.jobTitle === profile.jobTitle &&
      updatedProfile.company === profile.company &&
      updatedProfile.website === profile.website &&
      updatedProfile.bio === profile.bio &&
      JSON.stringify(updatedImageTransform) ===
        JSON.stringify(profile.imageTransforms);

    if (isSame) {
      return { success: "No changes were made." };
    }

    const userCollection = await getUserCollection();

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          profile: {
            ...updatedProfile,
            imageTransforms: updatedImageTransform,
          },
          updatedAt: new Date(),
        },
      },
    );

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

    const userCollection = await getUserCollection();

    const existingUsername = await userCollection.findOne({
      username,
      _id: { $ne: new ObjectId(userId) },
    });

    if (existingUsername) {
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

    const userCollection = await getUserCollection();

    await userCollection.updateOne(
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

    const userCollection = await getUserCollection();

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          notificationSettings: parsedValues.data,
          updatedAt: new Date(),
        },
      },
    );

    return { success: "Your settings have been changed." };
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return {
      error: "Failed to update notification settings! Please try again later.",
    };
  }
}
