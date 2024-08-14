<script lang="ts" setup>
const { data: page } = await useAsyncData('connect', () => queryContent('main').where({ path: '/connect' }).findOne())

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 lg:w-1/2 mx-auto">
        <ULandingCard
          v-for="(item, index) in page.connections"
          :key="index"
          v-bind="item"
          orientation="horizontal"
        >
          <div class="flex justify-center lg:justify-end lg:h-[200px]">
            <NuxtImg
              provider="imagekit"
              :src="item.image"
              width="200"
              height="200"
            />
          </div>
        </ULandingCard>
      </div>
    </UPageBody>
  </UContainer>
</template>
