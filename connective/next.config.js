/** @type {import('next').NextConfig} */
console.log(process.env.URL)
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['connective-data.s3.amazonaws.com', 'avatars.dicebear.com'],
  },
  env: {
    BASE_URL: process.env.URL,
    SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
}

module.exports = nextConfig
