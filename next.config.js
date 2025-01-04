/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["drive.google.com"], // Allow images from Google Drive
  },
};

module.exports = nextConfig;
