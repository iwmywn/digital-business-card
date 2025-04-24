import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/login",
        "/signup",
        "/forgot-password",
        "/info",
        "/create",
        "/manage",
        "/analytics",
        "/payments",
        "/faq",
        "/tos",
        "/privacy",
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
