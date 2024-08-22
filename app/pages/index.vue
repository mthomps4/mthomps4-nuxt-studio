<script setup lang="ts">
const route = useRoute()
const { data: aboutPage } = await useAsyncData('about', () => queryContent('main').where({ path: '/about' }).findOne())

if (!aboutPage.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

useSeoMeta({
  title: aboutPage.value.title,
  description: aboutPage.value.description,
  ogTitle: aboutPage.value.title,
  ogDescription: aboutPage.value.description,
  twitterTitle: aboutPage.value.title,
  twitterDescription: aboutPage.value.description,
  ogImage: `/__og-image__/image${route.path}/og.png`,
  twitterImage: `/__og-image__/image${route.path}/og.png`
})

defineOgImageComponent('OgImageDocs', {
  title: aboutPage.value.og.title,
  description: aboutPage.value.og.description
})
</script>

<template>
  <UContainer>
    <UPageHero
      :title="aboutPage.hero.title"
      :description="aboutPage.hero.description"
      :links="aboutPage.hero.links"
      orientation="horizontal"
      align="center"
    />
    <ULandingCard>
      <section class="flex flex-col sm:flex-row items-center justify-center gap-12">
        <NuxtImg
          provider="imagekit"
          :src="aboutPage.hero.image"
          class="w-full sm:w-1/2 aspect-square rounded-md"
        />
        <div class="w-full sm:w-1/2">
          <h2 class="font-bold text-xl">
            {{ aboutPage.hero.subtitle }}
          </h2>
          <div
            v-for="(item, index) in aboutPage.hero.summary"
            :key="index"
          >
            <p class="my-2">
              {{ item.text }}
            </p>
          </div>
        </div>
      </section>
    </ULandingCard>
    <section className="my-8">
      <ULandingGrid>
        <ULandingCard
          v-for="(card, index) in aboutPage.features.cards"
          :key="index"
          v-bind="card"
          class="col-span-12 sm:col-span-6"
          :to="card.to"
          orientation="horizontal"
        >
          <NuxtImg
            provider="imagekit"
            :src="card.image"
            class="w-full aspect-square rounded-md"
          />
        </ULandingCard>
      </ULandingGrid>
    </section>
  </UContainer>
</template>
