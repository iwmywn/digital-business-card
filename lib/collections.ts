import { collection } from "@/lib/mongodb";
import { DBPrivateToken, DBUser, DBAvatar } from "@/lib/definitions";

export async function getPrivateTokenCollection() {
  return await collection<DBPrivateToken>("private_tokens");
}

export async function getAvatarCollection() {
  return await collection<DBAvatar>("avatars");
}

export async function getUserCollection() {
  return await collection<DBUser>("users");
}
