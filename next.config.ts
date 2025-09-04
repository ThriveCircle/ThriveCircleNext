import type { NextConfig } from "next";

const isCI = process.env.CI === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  eslint: {
    // Optionally disable ESLint during builds to avoid failing on generated client
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
