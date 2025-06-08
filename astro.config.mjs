import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import path from 'path';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  trailingSlash: 'always',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
  env: {
    schema: {
      DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DATOCMS_DRAFT_CONTENT_CDA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DATOCMS_CMA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      SECRET_API_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      SIGNED_COOKIE_JWT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DRAFT_MODE_COOKIE_NAME: envField.string({
        context: 'client',
        access: 'public',
      }),
    },
    validateSecrets: true,
  },


});