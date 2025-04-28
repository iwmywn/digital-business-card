"use server";

import bcrypt from "bcryptjs";
import { logInSchema } from "@/schemas";
import { createResponse } from "@/app/api/utils";
import { getUserByEmail } from "@/lib/data";
import { NextResponse } from "next/server";
import { session } from "@/lib/session";

export async function POST(req: Request) {
  const data = await req.json();
  const parsedCredentials = logInSchema.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { email, password } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser)
    return createResponse("Email or password is incorrect!", 400);

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid)
    return createResponse("Email or password is incorrect!", 400);

  if (!existingUser.emailVerified)
    return createResponse(
      "Account not verified. Please check your email to verify!",
      400,
    );

  await session.user.create(existingUser._id.toString());

  return new NextResponse(null, { status: 204 });
}
