import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

// Avoid passing non-serializable plugin functions in Turbopack mode
const withMDX = createMDX()

export default withMDX(nextConfig);
