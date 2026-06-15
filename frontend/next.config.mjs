/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Use INTERNAL_API_URL (e.g. http://backend:8000) for Docker, fallback to NEXT_PUBLIC_API_URL for local dev
        destination: `${process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/:path*`, // Proxy to Backend
      },
    ]
  },
};

export default nextConfig;
