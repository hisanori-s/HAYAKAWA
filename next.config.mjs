import { copyFileSync } from 'fs';
import { join } from 'path';

// 環境変数ファイルの自動切り替え
// デフォルトでサンドボックス環境を使用
// copyFileSync(join(process.cwd(), 'env', '.env.local.sandbox'), join(process.cwd(), '.env.local'));

// 本番環境を使用する場合は、以下のコメントを切り替えてください
copyFileSync(join(process.cwd(), 'env', '.env.local.product'), join(process.cwd(), '.env.local'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'items-images-sandbox.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'items-images.s3.us-west-2.amazonaws.com',
      }
    ],
    minimumCacheTTL: 60 * 60 * 24,
  },
  async headers() {
    return [
      {
        source: '/api/square/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
