/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  // Configure basePath and assetPrefix for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/ug-campus-hub-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ug-campus-hub-app/' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
