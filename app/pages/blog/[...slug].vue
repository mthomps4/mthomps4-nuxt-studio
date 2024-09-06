<script setup lang="ts">
definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { toc } = useAppConfig()

const contentPath = computed(() => route.path.startsWith('/blog') ? route.path : `/blog${route.path}`)

const { data: page, error } = await useAsyncData(contentPath.value, () => queryContent(contentPath.value).findOne())

if (error.value) {
  console.error('Error fetching page:', error.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryContent()
    .where({ _extension: 'md', navigation: { $ne: false } })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path)),
)

useSeoMeta({
  title: page.value?.title || '',
  description: page.value?.description || '',
  ogTitle: page.value?.title || '',
  ogDescription: page.value?.description || '',
  twitterTitle: page.value?.title || '',
  twitterDescription: page.value?.description || '',
  ogImage: `/__og-image__/image${route.path}/og.png`,
  twitterImage: `/__og-image__/image${route.path}/og.png`,
})

defineOgImageComponent('OgImageDocs', {
  title: page.value?.og?.title || 'New Blog Post',
  description: page.value?.og?.description || 'by Matt Thompson',
})

const headline = computed(() => page.value?.headline)
const surroundValue = computed(() => surround.value?.filter(Boolean) || [])
</script>

<template>
  <UPage>
    <UPageHeader
      :title="page.title || ''"
      :description="page.description || ''"
      :links="page.links || []"
      :headline="headline || ''"
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
        <UDivider type="solid" />
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

      <hr v-if="surroundValue.length">

      <UContentSurround
        v-if="surroundValue.length"
        :surround="surroundValue"
      />
    </UPageBody>

    <template
      v-if="page.toc !== false"
      #right
    >
      <UContentToc
        :title="toc?.title"
        :links="page.body?.toc?.links"
      >
        <template
          v-if="page.organization?.name"
          #bottom
        >
          <div class="my-2 pt-2 border-t border-slate-200 dark:border-cyan-800">
            <p class="text-sm">
              <UIcon
                name="heroicons:building-office-2"
                class="inline-block"
              />
              This post was originally written for <a
                :href="page.organization?.site"
                class="text-cyan-500 hover:text-cyan-700 hover:underline"
              >{{ page.organization?.name }}</a>
            </p>
          </div>
        </template>
      </UContentToc>
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
