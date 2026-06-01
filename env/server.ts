import { createEnv } from "@t3-oss/env-nextjs"
import * as z from "zod"

export const serverEnv = createEnv({
  server: {
    RECAPTCHA_SECRET: z.string().min(1),
    STRIPE_SECRET: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    CLOUDINARY_SECRET: z.string().min(1),
    SESSION_SECRET: z.string().min(1),
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z.string().min(1),
    EMAIL_SERVER_USER: z.string().min(1),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    DB_URI: z.string().min(1),
    DB_NAME: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
})
