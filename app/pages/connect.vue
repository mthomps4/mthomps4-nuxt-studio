<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData('connect', () => queryContent('main').where({ path: '/connect' }).findOne())

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

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
  <UContainer>
    <UPageBody>
      <div class="mb-10 border-b-gray-200 pb-4 dark:border-b-slate-900 border-b-[1px] flex justify-center flex-col items-center">
        <h1 class="font-bold text-4xl mb-4">
          {{ page.title }}
        </h1>
        <h2 class="text-lg">
          {{ page.subtitle }} <span class="text-cyan-500 font-bold">{{ page.subtitleTag }}</span> {{ page.subtitleEnd }}
        </h2>
      </div>
      <!-- TODO: Rip the Pro components out for a better mobile experience -->
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) in page.connections"
          :key="index"
          v-bind="item"
          orientation="horizontal"
        >
          <NuxtImg
            provider="imagekit"
            :src="item.image"
          />
        </ULandingCard>
      </UPageGrid>
    </UPageBody>
  </UContainer>
</template>
