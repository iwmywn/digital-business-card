"use server";

import { tokenSchema } from "@/schemas";
import { createResponse } from "@/app/api/utils";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { getPrivateTokenCollection } from "@/lib/collections";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function PATCH(req: Request) {
  const data = await req.json();
  const { recaptchaToken, ...userData } = data;

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return createResponse("Captcha challenge failed!", 422);

  const parsedCredentials = tokenSchema.safeParse(userData);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { token } = parsedCredentials.data;

  const privateTokenCollection = await getPrivateTokenCollection();
  const existingToken = await privateTokenCollection.findOne({ token: token });

  if (!existingToken) return createResponse("Token expired!", 404);

  await Promise.all([
    privateTokenCollection.deleteOne({ token: token }),
    createSession("private_session"),
  ]);

  return new NextResponse(null, { status: 204 });
}
