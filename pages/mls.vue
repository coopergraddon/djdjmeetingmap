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
          <h1 class="text-4xl font-bold text-gray-900 mb-2">MLS Properties</h1>
          <p class="text-gray-600">Scored and ranked properties from Northwest MLS (NWMLS)</p>
          <p class="text-sm text-blue-600 mt-1">
            <i class="fas fa-info-circle mr-1"></i>
            Real-time data from MLS Grid API - Properties scored based on lot size, bedrooms, bathrooms, price, utilities, zoning, and proximity to Bellingham
          </p>
          <!-- NWMLS Compliance Notice -->
          <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-start">
              <i class="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-2"></i>
              <div class="text-sm text-yellow-800">
                <p class="font-semibold">NWMLS Data Use Compliance</p>
                <p>This data is provided by Northwest MLS (NWMLS) through MLS Grid. All listings are subject to NWMLS Data Use Policy and Rules. 
                Information is deemed reliable but not guaranteed. Data is for informational purposes only and should be verified independently.</p>
                <p class="mt-2 text-xs">
                  <i class="fas fa-shield-alt mr-1"></i>
                  RESO Standards Compliant | NWMLS Data Use Policy | MLS Grid IDX Rules
                </p>
              </div>
            </div>
          </div>
          <div v-if="lastUpdated" class="mt-2 text-sm text-gray-500">
            <i class="fas fa-clock mr-1"></i>
            Last updated: {{ new Date(lastUpdated).toLocaleString() }}
          </div>
        </div>
        <NuxtLink to="/" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg">
          <i class="fas fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span class="text-lg text-gray-600">Loading MLS properties...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-2xl mx-auto">
          <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h3 class="text-xl font-semibold text-red-800 mb-2">Error Loading MLS Data</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="fetchMLSProperties" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            <i class="fas fa-redo mr-2"></i>Retry
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8">
        <!-- Stats Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="text-2xl font-bold text-gray-900">{{ totalProperties }}</div>
            <div class="text-gray-600">Total Properties</div>
          </div>
          <div class="bg-green-50 rounded-xl p-6 shadow-lg border border-green-200">
            <div class="text-2xl font-bold text-green-700">{{ propertiesToReview.length }}</div>
            <div class="text-green-600">Properties to Review</div>
          </div>
          <div class="bg-blue-50 rounded-xl p-6 shadow-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-700">{{ averageScore.toFixed(1) }}</div>
            <div class="text-blue-600">Average Score</div>
          </div>
          <div class="bg-purple-50 rounded-xl p-6 shadow-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-700">${{ averagePrice.toLocaleString() }}</div>
            <div class="text-purple-600">Average Price</div>
          </div>
        </div>

        <!-- Properties to Review Section -->
        <div v-if="propertiesToReview.length" class="bg-white rounded-xl p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-green-700 mb-6 flex items-center">
            <i class="fas fa-star mr-3"></i>
            Properties to Review (Score > 80)
          </h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="property in propertiesToReview" :key="property.mlsId" class="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-lg text-gray-900">{{ property.address }}</h3>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Score: {{ property.score }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span class="font-medium">Price:</span> ${{ property.price.toLocaleString() }}
                </div>
                <div>
                  <span class="font-medium">Lot Size:</span> {{ property.lotSize }} acres
                </div>
                <div>
                  <span class="font-medium">Beds/Baths:</span> {{ property.bedrooms }}/{{ property.bathrooms }}
                </div>
                <div>
                  <span class="font-medium">Utilities:</span> {{ property.utilitiesStubbed ? 'Stubbed' : 'Not Stubbed' }}
                </div>
                <div>
                  <span class="font-medium">Square Feet:</span> {{ property.squareFootage ? property.squareFootage.toLocaleString() : 'N/A' }}
                </div>
                <div>
                  <span class="font-medium">Property Type:</span> {{ property.propertySubType || property.propertyType }}
                </div>
              </div>
              <div class="text-xs text-gray-500">
                <div>Zoning: {{ property.zoning }}</div>
                <div>Proximity: {{ property.proximity }} miles</div>
                <div v-if="property.listingDate">Listed: {{ new Date(property.listingDate).toLocaleDateString() }}</div>
                <div>MLS ID: {{ property.mlsId }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Properties Section -->
        <div v-if="otherProperties.length" class="bg-white rounded-xl p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <i class="fas fa-list mr-3"></i>
            Other Properties
          </h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="property in otherProperties" :key="property.mlsId" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-lg text-gray-900">{{ property.address }}</h3>
                <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Score: {{ property.score }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span class="font-medium">Price:</span> ${{ property.price.toLocaleString() }}
                </div>
                <div>
                  <span class="font-medium">Lot Size:</span> {{ property.lotSize }} acres
                </div>
                <div>
                  <span class="font-medium">Beds/Baths:</span> {{ property.bedrooms }}/{{ property.bathrooms }}
                </div>
                <div>
                  <span class="font-medium">Utilities:</span> {{ property.utilitiesStubbed ? 'Stubbed' : 'Not Stubbed' }}
                </div>
                <div>
                  <span class="font-medium">Square Feet:</span> {{ property.squareFootage ? property.squareFootage.toLocaleString() : 'N/A' }}
                </div>
                <div>
                  <span class="font-medium">Property Type:</span> {{ property.propertySubType || property.propertyType }}
                </div>
              </div>
              <div class="text-xs text-gray-500">
                <div>Zoning: {{ property.zoning }}</div>
                <div>Proximity: {{ property.proximity }} miles</div>
                <div v-if="property.listingDate">Listed: {{ new Date(property.listingDate).toLocaleDateString() }}</div>
                <div>MLS ID: {{ property.mlsId }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Properties Message -->
        <div v-if="!propertiesToReview.length && !otherProperties.length" class="text-center py-12">
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto">
            <i class="fas fa-search text-gray-400 text-3xl mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No MLS Properties Found</h3>
            <p class="text-gray-600">No properties are currently available in the MLS database.</p>
          </div>
        </div>
      </div>
     
      <!-- NWMLS Attribution Footer - Required by Data Use Policy -->
      <footer class="mt-12 py-6 border-t border-gray-200">
        <div class="text-center text-sm text-gray-600">
          <p class="mb-2">
            <i class="fas fa-database mr-1"></i>
            Data provided by Northwest MLS (NWMLS) through MLS Grid
          </p>
          <p class="text-xs text-gray-500">
            © {{ new Date().getFullYear() }} Northwest MLS. All rights reserved. 
            Information is deemed reliable but not guaranteed. 
            Subject to NWMLS Data Use Policy and Rules.
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(true);
const error = ref(null);
const mlsProperties = ref([]);
const lastUpdated = ref(null);

// Computed properties
const propertiesToReview = computed(() => 
  mlsProperties.value.filter(p => p.score > 80)
);

const otherProperties = computed(() => 
  mlsProperties.value.filter(p => p.score <= 80)
);

const totalProperties = computed(() => mlsProperties.value.length);

const averageScore = computed(() => {
  if (mlsProperties.value.length === 0) return 0;
  const total = mlsProperties.value.reduce((sum, p) => sum + p.score, 0);
  return total / mlsProperties.value.length;
});

const averagePrice = computed(() => {
  if (mlsProperties.value.length === 0) return 0;
  const total = mlsProperties.value.reduce((sum, p) => sum + p.price, 0);
  return total / mlsProperties.value.length;
});

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

// Fetch MLS properties
const fetchMLSProperties = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await $fetch('/api/mls-properties');
    
    if (response.success) {
      mlsProperties.value = response.properties;
      lastUpdated.value = response.lastUpdated;
    } else {
      error.value = response.error || 'Failed to fetch MLS properties';
    }
  } catch (err) {
    console.error('Error fetching MLS properties:', err);
    error.value = 'Failed to load MLS property data';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMLSProperties();
});
</script> 