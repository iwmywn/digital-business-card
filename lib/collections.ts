import { collection } from "@/lib/mongodb";
import { DBUser, DBAvatar } from "@/lib/definitions";

export async function getAvatarCollection() {
  return await collection<DBAvatar>("avatars");
}

export async function getUserCollection() {
  return await collection<DBUser>("users");
}
