export default defineAppConfig({
  ui: {
    primary: 'cyan',
    gray: 'slate',
    footer: {
      bottom: {
        left: 'text-sm text-gray-500 dark:text-gray-400',
        wrapper: 'border-t border-gray-200 dark:border-gray-800',
      },
    },
  },
  seo: {
    siteName: 'Matt Thompson',
    applicationName: 'mthomps4- Matt Thompson',
    twitterCard: 'summary_large_image',
    twitterImage: '/__og-image__/image/og.png',
    ogImage: '/__og-image__/image/og.png',
    ogUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  header: {
    logo: {
      alt: 'Matt Thompson',
      light: '/brand/MThompson-blue.svg',
      dark: '/brand/MThompson-white.svg',
    },
    search: true,
    colorMode: true,
    links: [
      {
        'label': 'About',
        'to': '/',
        'aria-label': 'About',
      },
      {
        'label': 'Connect',
        'to': '/connect',
        'aria-label': 'Connect',
      },
      {
        'label': 'Blog',
        'to': '/blog',
        'aria-label': 'Blog',
      },
    ],
  },
  footer: {
    credits: 'Copyright © 2024',
    colorMode: false,
    links: [
      {
        'icon': 'i-simple-icons-linkedin',
        'to': 'https://linkedin.com/in/mthomps4',
        'target': '_blank',
        'aria-label': 'LinkedIN - Matt Thompson',
      },
      {
        'icon': 'i-simple-icons-x',
        'to': 'https://x.com/mthomsp4',
        'target': '_blank',
        'aria-label': '@mthomps4 on X',
      },
      {
        'icon': 'i-simple-icons-github',
        'to': 'https://github.com/mthomps4',
        'target': '_blank',
        'aria-label': '@mthomps4 on GitHub',
      },
    ],
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: '',
      edit: '',
      links: [],
    },
  },
})
