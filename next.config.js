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
};

module.exports = nextConfig;
