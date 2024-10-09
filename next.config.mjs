/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.totalwine.com",
      },
    ],
  },
};

export default nextConfig;
