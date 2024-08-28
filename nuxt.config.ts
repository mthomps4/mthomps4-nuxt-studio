// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxthq/studio',
    'nuxt-og-image',
    '@nuxtjs/seo',
    '@nuxtjs/mdc'
  ],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Matt Thompson',
    name: 'Matt Thompson',
    description: 'Software Architect, Builder, and Mentor',
    defaultLocale: 'en'
  },
  ogImage: {
    enabled: true
  },
  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter(c =>
        ['UButton', 'UIcon'].includes(c.pascalName)
      );

      globals.forEach(c => (c.global = true));
    }
  },
  content: {
    highlight: {
      theme: 'one-dark-pro',
      langs: [
        'graphql',
        'json',
        'yaml',
        'bash',
        'markdown',
        'html',
        'vue',
        'ts',
        'js',
        'css',
        'scss',
        'less',
        'stylus',
        'go',
        'java',
        'c',
        'cpp',
        'php',
        'python',
        'ruby',
        'rust',
        'sql',
        'swift',
        'toml',
        'xml',
        'html',
        'vue',
        'elixir',
        'ruby',
        'jsx',
        'tsx',
        'typescript',
        'shell',
        'shellscript',
        'zsh'
      ]
    },
    navigation: {
      fields: [
        'title',
        'description',
        'navigation',
        'path',
        'icon',
        'twitter_image',
        'og_image'
      ]
    }
  },
  image: {
    inject: true,
    imagekit: {
      baseURL: 'https://ik.imagekit.io/mthomps4/'
    }
  },
  ui: {
    // @ts-expect-error - unknown icons key
    icons: ['heroicons', 'simple-icons']
  },

  colorMode: {
    disableTransition: true
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/': { prerender: true },
    '/api/search.json': { prerender: true }
  },

  devtools: {
    enabled: true
  },

  typescript: {
    strict: false
  },

  future: {
    compatibilityVersion: 4
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
        semi: true,
        blockSpacing: true,
        indent: 2,
        quotes: 'single',
        quoteProps: 'as-needed',
        jsx: true
      }
    }
  },
  compatibilityDate: '2024-07-11',
  nitro: {
    preset: 'vercel',
    nodeVersion: '18'
  }
});
