import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Static export for GitHub Pages ────────────────────────────────────────
  output: "export",

  // GitHub Pages requires trailing slashes for correct routing
  trailingSlash: true,

  // Image optimisation requires a server — disable for static export
  images: {
    unoptimized: true,
  },

  // ── If deploying WITHOUT a custom domain (repo sub-path), uncomment this:
  // basePath: "/vtu-student-portal",
  // assetPrefix: "/vtu-student-portal",
};

export default nextConfig;
