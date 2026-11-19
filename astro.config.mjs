import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lazar.sh',
  redirects: {
    '/contact': '/'
  }
});
