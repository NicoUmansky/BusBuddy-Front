
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

const withPWA = require("next-pwa")

module.exports = withPWA({
   
    dest: "public",
    register: true,
    skipWaiting: true,
});