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
    esmExternals: true,
    scrollRestoration: true,
    ppr: true,
    cpus: 1,
    reactCompiler: true,
    inlineCss: true,
  },
};

export default nextConfig;
