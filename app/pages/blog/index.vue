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
const tag = Array.isArray(route?.query?.tag) ? route.query.tag[0] : route?.query?.tag

const { data: posts } = await useAsyncData('posts', () => {
  const query = queryContent('blog')
    .where({ isDir: { $ne: true } })
    .sort({ publishedOn: -1 }) // Sort by creation date, descending
    .limit(limit)
    .skip(skip)

  if (tag) {
    query.where({ tags: { $contains: tag }, isDir: { $ne: true } })
  }

  return query.find()
}, { watch: [() => route.query.tag, () => route.query.page] })

const { data: totalPosts } = await useAsyncData('totalPosts', async () => {
  let q = queryContent('blog')

  if (tag) {
    q = q.where({ tags: { $contains: tag } })
  }

  const p = await q.find()

  return p.length
}, { watch: [() => route.query.tag, () => route.query.page] })

const total = totalPosts?.value

function updatePageNumber(newPageNumber) {
  const searchParams = new URLSearchParams({ page: newPageNumber.toString() })

  if (tag) {
    if (Array.isArray(tag)) {
      tag.forEach((t) => searchParams.append('tag', t))
    } else {
      searchParams.append('tag', tag)
    }
  }

  window.location.href = `/blog?${searchParams.toString()}`
  // router.push({ force: true, query: { page: newPageNumber } }) // Updates the URL but doesn't reload the page
}

const viewAllUrl = process.env.NODE_ENV === 'production' ? 'https://www.mthomps4.com/blog' : 'http://localhost:3000/blog'

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
    <ULandingCard
        orientation="horizontal"
        class="my-10"
      >
      <template #title>
        <h1 class="text-3xl font-bold my-8">{{ page.title }}</h1>
      </template>
        <template #description>
          <div class="whitespace-pre-line">
            {{ page.description }}
          </div>
        </template>
      </ULandingCard>
    <section>
      <a v-if="tag" :href="viewAllUrl">
        <UButton>
          <UIcon name="i-heroicons-arrow-left-20-solid" class="w-4 h-4" />
          View all posts
        </UButton>
      </a>
      <h2 class="text-3xl font-bold my-8">
        Latest Posts <span
          v-if="tag"
          className="text-lg"
        >#{{ tag }}</span>
      </h2>
      <section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ULink
          v-for="(post, index) in posts"
          :key="index"
          :to="post.path"
        >
          <UCard class="group">
            <div class="flex flex-col gap-y-4">
              <div class="ring-1 ring-gray-200 dark:ring-gray-800 relative overflow-hidden aspect-[16/9] w-full rounded-lg pointer-events-none">
                <NuxtImg
                  :src="post?.image?.src"
                  :alt="post?.image?.alt"
                  class="object-cover object-top w-full h-full transform transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div class="flex flex-col justify-between flex-1">
                <div class="flex-1">
                  <h3 class="text-gray-900 dark:text-white text-xl font-semibold truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                    {{ post?.title }}
                  </h3>
                  <h4
                    v-if="post?.headline"
                    class="text-cyan-600 text-sm font-bold my-2"
                  >
                    Series: {{ post?.headline }}
                  </h4>
                  <p class="text-base text-gray-500 dark:text-gray-400 mt-1 line-clamp-3">
                    {{ post?.description }}
                  </p>
                  <p class="text-right text-sm my-2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
                    {{ post?.publishedOn }}
                  </p>
                </div>
              </div>
            </div>
            <p
              v-if="post?.tags"
              class="text-xs text-right text-gray-500"
            >
              {{ post?.tags?.map(tag => `#${tag}`).join(' ') }}
            </p>
          </UCard>
        </ULink>
      </section>
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
