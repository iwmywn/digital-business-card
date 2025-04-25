import "server-only";

import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

interface SessionPayload extends JWTPayload {
  userId: string | undefined;
  expires: Date;
}

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const issuer = process.env.JWT_ISSUER!;
const audience = process.env.JWT_AUDIENCE!;
const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

async function setSessionCookie(session: string) {
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expires)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
      issuer: issuer,
      audience: audience,
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const session = await encrypt({
    userId,
    expires,
  });
  await setSessionCookie(session);
}

export async function updateSession(session: string) {
  await setSessionCookie(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
