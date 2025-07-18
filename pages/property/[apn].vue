<template>
  <div class="bg-gray-50 min-h-screen">
    <AppHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span class="text-lg text-gray-600">Loading property data...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-2xl mx-auto">
          <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h3 class="text-xl font-semibold text-red-800 mb-2">Error Loading Property</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <NuxtLink to="/" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Property Not Found -->
      <div v-else-if="!property && !isLoading" class="text-center py-12">
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-2xl mx-auto">
          <i class="fas fa-search text-yellow-500 text-3xl mb-4"></i>
          <h3 class="text-xl font-semibold text-yellow-800 mb-2">Property Not Found</h3>
          <p class="text-yellow-600 mb-4">No property found with APN: {{ route.params.apn }}</p>
          <NuxtLink to="/" class="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Property Detail Content -->
      <div v-else class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ property.address || 'Property Details' }}</h1>
            <p class="text-gray-600">Comprehensive property information and project status</p>
          </div>
          <NuxtLink to="/" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg">
            <i class="fas fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </NuxtLink>
        </div>
        
        <PropertyDetail :property="property" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PropertyDetail from '~/components/PropertyDetail.vue';

const route = useRoute();
const isLoading = ref(true);
const error = ref(null);
const property = ref(null);

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('/api/properties');
    if (response && response.properties) {
      property.value = response.properties.find(p => p.apn === route.params.apn);
    }
    isLoading.value = false;
  } catch (err) {
    error.value = 'Failed to load property data';
    isLoading.value = false;
  }
});
</script> 