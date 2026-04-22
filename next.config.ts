import type { NextConfig } from 'next';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5003/api/v1').replace(/\/$/, '');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${API_BASE_URL}/:path*`
      }
    ];
  }
};

export default nextConfig;
