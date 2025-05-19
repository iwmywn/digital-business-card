"use server";

import { getAvatarCollection, getUserCollection } from "@/lib/collections";
import { Avatar, User } from "@/lib/definitions";
import { ObjectId } from "mongodb";
import { cache } from "react";

export async function getUserById(id: string) {
  try {
    const user = await (
      await getUserCollection()
    ).findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await (await getUserCollection()).findOne({ email });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user = await (await getUserCollection()).findOne({ username });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

export async function getUserBySlug(slug: string) {
  try {
    const isValidObjectId =
      ObjectId.isValid(slug) && new ObjectId(slug).toString() === slug;
    const query = isValidObjectId
      ? { _id: new ObjectId(slug) }
      : { username: slug };
    const user = await (
      await getUserCollection()
    ).findOne(query, { projection: { profile: 1, createdAt: 1 } });

    if (!user) return null;

    return {
      _id: user._id.toString(),
      profile: user.profile,
      createdAt: user.createdAt,
    } as Pick<User, "_id" | "profile" | "createdAt">;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

export const getAvatars = cache(async (): Promise<Avatar[]> => {
  try {
    const avatars = await (await getAvatarCollection()).find({}).toArray();

    return avatars.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch avatars:", error);
    return [];
  }
});
