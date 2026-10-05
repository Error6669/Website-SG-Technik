import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const handyHost = 'macbook-air-von-simon.local';

export default defineConfig({
  site: 'https://sg-technik.at',
  // Nur für dev und preview: erlaubt den Aufruf vom Handy im selben WLAN über
  // den festen Bonjour-Namen des Macs (http://macbook-air-von-simon.local:4321),
  // wenn der Server mit `--host` gestartet ist. Ohne Eintrag blockt der
  // Server fremde Hostnamen (Schutz gegen DNS-Rebinding). Klein geschrieben,
  // weil Browser Hostnamen klein senden.
  server: {
    allowedHosts: [handyHost],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
