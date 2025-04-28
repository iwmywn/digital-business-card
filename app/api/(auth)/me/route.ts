"use server";

import { createResponse } from "@/app/api/utils";
import { getUserById } from "@/lib/data";
import { session } from "@/lib/session";

export async function GET() {
  const { isLoggedIn, userId } = await session.user.get();

  if (!isLoggedIn) {
    return createResponse("Unauthorized!", 401);
  }

  const existingUser = await getUserById(userId);

  if (!existingUser) return createResponse("User not found!", 404);

  const { name, email, avatar } = existingUser;

  return createResponse(
    {
      name,
      email,
      avatar,
    },
    200,
  );
}
