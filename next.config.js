/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude server-only modules from client-side bundles
      config.externals.push('long-timeout', 'nice-grpc-prometheus', '@opentelemetry/sdk-node');
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  }
};

module.exports = nextConfig;
