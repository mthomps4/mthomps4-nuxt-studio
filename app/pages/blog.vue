<script lang="ts" setup>
definePageMeta({
  layout: 'docs'
})
const route = useRoute()
const { data: page } = await useAsyncData('blog', () => queryContent('main').where({ path: '/blog' }).findOne())
const { data: posts } = await useAsyncData('posts', () =>
  queryContent('blog')
    .sort({ createdAt: -1 }) // Sort by creation date, descending
    .limit(3) // Limit to the last 3 posts
    .find()
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
</script>

<template>
  <UPage>
    <UPageHeader
      :headline="page.headline"
      :title="page.title"
      :description="page.description"
    />
    <h1> YOU STOPPED HERE </h1>
    <ULandingSection
      title="Latest Posts"
      descriptions=""
      class-name="my-8"
    >
      <UBlogList orientation="horizontal">
        <ULink
          v-for="(post, index) in posts"
          :key="index"
          :to="post.path"
        >
          <UCard>
            <UBlogPost
              :title="post.title"
              :description="post.description"
              :image="post.image.src"
              :alt="post.image.alt"
            />
          </UCard>
        </ULink>
      </UBlogList>
    </ULandingSection>
  </UPage>
</template>
