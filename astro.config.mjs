// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.joyofhearing.net',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap(), react()],
  devToolbar: {
    enabled: false
  },
  prefetch: { defaultStrategy: 'hover' },
  build: {
    assets: 'assets'
  }
});