import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    viewTransition: true,
  },
};

const withMDX = createMDX()

initOpenNextCloudflareForDev()

export default withMDX(nextConfig);
