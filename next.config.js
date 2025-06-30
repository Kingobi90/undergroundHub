/** @type {import('next').NextConfig} */
const path = require('path');

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
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
}

module.exports = nextConfig
