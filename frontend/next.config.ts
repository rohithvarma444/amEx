// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // increase limit as needed (e.g., 5mb, 10mb)
    },
  },
};

export default nextConfig;