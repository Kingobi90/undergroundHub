/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove export output for Netlify deployment
  // output: 'export',
  // Remove GitHub Pages specific configuration
  // basePath: process.env.NODE_ENV === 'production' ? '/ug-campus-hub-app' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/ug-campus-hub-app/' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
