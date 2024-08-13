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
      <NuxtImg
        provider="imagekit"
        src="/Avatars/portrait.png"
        class="w-full aspect-square rounded-md shadow-xl"
      />
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
