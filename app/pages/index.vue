<script setup lang="ts">
const route = useRoute()
const { data: aboutPage } = await useAsyncData('about', () => queryContent('main').where({ path: '/about' }).findOne())

if (!aboutPage.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

const aboutMe = aboutPage.value.hero.summary.map(item => item.text).join('\n\n')

useSeoMeta({
  title: aboutPage.value.title,
  description: aboutPage.value.description,
  ogTitle: aboutPage.value.title,
  ogDescription: aboutPage.value.description,
  twitterTitle: aboutPage.value.title,
  twitterDescription: aboutPage.value.description,
  ogImage: `/__og-image__/image${route.path}/og.png`,
  twitterImage: `/__og-image__/image${route.path}/og.png`,
})

defineOgImageComponent('OgImageDocs', {
  title: aboutPage.value.og.title,
  description: aboutPage.value.og.description,
})
</script>

<template>
  <div
    class="lg:bg-[url('https://ik.imagekit.io/mthomps4/site/mascots/lion-side-light.png')]
  bg-left-top bg-no-repeat bg-contain"
  >
    <UContainer>
      <section>
        <div class="hidden lg:block mx-auto w-3/4">
          <UPageHero
            :title="aboutPage.hero.title"
            :description="aboutPage.hero.description"
            :links="aboutPage.hero.links"
            align="left"
          >
            <NuxtImg
              provider="imagekit"
              :src="aboutPage.hero.image"
              class="w-[80%] aspect-square rounded-lg mx-auto"
            />
          </UPageHero>
        </div>
        <div class="lg:hidden">
          <UPageHero
            :title="aboutPage.hero.title"
            :description="aboutPage.hero.description"
            :links="aboutPage.hero.links"
            align="center"
          >
            <NuxtImg
              provider="imagekit"
              :src="aboutPage.hero.image"
              class="w-[80%] aspect-square rounded-lg mx-auto"
            />
          </UPageHero>
        </div>
      </section>
      <ULandingCard
        :title="aboutPage.hero.subtitle"
        orientation="horizontal"
      >
        <template #description>
          <div class="whitespace-pre-line">
            {{ aboutMe }}
          </div>
        </template>
      </ULandingCard>

      <div class="my-4 sm:my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ULandingCard
          v-for="(card, index) in aboutPage.features.cards"
          :key="index"
          v-bind="card"
        >
          <div class="flex justify-center items-end w-full mt-2 h-full">
            <UButton
              v-if="card.link"
              v-bind="card.link"
              size="lg"
              :disabled="card.link.disabled"
              :color="card.link.disabled ? 'gray' : 'primary'"
              :class="card.link.disabled ? 'cursor-not-allowed' : ''"
            />
          </div>
        </ULandingCard>
      </div>
    </UContainer>
  </div>
</template>
