<template>
  <div class="bg-gray-50">
    <AppHeader 
      @show-all="showAllPropertiesAndScroll"
      @show-construction="showConstructionAndScroll"
      @show-completed="showCompletedAndScroll"
      @click-dashboard="showPortfolioOverviewAndScroll"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- ArcGIS Map Embed -->
      <div class="mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <iframe
          src="https://experience.arcgis.com/experience/c69f053c68e84a0ab98bc80b00836949/"
          width="100%"
          height="500"
          style="border:0; min-height:400px; width:100%;"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <!-- Portfolio Overview -->
      <div v-if="currentView === 'overview'" class="space-y-10 animate-fade-in">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-flex items-center space-x-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span class="text-lg text-gray-600">Loading property data...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="space-y-8">
          <div class="text-center py-12">
            <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-2xl mx-auto">
              <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
              <h3 class="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h3>
              <p class="text-red-600 mb-4">{{ error }}</p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button @click="fetchProperties" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  <i class="fas fa-redo mr-2"></i>Retry
                </button>
              </div>
            </div>
          </div>
          
        </div>

        <!-- Data Content -->
        <div v-else>
        <!-- Welcome Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Property Management Dashboard</h1>
          <div v-if="lastUpdated" class="mt-4 text-sm text-gray-500">
            <i class="fas fa-clock mr-1"></i>
            Last updated: {{ new Date(lastUpdated).toLocaleString() }}
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div @click="showAllProperties()" class="stats-card card-hover rounded-2xl p-8 text-center cursor-pointer">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
              <i class="fas fa-home text-2xl text-white"></i>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ allProperties.length }}</div>
            <div class="text-gray-600 font-medium">Total Properties</div>
            <div class="mt-2 text-sm text-green-600">Active Portfolio</div>
          </div>
          <div @click="showPropertiesByCategory('Construction')" class="stats-card card-hover rounded-2xl p-8 text-center cursor-pointer">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <i class="fas fa-hammer text-2xl text-white"></i>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ allProperties.filter(p => ['Sheetrock', 'Flatwork', 'Roof', 'Final'].includes(p.phase)).length }}</div>
            <div class="text-gray-600 font-medium">In Construction</div>
            <div class="mt-2 text-sm text-green-600">Active Development</div>
          </div>
          <div @click="showPropertiesByCategory('Upcoming')" class="stats-card card-hover rounded-2xl p-8 text-center cursor-pointer">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <i class="fas fa-drafting-compass text-2xl text-white"></i>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ allProperties.filter(p => ['Design', 'Hold', 'Upcoming'].includes(p.phase)).length }}</div>
            <div class="text-gray-600 font-medium">Upcoming</div>
            <div class="mt-2 text-sm text-blue-600">Future Development</div>
          </div>
          <div @click="showPropertiesByCategory('Completed')" class="stats-card card-hover rounded-2xl p-8 text-center cursor-pointer">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <i class="fas fa-check-circle text-2xl text-white"></i>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ allProperties.filter(p => ['Sold', 'Listed', 'Pending'].includes(p.phase)).length }}</div>
            <div class="text-gray-600 font-medium">Completed</div>
            <div class="mt-2 text-sm text-purple-600">Finished Projects</div>
          </div>
          <!-- MLS Properties Button - External Link -->
          <a href="https://onesearch.vercel.app" target="_blank" rel="noopener noreferrer" class="stats-card card-hover rounded-2xl p-8 text-center cursor-pointer">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
              <i class="fas fa-building text-2xl text-white"></i>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">MLS</div>
            <div class="text-gray-600 font-medium">MLS Properties</div>
            <div class="mt-2 text-sm text-pink-600">External Search</div>
          </a>
        </div>

        <!-- Phase Distribution Chart -->
        <div class="glass-effect rounded-2xl p-8 shadow-xl">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Phase Distribution</h2>
            <div class="p-3 rounded-full bg-gradient-to-br from-green-100 to-green-200">
              <i class="fas fa-chart-pie text-green-600"></i>
            </div>
          </div>
          <div class="relative h-80">
            <canvas ref="phaseChartCanvas"></canvas>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-effect rounded-2xl p-8 shadow-xl">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <div class="p-3 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200">
              <i class="fas fa-rocket text-indigo-600"></i>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button @click="openArcGISMap()" class="group btn-primary text-white px-8 py-6 rounded-xl font-semibold flex items-center justify-center space-x-3 shadow-lg">
              <i class="fas fa-map-marked-alt text-xl group-hover:scale-110 transition-transform"></i>
              <span>Open ArcGIS Map</span>
            </button>
            <button @click="showPropertiesByCategory('Construction')" class="group bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 rounded-xl font-semibold flex items-center justify-center space-x-3 shadow-lg transition-all hover:scale-105">
              <i class="fas fa-hard-hat text-xl group-hover:scale-110 transition-transform"></i>
              <span>View Construction</span>
            </button>
            <button @click="showAllProperties()" class="group bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-6 rounded-xl font-semibold flex items-center justify-center space-x-3 shadow-lg transition-all hover:scale-105">
              <i class="fas fa-th-large text-xl group-hover:scale-110 transition-transform"></i>
              <span>Browse All</span>
            </button>
          </div>
        </div>
        
        </div>
      </div>

      <!-- MLS Properties View -->
      <!-- (Removed from here; now a dedicated page) -->

      <!-- Property List View -->
      <div v-if="currentView === 'list'" class="space-y-8 animate-fade-in">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">All Properties</h1>
            <p class="text-gray-600">Manage and track all development properties</p>
          </div>
          <button @click="showPortfolioOverview()" class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg">
            <i class="fas fa-arrow-left"></i>
            <span>Back to Dashboard</span>
          </button>
        </div>
        
        <!-- Search and Filter -->
        <div class="glass-effect rounded-2xl p-6 shadow-lg">
          <form @submit.prevent="triggerSearch" class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative max-w-xl w-full">
              <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input v-model="searchTerm" type="text" :placeholder="`Search by ${searchFieldLabel}...`" class="w-full pl-12 pr-4 py-3 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80" @keyup.enter="triggerSearch">
            </div>
            <div>
              <select v-model="searchField" class="pl-4 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white/80 min-w-[160px]">
                <option value="all">All Fields</option>
                <option value="address">Address</option>
                <option value="city">City</option>
                <option value="apn">APN</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div class="relative">
              <i class="fas fa-filter absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <select v-model="selectedPhase" class="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white/80 min-w-[200px]">
                <option value="">All Phases</option>
                <option value="Sheetrock">Sheetrock</option>
                <option value="Flatwork">Groundwork</option>
                <option value="Roof">Roof</option>
                <option value="Final">Final</option>
                <option value="Design">Design</option>
                <option value="Sold">Sold</option>
                <option value="Listed">Listed</option>
                <option value="Pending">Pending</option>
                <option value="Delete">Delete</option>
              </select>
            </div>
            <div class="flex flex-col md:flex-row gap-2 items-center">
              <label class="text-gray-600 text-sm">Deadline From</label>
              <input v-model="completionFrom" type="date" class="border border-gray-200 rounded-xl px-3 py-2 bg-white/80" />
            </div>
            <div class="flex flex-col md:flex-row gap-2 items-center">
              <label class="text-gray-600 text-sm">Deadline To</label>
              <input v-model="completionTo" type="date" class="border border-gray-200 rounded-xl px-3 py-2 bg-white/80" />
            </div>
            <div class="flex items-end">
              <button type="submit" class="btn-primary px-6 py-3 rounded-xl font-semibold text-white">Search</button>
            </div>
          </form>
        </div>
        
        <!-- Properties Grid -->
        <div v-if="filteredProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PropertyCard 
            v-for="property in filteredProperties" 
            :key="property.id" 
            :property="property"
            @view-arcgis="handleViewArcGIS(property.apn)"
            @click="cacheSearchState()"
          />
        </div>
        <div v-else class="text-center text-gray-500 text-xl py-12">
          No properties found for the selected criteria.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import { useProperties } from '~/composables/useProperties';
import PropertyCard from '~/components/PropertyCard.vue';
// CsvUploader import removed

const route = useRoute();

const {
  allProperties,
  filteredProperties,
  currentView,
  searchTerm,
  selectedPhase,
  isLoading,
  error,
  lastUpdated,
  fetchProperties,
  showAllProperties,
  showPortfolioOverview,
  showPropertiesByCategory,
  handleViewArcGIS,
  startAutoRefresh,
  stopAutoRefresh,
  filterProperties, // Ensure this is imported
  searchField,
  completionFrom,
  completionTo
} = useProperties();

const phaseChartCanvas = ref(null);
let phaseChart = null;

const searchFieldLabel = computed(() => {
  switch (searchField.value) {
    case 'address': return 'address';
    case 'city': return 'city';
    case 'apn': return 'APN';
    case 'client': return 'client name';
    default: return 'address, city, APN, or client';
  }
});


const openArcGISMap = () => {
  window.open('https://experience.arcgis.com/experience/c69f053c68e84a0ab98bc80b00836949/', '_blank');
};

const initializePhaseChart = () => {
  if (!phaseChartCanvas.value) return;
  
  const ctx = phaseChartCanvas.value.getContext('2d');
  
  // Count properties by phase from real data
  const phaseCounts = {};
  allProperties.value.forEach(property => {
    phaseCounts[property.phase] = (phaseCounts[property.phase] || 0) + 1;
  });

  if (phaseChart) {
    phaseChart.destroy();
  }

  phaseChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(phaseCounts),
      datasets: [{
        data: Object.values(phaseCounts),
        backgroundColor: [
          '#8B5CF6', // Purple - Sheetrock
          '#374151', // Dark Gray - Groundwork  
          '#0F766E', // Teal - Roof
          '#059669', // Green - Final
          '#2563EB', // Blue - Design
          '#16A34A', // Dark Green - Sold
          '#059669', // Green - Listed
          '#0891B2', // Light Blue - Pending
          '#DC2626', // Red - Delete
          '#9CA3AF'  // Light Gray - Other
        ],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 25,
            usePointStyle: true,
            font: {
              size: 13,
              weight: '500'
            },
            generateLabels: function(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1e4d4b',
          bodyColor: '#374151',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} properties (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 1500,
        easing: 'easeOutQuart'
      },
      hover: {
        mode: 'nearest',
        intersect: true
      }
    }
  });
};

const showAllPropertiesAndScroll = () => {
  showAllProperties();
  scrollToList();
};
const showConstructionAndScroll = () => {
  showPropertiesByCategory('Construction');
  scrollToList();
};
const showPortfolioOverviewAndScroll = () => {
  showPortfolioOverview();
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};
const showCompletedAndScroll = () => {
  showPropertiesByCategory('Completed', ['Listed', 'Sold', 'Pending']);
  scrollToList();
};

function scrollToList() {
  nextTick(() => {
    const el = document.querySelector('.animate-fade-in');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
}

const triggerSearch = () => {
  filterProperties();
  // Cache the current search state after performing a search
  cacheCurrentSearchState();
};

const resetFilters = () => {
  searchTerm.value = '';
  searchField.value = 'all';
  selectedPhase.value = '';
  completionFrom.value = '';
  completionTo.value = '';
  showAllProperties();
};

// Function to cache the current search state
const cacheCurrentSearchState = () => {
  const state = {
    searchTerm: searchTerm.value,
    searchField: searchField.value,
    selectedPhase: selectedPhase.value,
    completionFrom: completionFrom.value,
    completionTo: completionTo.value
  };
  console.log('Caching current search state:', state);
  sessionStorage.setItem('propertySearchState', JSON.stringify(state));
};

// Cache search/filter state before navigating to property details
function cacheSearchState() {
  cacheCurrentSearchState();
}

onMounted(async () => {
  await nextTick();
  
  console.log('Page mounted, route query:', route.query);
  
  // Fetch initial data first
  await fetchProperties();
  
  // Check for view query parameter
  if (route.query.view === 'list') {
    console.log('Setting view to list from query parameter');
    currentView.value = 'list';
    
    // Restore search state immediately after setting view
    const cached = sessionStorage.getItem('propertySearchState');
    if (cached) {
      try {
        const state = JSON.parse(cached);
        console.log('Restoring search state on mount:', state);
        searchTerm.value = state.searchTerm || '';
        searchField.value = state.searchField || 'all';
        selectedPhase.value = state.selectedPhase || '';
        completionFrom.value = state.completionFrom || '';
        completionTo.value = state.completionTo || '';
        // Apply filters after restoring state
        await nextTick();
        filterProperties();
      } catch (e) {
        console.error('Error restoring search state on mount:', e);
      }
    }
  }
  
  // Initialize chart after data is loaded
  initializePhaseChart();
  
  // Start auto-refresh
  startAutoRefresh();
});

// Watch for route changes to handle navigation back from property details
watch(() => route.query.view, (newView) => {
  console.log('Route query view changed to:', newView);
  if (newView === 'list') {
    console.log('Setting view to list from route change');
    currentView.value = 'list';
   
    // Try to restore search state when view changes to list
    const cached = sessionStorage.getItem('propertySearchState');
    if (cached) {
      try {
        const state = JSON.parse(cached);
        console.log('Restoring search state from route change:', state);
        searchTerm.value = state.searchTerm || '';
        searchField.value = state.searchField || 'all';
        selectedPhase.value = state.selectedPhase || '';
        completionFrom.value = state.completionFrom || '';
        completionTo.value = state.completionTo || '';
        filterProperties();
      } catch (e) {
        console.error('Error restoring search state from route change:', e);
      }
    }
  }
});

// Watch for currentView changes
watch(() => currentView.value, (newView) => {
  console.log('currentView changed to:', newView);
});

// Watch for search term changes
watch(() => searchTerm.value, (newTerm) => {
  console.log('searchTerm changed to:', newTerm);
  // Cache state when search term changes
  if (currentView.value === 'list') {
    cacheCurrentSearchState();
  }
});

// Watch for other search parameters
watch(() => selectedPhase.value, (newPhase) => {
  console.log('selectedPhase changed to:', newPhase);
  if (currentView.value === 'list') {
    cacheCurrentSearchState();
  }
});

watch(() => searchField.value, (newField) => {
  console.log('searchField changed to:', newField);
  if (currentView.value === 'list') {
    cacheCurrentSearchState();
  }
});

watch(() => completionFrom.value, (newFrom) => {
  console.log('completionFrom changed to:', newFrom);
  if (currentView.value === 'list') {
    cacheCurrentSearchState();
  }
});

watch(() => completionTo.value, (newTo) => {
  console.log('completionTo changed to:', newTo);
  if (currentView.value === 'list') {
    cacheCurrentSearchState();
  }
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script> 