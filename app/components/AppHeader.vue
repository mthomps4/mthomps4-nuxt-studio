<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<NavItem[]>('navigation', [])

const { header } = useAppConfig()
</script>

<template>
  <UHeader>
    <template #logo>
      <template v-if="header?.logo?.dark || header?.logo?.light">
        <img
          src="/mascots/lion-logo.png"
          class="h-12 w-12 rounded-full"
        >
        <UColorModeImage v-bind="{ class: 'h-12 w-auto', ...header?.logo }" />
      </template>
      <template v-else>
        Matt Thompson
      </template>
    </template>

    <template
      v-if="header?.search"
      #center
    >
      <UContentSearchButton class="hidden lg:flex" />
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        :label="null"
        class="lg:hidden"
      />

      <template
        v-if="header?.links"
      >
        <div class="hidden sm:block">
          <UButton
            v-for="(link, index) of header.links"
            :key="index"
            v-bind="{ color: 'gray', variant: 'ghost', ...link }"
          />
        </div>
      </template>
      <UColorModeButton v-if="header?.colorMode" />
    </template>

    <template #panel>
      <UNavigationTree
        :links="mapContentNavigation(navigation)"
        :default-open="true"
      />
    </template>
  </UHeader>
</template>
