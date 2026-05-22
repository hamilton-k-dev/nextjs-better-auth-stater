import type { NextConfig } from "next";

// VERCEL_PROJECT_PRODUCTION_URL is the stable production alias (never changes).
// VERCEL_URL is per-deployment (changes every push) — wrong for auth.
const appUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: appUrl,
  },
};

export default nextConfig;
