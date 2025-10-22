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
      // Exclude server-only modules from the client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'firebase-admin': false,
        '@opentelemetry/sdk-node': false,
      };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  }
};

module.exports = nextConfig;
