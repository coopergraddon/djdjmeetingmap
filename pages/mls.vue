<template>
  <div class="bg-gray-50 min-h-screen">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">MLS Properties</h1>
        <NuxtLink to="/" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg">
          <i class="fas fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </NuxtLink>
      </div>
      <div class="flex gap-6 mb-8">
        <button class="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-700 px-6 py-4 rounded-xl font-semibold shadow transition-all">Properties to Review</button>
        <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold shadow transition-all">Other Properties</button>
      </div>
      <div class="text-center text-gray-500 text-xl py-12">
        MLS integration coming soon...
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
</script> 