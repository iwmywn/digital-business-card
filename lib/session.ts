import "server-only";

import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export interface UserSessionPayload extends JWTPayload {
  userId: string | undefined;
  expires: Date;
}

const secretKey = process.env.JWT_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);
const issuer = process.env.JWT_ISSUER!;
const audience = process.env.JWT_AUDIENCE!;

function getSessionExpiry(key: string): Date {
  const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const fifteenMinutes = new Date(Date.now() + 15 * 60 * 1000);
  const oneMinute = new Date(Date.now() + 1 * 60 * 1000);

  if (key === "user_session") {
    return sevenDays;
  }
  if (key === "private_session") {
    return fifteenMinutes;
  }
  return oneMinute;
}

async function setSessionCookie(key: string, session: string): Promise<void> {
  const cookieStore = await cookies();
  const expires = getSessionExpiry(key);

  cookieStore.set(key, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function encrypt(
  key: string,
  payload?: UserSessionPayload | undefined,
): Promise<string> {
  const expires = getSessionExpiry(key);

  return new SignJWT(payload ?? {})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expires)
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<UserSessionPayload | JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
      issuer: issuer,
      audience: audience,
    });

    return payload as UserSessionPayload | JWTPayload;
  } catch (error) {
    console.error("Verify session error: ", error);
    return null;
  }
}

export async function createSession(
  key: string,
  userId?: string,
): Promise<void> {
  const expires = getSessionExpiry(key);

  let payload: UserSessionPayload | undefined;

  if (key === "user_session") {
    payload = {
      userId,
      expires,
    };
  }

  const session = await encrypt(key, payload);
  await setSessionCookie(key, session);
}

export async function updateSession(key: string, session: string) {
  await setSessionCookie(key, session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
}
