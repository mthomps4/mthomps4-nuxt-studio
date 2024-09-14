import posthog from 'posthog-js'

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    disable_session_recording: true,
    autocapture: true,
    respect_dnt: true,
    capture_pageview: false, // we add manual pageview capturing below
    loaded: (posthog) => {
      if (import.meta.env.MODE === 'development') posthog.debug()
    },
  })

  // Make sure that pageviews are captured with each route change
  const router = useRouter()

  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture('$pageview', {
        current_url: to.fullPath,
        page_title: document.title,
      })
    })
  })

  return {
    provide: {
      posthog: () => posthogClient,
    },
  }
})
