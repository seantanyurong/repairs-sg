/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com"], // Add allowed image domains here
  },
};

export default nextConfig;
