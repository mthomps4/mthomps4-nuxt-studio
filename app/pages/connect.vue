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
    <UPageBody
      :title="page.title"
      :description="page.description"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 lg:w-1/2 mx-auto">
        <ULandingCard
          v-for="(item, index) in page.connections"
          :key="index"
          v-bind="item"
          orientation="horizontal"
        >
          <div class="lg:flex lg:justify-end lg:h-[200px]">
            <NuxtImg
              provider="imagekit"
              :src="item.image"
              class="aspect-square h-full"
            />
          </div>
        </ULandingCard>
      </div>
    </UPageBody>
  </UContainer>
</template>
