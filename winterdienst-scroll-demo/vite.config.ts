// Nur für die eigenständige Demo. Nutzt das Vite, das Astro ohnehin mitbringt —
// es wird nichts zusätzlich installiert.
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4330,
    // Die Demo lädt die Schriften der Website aus ../public/fonts.
    fs: { allow: ['..'] },
  },
});
