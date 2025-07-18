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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input v-model="searchTerm" type="text" placeholder="Search by address, APN, or city..." class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80">
            </div>
            <div class="relative">
              <i class="fas fa-filter absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <select v-model="selectedPhase" class="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white/80 min-w-[200px]">
                <option value="">All Phases</option>
                <option value="Sheetrock">Sheetrock</option>
                <option value="Flatwork">Flatwork</option>
                <option value="Roof">Roof</option>
                <option value="Final">Final</option>
                <option value="Design">Design</option>
                <option value="Sold">Sold</option>
                <option value="Listed">Listed</option>
                <option value="Pending">Pending</option>
                <option value="Delete">Delete</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Properties Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PropertyCard 
            v-for="property in filteredProperties" 
            :key="property.id" 
            :property="property"
            @view-arcgis="handleViewArcGIS(property.apn)"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useProperties } from '~/composables/useProperties';
import PropertyCard from '~/components/PropertyCard.vue';
// CsvUploader import removed

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
  stopAutoRefresh
} = useProperties();

const phaseChartCanvas = ref(null);
let phaseChart = null;



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
          '#374151', // Dark Gray - Flatwork  
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

onMounted(async () => {
  await nextTick();
  
  // Fetch initial data
  await fetchProperties();
  
  // Initialize chart after data is loaded
  initializePhaseChart();
  
  // Start auto-refresh
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script> 