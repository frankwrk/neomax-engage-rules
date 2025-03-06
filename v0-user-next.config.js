/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost:3000", "localhost:3001", "v0-neomax-engage.vercel.app"], // Add any domains you're loading images from
  },
}

module.exports = nextConfig

