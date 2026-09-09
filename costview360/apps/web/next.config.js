/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep default, but disable flaky filesystem cache in dev
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};
module.exports = nextConfig;
