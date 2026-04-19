import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://syydaniel.github.io',
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: {
    ssr: {
      noExternal: ['three', 'gsap', 'maplibre-gl']
    }
  }
});
