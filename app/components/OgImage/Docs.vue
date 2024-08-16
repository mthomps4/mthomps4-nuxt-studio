<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div
    style="background-image: url('https://ik.imagekit.io/mthomps4/site/og-base.png'); background-origin: border-box; background-repeat: no-repeat; background-position: 0% 0%; background-size: cover;"
    class="w-full h-full"
  >
    <div class="relative top-1/4 left-1/3 w-1/2 p-4">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ title }}
      </h1>
      <div
        class="text-2xl text-white leading-tight"
        v-html="description"
      />
    </div>
  </div>
</template>
