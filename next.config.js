/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: '/',
      destination: '/contact',
      permanent: false
    }
  ]
};

module.exports = nextConfig;
