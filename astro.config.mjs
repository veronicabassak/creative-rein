// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Used for canonical URLs and the sitemap. Change if the domain changes.
  site: 'https://creativerein.co.uk',
  output: 'static',
  trailingSlash: 'always',
});
