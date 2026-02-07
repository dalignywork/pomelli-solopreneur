/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      // Add your Supabase storage domain here
      // "your-project.supabase.co"
    ],
  },
};

module.exports = nextConfig;
