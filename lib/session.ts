import { cache } from "react"
import { cookies } from "next/headers"
import { clientEnv } from "@/env/client"
import { serverEnv } from "@/env/server"
import type { SessionOptions } from "iron-session"
import { getIronSession } from "iron-session"

interface UserSession {
  userId: string
  expires: Date
}

interface PrivateSession {
  expires: Date
}

const sevenDays = 7 * 24 * 60 * 60
const twohours = 2 * 60 * 60

const sessionOptions = {
  user: {
    password: serverEnv.SESSION_SECRET,
    cookieName: "user_session",
    cookieOptions: {
      secure: clientEnv.NEXT_PUBLIC_NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: sevenDays,
    },
  },
  private: {
    password: serverEnv.SESSION_SECRET,
    cookieName: "private_session",
    cookieOptions: {
      secure: clientEnv.NEXT_PUBLIC_NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: twohours,
    },
  },
} as const

async function getSession<T extends object>(options: SessionOptions) {
  return await getIronSession<T>(await cookies(), options)
}

const session = {
  user: {
    get: cache(async () => getSession<UserSession>(sessionOptions.user)),
    create: async (userId: string) => {
      const s = await session.user.get()
      s.userId = userId
      s.expires = new Date(Date.now() + sevenDays * 1000)
      await s.save()
    },
    update: async () => {
      const s = await session.user.get()
      s.expires = new Date(Date.now() + sevenDays * 1000)
      s.updateConfig(sessionOptions.user)
      await s.save()
    },
    delete: async () => {
      const s = await session.user.get()
      s.destroy()
    },
  },
  private: {
    get: cache(async () => getSession<PrivateSession>(sessionOptions.private)),
    create: async () => {
      const s = await session.private.get()
      s.expires = new Date(Date.now() + twohours * 1000)
      await s.save()
    },
    delete: async () => {
      const s = await session.private.get()
      s.destroy()
    },
  },
}

export { session }
