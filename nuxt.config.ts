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
    '@nuxtjs/mdc',
  ],
  //   routeRules: {
  //   // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
  //   '/': { prerender: true },
  //   '/api/search.json': { prerender: true }
  // },
  routeRules: {
    '/': { prerender: true },
    '/connect': { prerender: true },
    '/blog': { isr: false },
    '/blog/**': { isr: false },
    '/api/**': { isr: true },
    '/api/search.json': { isr: true },
    '/__studio.json': { isr: true },
  },
  app: {
    baseURL: '/',
  },
  site: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Matt Thompson',
    name: 'Matt Thompson',
    description: 'Software Architect, Builder, and Mentor',
    defaultLocale: 'en',
  },
  ogImage: {
    enabled: true,
  },
  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter(c =>
        ['UButton', 'UIcon'].includes(c.pascalName),
      )

      globals.forEach(c => (c.global = true))
    },
  },
  content: {
    highlight: {
      theme: 'one-dark-pro',
      langs: [
        'bash',
        'c',
        'cpp',
        'css',
        'elixir',
        'go',
        'graphql',
        'html',
        'html',
        'java',
        'js',
        'json',
        'jsx',
        'less',
        'markdown',
        'php',
        'python',
        'ruby',
        'ruby',
        'rust',
        'scss',
        'shell',
        'shellscript',
        'sql',
        'stylus',
        'swift',
        'toml',
        'ts',
        'tsx',
        'typescript',
        'vue',
        'vue',
        'xml',
        'yaml',
        'zsh',
      ],
    },
    navigation: {
      fields: [
        'title',
        'description',
        'navigation',
        'path',
        'icon',
        'twitter_image',
        'og_image',
      ],
    },
  },
  image: {
    inject: true,
    imagekit: {
      baseURL: 'https://ik.imagekit.io/mthomps4/',
    },
  },
  ui: {
    // @ts-expect-error - icons not a key of ui
    icons: ['heroicons', 'simple-icons'],
  },
  colorMode: {
    disableTransition: true,
  },
  devtools: {
    enabled: true,
  },
  typescript: {
    strict: false,
  },
  future: {
    compatibilityVersion: 4,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  compatibilityDate: '2024-07-11',
})
