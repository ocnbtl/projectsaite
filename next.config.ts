import type { NextConfig } from "next";

import { CONTENT_IMAGE_HOSTNAMES } from "./src/lib/content-constraints";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: CONTENT_IMAGE_HOSTNAMES.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  turbopack: {
    root: process.cwd(),
  },
  poweredByHeader: false,
};

export default nextConfig;
