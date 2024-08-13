<script setup lang="ts">
// const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())

// useSeoMeta({
//   titleTemplate: '',
//   title: page.value.title,
//   ogTitle: page.value.title,
//   description: page.value.description,
//   ogDescription: page.value.description
// })
</script>

<template>
  <div>
    <ULandingCard
      title="Testing Colors"
      description="Testing Colors"
      icon="i-heroicons-color-swatch-20-solid"
      to="/blog"
      target="_blank"
      color="blue"
    />
  </div>
</template>
