import withPWA from 'next-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    domains: ['logo.clearbit.com'],
  },
  outputFileTracingRoot: path.resolve(__dirname),
};

const withConfiguredPWA = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
});

const isProd = process.env.NODE_ENV === 'production';

export default isProd ? withConfiguredPWA(nextConfig) : nextConfig;
