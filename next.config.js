const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  devIndicators: false,
  allowedDevOrigins: ['192.168.0.200'],
  webpack: (config) => {
    config.resolve.alias['@specbridge-v1/sdk'] = path.resolve(__dirname, 'vendor/specbridge-sdk/dist/index.js')
    return config
  },
}
module.exports = nextConfig
