<script lang="ts" setup>
definePageMeta({
  layout: 'docs'
})
const route = useRoute()
const { data: page } = await useAsyncData('blog', () => queryContent('main').where({ path: '/blog' }).findOne())
const { data: posts } = await useAsyncData('posts', () =>
  queryContent('blog')
    .where({ tags: { $icontains: route.params.tag[0] } })
    .sort({ publishedOn: -1 }) // Sort by creation date, descending
    .limit(25)
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

const tagHeader = computed(() => {
  return `Posts tagged with "${route.params.tag[0]}"`
})
</script>

<template>
  <UPage>
    <UPageHeader
      :headline="page.headline"
      :title="page.title"
      :description="page.description"
    />
    <section>
      <h2 class="text-3xl font-bold mb-8">
        {{ tagHeader }}
      </h2>
      <p v-if="posts.length === 0">
        No Posts Found!
      </p>
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
              :image="post?.image?.src"
              :alt="post?.image?.alt"
              :date="post.publishedOn"
            />
          </UCard>
        </ULink>
      </UBlogList>
    </section>
  </UPage>
</template>
