import { type NextConfig } from 'next';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin({
  identifiers: ({ hash }) => `lsh_${hash}`,
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withVanillaExtract(nextConfig);
