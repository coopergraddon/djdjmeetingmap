<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Global error handling
useHead({
  titleTemplate: '%s | DJ DJ LLC Property Management',
  meta: [
    { name: 'description', content: 'Professional property management and development tracking system for DJ DJ LLC. Monitor construction progress, manage properties, and track project timelines across Bellingham and Blaine areas.' },
    { name: 'keywords', content: 'property management, construction tracking, real estate development, project management, Bellingham, Blaine' }
  ]
})
</script>