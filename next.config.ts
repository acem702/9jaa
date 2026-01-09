import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '10.61.144.246',
    '*.replit.dev',
    '*.repl.co',
    '*.replit.app',
    '*.picard.replit.dev',
  ],
};

export default nextConfig;
