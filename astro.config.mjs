// @ts-check
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// Astro 6.3.0 serialises markdown image props into an attribute, then fails to
// decode &#x27; before escaping the attribute again. An apostrophe in alt text
// is written as &amp;#x27;, so the accessible alt is the entity, not the
// approved character. Restore the apostrophe inside alt attributes only.
function decodeMarkdownImageAltApostrophes() {
  return {
    name: 'decode-markdown-image-alt-apostrophes',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        await walk(root);
      }
    }
  };
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    const html = await readFile(path, 'utf8');
    const fixed = html.replace(/alt="([^"]*)"/g, (attribute, value) => {
      if (!value.includes('&amp;#x27;')) return attribute;
      return `alt="${value.replaceAll('&amp;#x27;', "'")}"`;
    });
    if (fixed !== html) await writeFile(path, fixed);
  }
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.joyofhearing.net',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap(), react(), decodeMarkdownImageAltApostrophes()],
  devToolbar: {
    enabled: false
  },
  prefetch: { defaultStrategy: 'hover' },
  build: {
    assets: 'assets'
  }
});