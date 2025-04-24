import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/login",
        "/signup",
        "/forgotten-password",
        "/info",
        "/create-card",
        "/manage-cards",
        "/analytics",
        "/payments",
        "faq",
        "/terms-of-service",
        "/privacy-policy",
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
