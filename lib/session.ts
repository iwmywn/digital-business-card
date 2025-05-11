import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { cache } from "react";

interface UserSession {
  userId: string;
  expires: Date;
  isSignedIn: boolean;
}

interface PrivateSession {
  hasPrivateAccess: boolean;
}

const sevenDays = 7 * 24 * 60 * 60;
const twohours = 2 * 60 * 60;

const sessionOptions = {
  user: {
    password: process.env.SESSION_SECRET!,
    cookieName: "user_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: sevenDays,
    },
  },
  private: {
    password: process.env.SESSION_SECRET!,
    cookieName: "private_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: twohours,
    },
  },
} as const;

async function getSession<T extends object>(options: SessionOptions) {
  return await getIronSession<T>(await cookies(), options);
}

const session = {
  user: {
    get: cache(async () => getSession<UserSession>(sessionOptions.user)),
    create: async (userId: string) => {
      const s = await session.user.get();
      s.userId = userId;
      s.expires = new Date(Date.now() + sevenDays * 1000);
      s.isSignedIn = true;
      await s.save();
    },
    update: async () => {
      const s = await session.user.get();
      s.expires = new Date(Date.now() + sevenDays * 1000);
      s.updateConfig(sessionOptions.user);
      await s.save();
    },
    delete: async () => {
      const s = await session.user.get();
      s.destroy();
    },
  },
  private: {
    get: cache(async () => getSession<PrivateSession>(sessionOptions.private)),
    create: async () => {
      const s = await session.private.get();
      s.hasPrivateAccess = true;
      await s.save();
    },
    delete: async () => {
      const s = await session.private.get();
      s.destroy();
    },
  },
};

export { session };
