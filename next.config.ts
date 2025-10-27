import type { NextConfig } from 'next';
import path from 'path';

module.exports = {
  // this includes files from the monorepo base two directories up
  outputFileTracingRoot: path.join(__dirname, '../../'),
};
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
