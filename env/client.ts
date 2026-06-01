import { createEnv } from "@t3-oss/env-nextjs"
import * as z from "zod"

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_URL: z.string().min(1),
    NEXT_PUBLIC_NODE_ENV: z.string().min(1),
    NEXT_PUBLIC_RECAPTCHA: z.string().min(1),
    NEXT_PUBLIC_BASIC_ID: z.string().min(1),
    NEXT_PUBLIC_PROFESSIONAL_ID: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_KEY: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_NAME: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_RECAPTCHA: process.env.NEXT_PUBLIC_RECAPTCHA,
    NEXT_PUBLIC_BASIC_ID: process.env.NEXT_PUBLIC_BASIC_ID,
    NEXT_PUBLIC_PROFESSIONAL_ID: process.env.NEXT_PUBLIC_PROFESSIONAL_ID,
    NEXT_PUBLIC_CLOUDINARY_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    NEXT_PUBLIC_CLOUDINARY_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  },
})
