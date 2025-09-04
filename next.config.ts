import type { NextConfig } from "next";

const isGh = process.env.GITHUB_PAGES === 'true';

const repoName = 'ThriveCircleNext';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  eslint: {
    // Optionally disable ESLint during builds to avoid failing on generated client
    ignoreDuringBuilds: true,
  },
  ...(isGh
    ? {
        output: 'export',
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
