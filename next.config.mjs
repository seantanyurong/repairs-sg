/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.clerk.com"],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sign-in',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
