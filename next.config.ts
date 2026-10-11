import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admins can paste remote image URLs in the dashboard. Allow any HTTPS host
    // for those images; local /public artwork is served as-is.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    qualities: [75, 90],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
