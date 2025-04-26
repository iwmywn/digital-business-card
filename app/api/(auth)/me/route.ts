"use server";

import { createResponse } from "@/app/api/utils";
import { verifyUserSession } from "@/lib/dal";
import { getUserById } from "@/lib/data";

export async function GET() {
  const { isLoggedIn, userId } = await verifyUserSession();

  if (!isLoggedIn) {
    return createResponse("Unauthorized!", 401);
  }

  const existingUser = await getUserById(userId!);

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
