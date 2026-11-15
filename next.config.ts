import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.224"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-a885791830ca4c6fa67750d66769c960.r2.dev",
      },
    ],
  },
};

export default nextConfig;
