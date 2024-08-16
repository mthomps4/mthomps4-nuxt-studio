<script lang="ts" setup>
definePageMeta({
  layout: 'docs'
})
const route = useRoute()
const { data: page } = await useAsyncData('connect', () => queryContent('main').where({ path: '/blog' }).findOne())

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
  twitterTitle: page.value.title,
  twitterDescription: page.value.description,
  ogImage: `/__og-image__/image${route.path}/og.png`,
  twitterImage: `/__og-image__/image${route.path}/og.png`
})

defineOgImageComponent('OgImageDocs', {
  title: page.value.og.title,
  description: page.value.og.description
})
</script>

<template>
  <UPage>
    <UPageHeader
      headline="Blog"
      title="The Digital Forge"
      description="The digital forge is a place where I share my thoughts and ideas on software development, technology, and other topics that interest me. I hope you find something useful here."
    />
    <p>TODO: Main Blog Page</p>
  </UPage>
</template>
