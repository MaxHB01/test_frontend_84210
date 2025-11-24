import type { NextConfig } from "next";
const path = require('path')

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/common/styles')],
  },

  output: 'standalone',
};

export default nextConfig;
