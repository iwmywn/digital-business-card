import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    scrollRestoration: true,
    ppr: true,
    cpus: 1,
    reactCompiler: true,
    inlineCss: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
