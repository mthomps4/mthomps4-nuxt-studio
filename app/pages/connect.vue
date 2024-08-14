<script lang="ts" setup>
const { data: page } = await useAsyncData('index', () => queryContent('/main/connect').findOne())

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
    <ULandingSection
      :title="page.title"
      :description="page.description"
    >
      <div class="grid grid-cols-1 gap-4 w-1/2 mx-auto">
        <ULandingCard
          v-for="(item, index) in page.connections"
          :key="index"
          v-bind="item"
          orientation="horizontal"
        >
          <NuxtImg
            provider="imagekit"
            :src="item.image"
            class="aspect-square w-full"
          />
        </ULandingCard>
      </div>
    </ULandingSection>
  </UContainer>
</template>
