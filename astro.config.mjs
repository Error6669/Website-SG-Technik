import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sg-technik.at',
  vite: {
    plugins: [tailwindcss()],
  },
});
