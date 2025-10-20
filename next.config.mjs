import withPWA from 'next-pwa';

const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['logo.clearbit.com'],
  },
};

const withConfiguredPWA = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
});

const isProd = process.env.NODE_ENV === 'production';

export default isProd ? withConfiguredPWA(nextConfig) : nextConfig;
