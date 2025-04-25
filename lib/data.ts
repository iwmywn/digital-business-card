"use server";

import { getAvatarCollection, getUserCollection } from "@/lib/collections";
import { Avatar } from "@/lib/definitions";
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
