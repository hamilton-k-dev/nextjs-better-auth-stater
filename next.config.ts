import type { NextConfig } from "next";

// On Vercel, VERCEL_URL is set automatically per deployment (no https:// prefix).
// This derives NEXT_PUBLIC_APP_URL from it so you never need to set it manually.
const appUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: appUrl,
  },
};

export default nextConfig;
