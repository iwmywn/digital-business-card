import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";
import { UserSessionPayload } from "@/lib/session";

export const verifyUserSession = cache(async () => {
  const session = (await cookies()).get("user_session")?.value;
  const payload = await decrypt(session);

  if (!payload) return { isLoggedIn: false };

  const { userId, expires } = payload as UserSessionPayload;

  return {
    isLoggedIn: true,
    userId,
    expires,
  };
});

export const verifyPrivateSession = cache(async () => {
  const session = (await cookies()).get("private_session")?.value;
  const payload = await decrypt(session);

  if (!payload) return { hasPrivateAccess: false };

  return {
    hasPrivateAccess: true,
  };
});
