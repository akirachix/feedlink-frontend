import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
// next.config.js
const path = require('path');

module.exports = {
  outputFileTracingRoot: path.join(__dirname, './'),
  // ... rest of your config
}; 