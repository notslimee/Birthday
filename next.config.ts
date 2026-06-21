import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Birthday",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
