import "./env/client"
import "./env/server"

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["simple-icons"],
    scrollRestoration: true,
    cpus: 1,
    inlineCss: true,
  },
  cacheComponents: true,
  reactCompiler: true,
}

export default nextConfig
