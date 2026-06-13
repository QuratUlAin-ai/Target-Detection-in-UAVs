/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.18.14', 'localhost'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
