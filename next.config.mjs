import withPWA from 'next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const baseConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
    ],
  },
  outputFileTracingRoot: path.resolve(__dirname),
  experimental: {
    optimizeCss: false,
  },
};

const withConfiguredPWA = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
});

const isProd = process.env.NODE_ENV === 'production';
const nextConfig = withNextIntl(baseConfig);

export default isProd ? withConfiguredPWA(nextConfig) : nextConfig;
