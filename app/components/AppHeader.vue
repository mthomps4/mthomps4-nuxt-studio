<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<NavItem[]>('navigation', [])

const { header } = useAppConfig()
</script>

<template>
  <UHeader>
    <template #logo>
      <template v-if="header?.logo?.dark || header?.logo?.light">
        <div class="flex items-center justify-center">
          <img
            src="/brand/lion-logo.png"
            class="h-12 w-12 rounded-full bg-cyan-900 mr-2"
          >
          <UColorModeImage v-bind="{ class: 'h-16 w-auto', ...header?.logo }" />
        </div>
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
            v-for="(link, index) in header.links"
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
    <template #bottom>
      <div class="sm:hidden flex justify-center items-center gap-4 border-t-[1px] border-b-0 border-cyan-700 shadow-xl">
        <UButton
          v-for="(link, index) in header.links"
          :key="index"
          v-bind="{ color: 'gray', variant: 'ghost', ...link }"
        />
      </div>
    </template>
  </UHeader>
</template>
