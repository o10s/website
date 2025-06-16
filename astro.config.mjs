// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://o10s.github.io',
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': new URL('./src', import.meta.url).pathname
      }
    }
  },
  markdown: {
    // Enable syntax highlighting
    syntaxHighlight: 'shiki',
    shikiConfig: {
      // Choose from Shiki's built-in themes
      theme: 'github-dark',
      // Add custom languages
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },
});