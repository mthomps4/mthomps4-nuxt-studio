<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

const { seo } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const { data: files } = useLazyFetch<ParsedContent[]>('/api/search.json', {
  default: () => [],
  server: false
})

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

defineOgImage({
  component: 'Docs',
  alt: 'Matt Thompson - Software Architect, Builder, and Mentor',
  props: {
    title: 'Matt Thompson',
    description: 'Software Architect, Builder, and Mentor'
  },
  extension: 'png'
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  applicationName: seo?.siteName,
  ogSiteName: seo?.applicationName,
  ogUrl: seo?.ogUrl,
  ogImage: seo?.ogImage,
  twitterImage: seo?.twitterImage,
  twitterCard: 'summary_large_image',
  twitterTitle: seo?.siteName,
  twitterDescription: seo?.siteName
})

const links = [
  {
    label: 'About',
    to: '/',
    icon: 'i-heroicons-user-20-solid'
  },
  {
    label: 'Connect',
    to: '/connect',
    icon: 'i-heroicons-envelope-20-solid'
  },
  {
    label: 'Blog',
    to: '/blog',
    icon: 'i-heroicons-document-20-solid'
  }
]

provide('files', files)
provide('navigation', navigation)
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-800">
    <NuxtLoadingIndicator />
    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        :links="links"
      />
    </ClientOnly>

    <UNotifications />
  </div>
</template>
