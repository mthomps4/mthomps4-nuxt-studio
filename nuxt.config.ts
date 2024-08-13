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
    'nuxt-og-image'
  ],

  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter(c => ['UButton', 'UIcon'].includes(c.pascalName))

      globals.forEach(c => (c.global = true))
    }
  },
  content: {
    highlight: {
      theme: 'one-dark-pro',
      langs: [
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
      fields: ['title', 'description', 'navigation', 'path', 'icon', 'twitter_image', 'og_image']
    }
  },
  image: {
    inject: true,
    imagekit: {
      baseURL: 'https://ik.imagekit.io/mthomps4/'
    }
  },
  ui: {
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
        braceStyle: '1tbs'
      }
    }
  },

  compatibilityDate: '2024-07-11'
})
