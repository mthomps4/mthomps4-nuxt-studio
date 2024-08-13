<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/main/about').findOne())

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<template>
  <main>
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      align="right"
      class="p-4 md:p-8"
    >
      <div class="m-4 p-4 bg-gradient-to-tr from-cyan-600 via-cyan-100 via-40% to-cyan-300  rounded-md">
        <NuxtImg
          provider="imagekit"
          src="/Avatars/tr:w-500,h-500/portrait.png"
          class="w-full aspect-square rounded-md"
        />
      </div>
    </UPageHero>
    <ULandingSection
      :title="page.features.title"
      :links="page.features.links"
    >
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) of page.features.items"
          :key="index"
          v-bind="item"
        />
      </UPageGrid>
    </ULandingSection>
  </main>
</template>
