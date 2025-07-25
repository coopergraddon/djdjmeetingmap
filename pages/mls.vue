<template>
  <div class="bg-gray-50 min-h-screen">
    <AppHeader @click-dashboard="goToDashboard" />
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">MLS Properties</h1>
        <NuxtLink to="/" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg">
          <i class="fas fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </NuxtLink>
      </div>
      <div class="flex gap-6 mb-8">
        <button class="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-6 py-4 rounded-xl font-semibold shadow transition-all">Properties to Review</button>
        <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold shadow transition-all">Other Properties</button>
      </div>
      <!-- Properties to Review Section -->
      <div v-if="propertiesToReview.length" class="mb-12">
        <h2 class="text-2xl font-bold text-green-700 mb-4">Properties to Review (Score &gt; 80)</h2>
        <ul class="space-y-4">
          <li v-for="p in propertiesToReview" :key="p.address" class="bg-white rounded-xl p-6 shadow flex justify-between items-center">
            <span class="font-semibold text-lg">{{ p.address }}</span>
            <span class="text-green-700 font-bold">Score: {{ p.score }}</span>
          </li>
        </ul>
      </div>
      <!-- Other Properties Section -->
      <div v-if="otherProperties.length">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">Other Properties</h2>
        <ul class="space-y-4">
          <li v-for="p in otherProperties" :key="p.address" class="bg-gray-100 rounded-xl p-6 shadow flex justify-between items-center">
            <span class="font-semibold text-lg">{{ p.address }}</span>
            <span class="text-gray-700 font-bold">Score: {{ p.score }}</span>
          </li>
        </ul>
      </div>
      <div v-if="!propertiesToReview.length && !otherProperties.length" class="text-center text-gray-500 text-xl py-12">
        MLS integration coming soon...
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
import { useRouter } from 'vue-router';
// Placeholder: import { scoreMLSProperties } from '~/server/api/mls-score';

// Placeholder for future MLS data
const scoredProperties = [
  // Example structure:
  // { address: '123 Main St', score: 92, ... }
];

// Split properties by score
const propertiesToReview = scoredProperties.filter(p => p.score > 80);
const otherProperties = scoredProperties.filter(p => p.score <= 80);

const router = useRouter();
function goToDashboard() {
  router.push('/');
}
</script> 