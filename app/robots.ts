import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/home",
        "/create",
        "/management",
        "/analytics",
        "/subscription/",
        "/settings",
        "/edit/",
        "/notifications",
        "/signin",
        "/signup",
        "/forgot-password",
        "/email-handler",
        "/maintenance",
        "/private",
      ],
    },
  }
}
