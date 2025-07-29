<template>
  <div class="bg-gray-50 min-h-screen">
    <AppHeader 
      @show-all="goToAllProperties"
      @show-construction="goToConstruction"
      @show-completed="goToCompleted"
      @click-dashboard="goToDashboard"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">MLS Data Explorer</h1>
          <p class="text-gray-600">Explore and verify the MLS Grid API data structure</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/mls" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg">
            <i class="fas fa-chart-line"></i>
            <span>View Scored Properties</span>
          </NuxtLink>
          <NuxtLink to="/" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg">
            <i class="fas fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span class="text-lg text-gray-600">Loading MLS data...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-2xl mx-auto">
          <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h3 class="text-xl font-semibold text-red-800 mb-2">Error Loading MLS Data</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="fetchData" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            <i class="fas fa-redo mr-2"></i>Retry
          </button>
        </div>
      </div>

      <!-- Data Content -->
      <div v-else class="space-y-8">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="text-2xl font-bold text-gray-900">{{ totalProperties }}</div>
            <div class="text-gray-600">Total Properties</div>
          </div>
          <div class="bg-blue-50 rounded-xl p-6 shadow-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-700">{{ allFields.length }}</div>
            <div class="text-blue-600">Available Fields</div>
          </div>
          <div class="bg-green-50 rounded-xl p-6 shadow-lg border border-green-200">
            <div class="text-2xl font-bold text-green-700">{{ residentialProperties.length }}</div>
            <div class="text-green-600">Residential Properties</div>
          </div>
          <div class="bg-purple-50 rounded-xl p-6 shadow-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-700">{{ activeProperties.length }}</div>
            <div class="text-purple-600">Active Listings</div>
          </div>
        </div>

        <!-- Sample Properties -->
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Sample Properties (First 5)</h2>
          <div class="space-y-4">
            <div v-for="property in sampleProperties" :key="property.listingKey" class="border border-gray-200 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span class="font-medium text-gray-700">Address:</span>
                  <div class="text-sm text-gray-900">{{ property.address }}</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Type:</span>
                  <div class="text-sm text-gray-900">{{ property.propertyType }} - {{ property.propertySubType }}</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Price:</span>
                  <div class="text-sm text-gray-900">${{ property.listPrice?.toLocaleString() || 'N/A' }}</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Status:</span>
                  <div class="text-sm text-gray-900">{{ property.status }}</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Beds/Baths:</span>
                  <div class="text-sm text-gray-900">{{ property.bedrooms || 0 }}/{{ property.bathrooms || 0 }}</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Lot Size:</span>
                  <div class="text-sm text-gray-900">{{ property.lotSize || 0 }} acres</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Living Area:</span>
                  <div class="text-sm text-gray-900">{{ property.livingArea?.toLocaleString() || 0 }} sq ft</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Location:</span>
                  <div class="text-sm text-gray-900">{{ property.city }}, {{ property.state }}</div>
                </div>
              </div>
              <div class="mt-3 text-xs text-gray-500">
                <span class="font-medium">MLS ID:</span> {{ property.listingKey }} | 
                <span class="font-medium">Utilities:</span> {{ property.utilities?.join(', ') || 'N/A' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Available Fields -->
        <div class="bg-white rounded-xl p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Available Fields ({{ allFields.length }})</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <div v-for="field in allFields" :key="field" class="bg-gray-50 rounded px-3 py-2 text-sm font-mono text-gray-700">
              {{ field }}
            </div>
          </div>
        </div>

        <!-- Raw Sample Data -->
        <div v-if="rawSample" class="bg-white rounded-xl p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Raw Sample Property Data</h2>
          <pre class="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">{{ JSON.stringify(rawSample, null, 2) }}</pre>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);
const error = ref(null);
const mlsData = ref(null);

// Computed properties
const totalProperties = computed(() => mlsData.value?.totalProperties || 0);
const allFields = computed(() => mlsData.value?.allAvailableFields || []);
const sampleProperties = computed(() => mlsData.value?.sampleProperties || []);
const rawSample = computed(() => mlsData.value?.rawSample || null);

const residentialProperties = computed(() => 
  sampleProperties.value.filter(p => p.propertyType === 'Residential')
);

const activeProperties = computed(() => 
  sampleProperties.value.filter(p => p.status === 'Active')
);

// Navigation functions
const goToDashboard = () => {
  router.push('/');
};

const goToAllProperties = () => {
  router.push('/?view=list');
};

const goToConstruction = () => {
  router.push('/?view=list');
};

const goToCompleted = () => {
  router.push('/?view=list');
};

// Fetch MLS data
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await $fetch('/api/mls-explorer');
    
    if (response.success) {
      mlsData.value = response;
    } else {
      error.value = response.error || 'Failed to fetch MLS data';
    }
  } catch (err) {
    console.error('Error fetching MLS data:', err);
    error.value = 'Failed to load MLS data';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script> 