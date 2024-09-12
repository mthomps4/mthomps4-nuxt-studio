<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData('connect', () => queryContent('main').where({ path: '/connect' }).findOne())

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
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
  twitterImage: `/__og-image__/image${route.path}/og.png`,
})

defineOgImageComponent('OgImageDocs', {
  title: page.value.og.title,
  description: page.value.og.description,
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
      <section class="w-full sm:w-[600px] mx-auto">
        <a
          v-for="(item, index) in page.connections"
          :key="index"
          :href="item.to"
          :target="item.target"
          :aria-label="item.ariaLabel"
          class="w-full h-40 hover:border-primary border-2 border-gray-200 dark:border-slate-800 rounded-xl my-8 flex justify-between items-center shadow-xl p-2 gap-4"
        >
          <div>
            <div class="flex items-center gap-2">
              <UIcon :name="item.icon" />
              <h3 class="text-lg font-bold">{{ item.label }}</h3>
            </div>
            <h3 class="text-base font-bold text-primary">
              {{ item.title }}
            </h3>
            <p class="text-sm">
              {{ item.description }}
            </p>
          </div>
          <NuxtImg
            provider="imagekit"
            :src="item.image"
            class="aspect-square h-full object-cover"
          />
        </a>
      </section>
    </UPageBody>
  </UContainer>
</template>
