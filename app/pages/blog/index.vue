<script lang="ts" setup>
definePageMeta({
  layout: 'docs'
})
const route = useRoute()
const { data: page } = await useAsyncData('blog', () => queryContent('main').where({ path: '/blog' }).findOne())

if (!page || !page?.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const limit = 9
const pageNumber = Array.isArray(route.query.page)
  ? parseInt(route.query.page[0], 10) || 1
  : parseInt(route.query.page, 10) || 1
const skip = (pageNumber - 1) * limit

const { data: posts } = await useAsyncData('posts', () =>
  queryContent('blog')
    .sort({ publishedOn: -1 }) // Sort by creation date, descending
    .limit(limit)
    .skip(skip)
    .find()
)

const { data: totalPosts } = await useAsyncData('totalPosts', async () => {
  const p = await queryContent('blog').find()
  return p.length
})

const total = totalPosts?.value

function updatePageNumber(newPageNumber) {
  window.location.href = `/blog?page=${newPageNumber}`
  // router.push({ force: true, query: { page: newPageNumber } }) // Updates the URL but doesn't reload the page
}

useSeoMeta({
  title: page?.value.title,
  description: page?.value.description,
  ogTitle: page?.value.title,
  ogDescription: page?.value.description,
  twitterTitle: page?.value.title,
  twitterDescription: page?.value.description,
  ogImage: `/__og-image__/image${route.path}/og.png`,
  twitterImage: `/__og-image__/image${route.path}/og.png`
})

defineOgImageComponent('OgImageDocs', {
  title: page?.value.og.title,
  description: page?.value.og.description
})
</script>

<template>
  <UPage>
    <UPageHeader
      :title="page.title"
      :description="page.description"
    />
    <section>
      <h2 class="text-3xl font-bold mb-8">
        Latest Posts
      </h2>
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
              :date="post?.publishedOn"
            />
          </UCard>
        </ULink>
      </UBlogList>
      <UPagination
        :model-value="pageNumber"
        :total="total"
        :page-count="limit"
        :skip="skip"
        :page="pageNumber"
        size="sm"
        class="flex justify-center items-center my-8"
        @update:model-value="updatePageNumber"
      />
    </section>
  </UPage>
</template>
