import { collection } from "@/lib/db"
import type {
  DBAvatar,
  DBCard,
  DBContact,
  DBIssue,
  DBPrivateToken,
  DBUser,
} from "@/lib/definitions"

export async function getPrivateTokenCollection() {
  return await collection<DBPrivateToken>("private_tokens")
}

export async function getAvatarCollection() {
  return await collection<DBAvatar>("avatars")
}

export async function getUserCollection() {
  return await collection<DBUser>("users")
}

export async function getCardCollection() {
  return await collection<DBCard>("cards")
}

export async function getIssueCollection() {
  return await collection<DBIssue>("issues")
}

export async function getContactCollection() {
  return await collection<DBContact>("contacts")
}
