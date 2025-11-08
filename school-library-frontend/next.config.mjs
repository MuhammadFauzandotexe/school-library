/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi dari Anda
  eslint: {
    ignoreDuringBuilds: true,
  },
  output : "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Konfigurasi proxy 'rewrites' yang ditambahkan
  async rewrites() {
    return [
      {
        // Ini adalah 'source' (URL) yang akan dicari oleh frontend
        source: '/api/:path*',

        // Ini adalah 'destination' (tujuan) ke mana Next.js akan
        // meneruskan permintaan secara diam-diam (di sisi server)
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;