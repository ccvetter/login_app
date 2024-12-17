/** @type {import('next').NextConfig} */

const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcrypt']
};

module.exports = nextConfig
