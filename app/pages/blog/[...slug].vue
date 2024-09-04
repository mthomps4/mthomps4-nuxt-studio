<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo';

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc } = useAppConfig()

const { data: page } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryContent()
    .where({ _extension: 'md', navigation: { $ne: false } })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path))
)

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

// const headline = computed(() => findPageHeadline(page.value));
const headline = computed(() => page.value.headline)
</script>

<template>
  <UPage>
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :headline="headline"
    />

    <UPageBody prose>
      <ContentRenderer
        v-if="page.body"
        :value="page"
      />

      <section
        v-if="page.tags"
        class="my-8"
      >
        <UDivider
          v-if="page?.tags"
          type="solid"
        />
        <h2 class="text-sm font-bold mb-8">
          Related Tags
        </h2>
        <section class="flex flex-wrap gap-4">
          <ULink
            v-for="(tag, index) in page.tags"
            :key="index"
            :to="`/blog?tag=${tag}`"
            class="text-sm"
          >
            #{{ tag }}
          </ULink>
        </section>
      </section>

      <hr v-if="surround?.length">

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page.toc !== false"
      #right
    >
      <UContentToc
        :title="toc?.title"
        :links="page.body?.toc?.links"
      />
    </template>
  </UPage>
</template>

<style lang="postcss" scoped>
.prose {
  :deep(.featured-image) {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 4px solid #ccc;
  }

  :deep(img) {
    width: 100%;
    margin: 0;
    display: block;
    border: none;
  }
}
</style>
