<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<Ref<NavItem[]>>('navigation')

</script>

<style lang="postcss" scoped>
  aside {
    :deep(button) {
        span {
          font-size: 11px;
        }
      }
    :deep(a) {
      span {
        font-size: 11px;
      }
    }
  }
</style>

<template>
  <UContainer>
    <UPage>

      <slot />
      <section class="w-full mx-auto">
        <p class="text-sm">Blog Archive</p>
        <UNavigationTree
        :links="mapContentNavigation(navigation[0].children)"
        :default-open="true"
        :multiple="false"
        />
      </section>
    </UPage>
  </UContainer>
</template>
