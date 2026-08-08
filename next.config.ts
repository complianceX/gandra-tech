import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Next 16 permite apenas [75] por padrão; screenshots de UI com texto
    // miúdo precisam de compressão mais leve para não borrar.
    qualities: [75, 95],
  },
}

export default nextConfig
