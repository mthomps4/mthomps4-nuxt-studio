<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData('about', () => queryContent('main').where({ path: '/about' }).findOne())

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
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      orientation="horizontal"
      align="center"
    />
    <ULandingCard>
      <section class="flex flex-col sm:flex-row items-center justify-center gap-12">
        <NuxtImg
          provider="imagekit"
          :src="page.hero.image"
          class="w-full sm:w-1/2 aspect-square rounded-md"
        />
        <div class="w-full sm:w-1/2">
          <h2 class="font-bold text-xl">
            {{ page.hero.subtitle }}
          </h2>
          <div
            v-for="(item, index) in page.hero.summary"
            :key="index"
          >
            <p class="my-2">
              {{ item.text }}
            </p>
          </div>
        </div>
      </section>
    </ULandingCard>
    <ULandingSection :title="page.features.title">
      <ULandingGrid>
        <ULandingCard
          v-for="(card, index) in page.features.cards"
          :key="index"
          v-bind="card"
          class="col-span-12 sm:col-span-6"
        >
          <NuxtImg
            provider="imagekit"
            :src="card.image"
            class="w-full aspect-square rounded-md"
          />
        </ULandingCard>
      </ULandingGrid>
    </ULandingSection>
  </UContainer>
</template>
