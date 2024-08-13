<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<Ref<NavItem[]>>('navigation')
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside>
          <h3 class="font-semibold">
            More Reads:
          </h3>
          <UNavigationTree
            :links="mapContentNavigation(navigation)"
            :default-open="true"
          />
        </UAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
