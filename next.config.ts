import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: process.env.BUILD_ENV === "production" ? ".next" : ".next-dev",
};

export default nextConfig;
