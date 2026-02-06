import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { readFileSync } from "fs";
import { join } from "path";

const withNextIntl = createNextIntlPlugin();

// Read version from root package.json (same file GitHub version check fetches)
const rootPkg = JSON.parse(
  readFileSync(join(__dirname, "../../package.json"), "utf-8"),
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_APP_VERSION: rootPkg.version || "0.0.0",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
