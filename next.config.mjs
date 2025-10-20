import withPWA from 'next-pwa';

const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['logo.clearbit.com'],
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
})(nextConfig);