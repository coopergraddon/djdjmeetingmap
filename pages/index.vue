<template>
  <div class="space-y-10 animate-fade-in">
    <!-- Welcome Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Property Portfolio Dashboard</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Comprehensive management and tracking of all development projects across Bellingham and Blaine areas
      </p>
    </div>

    <!-- CSV Upload Section (shown when no data) -->
    <CSVUpload v-if="false" />

    <!-- Stats Grid -->
    <div v-if="false" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <StatsCard
        title="Total Properties"
        :value="propertiesStore.stats.total"
        subtitle="Active Portfolio"
        icon="fas fa-home"
        color="green"
        @click="navigateToAllProperties"
      />
      <StatsCard
        title="In Construction"
        :value="propertiesStore.stats.construction"
        subtitle="Active Development"
        icon="fas fa-hammer"
        color="green"
        @click="navigateToConstruction"
      />
      <StatsCard
        title="Upcoming"
        :value="propertiesStore.stats.upcoming"
        subtitle="Future Development"
        icon="fas fa-drafting-compass"
        color="blue"
        @click="navigateToUpcoming"
      />
      <StatsCard
        title="Completed"
        :value="propertiesStore.stats.completed"
        subtitle="Finished Projects"
        icon="fas fa-check-circle"
        color="purple"
        @click="navigateToCompleted"
      />
    </div>

    <!-- Charts and Activity Section -->
    <div v-if="false" class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <!-- Phase Distribution Chart -->
      <PhaseChart />
      
      <!-- Recent Activity -->
      <RecentActivity />
    </div>

    <!-- Quick Actions -->
    <div v-if="false" class="glass-effect rounded-2xl p-8 shadow-xl">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div class="p-3 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200">
          <i class="fas fa-rocket text-indigo-600"></i>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          @click="openArcGIS"
          class="group btn-primary text-white px-8 py-6 rounded-xl font-semibold flex items-center justify-center space-x-3 shadow-lg"
        >
          <i class="fas fa-map-marked-alt text-xl group-hover:scale-110 transition-transform"></i>
          <span>Open ArcGIS Map</span>
        </button>
        <button 
          @click="navigateToConstruction"
          class="group bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 rounded-xl font-semibold flex items-center justify-center space-x-3 shadow-lg transition-all hover:scale-105"
        >
          <i class="fas fa-hard-hat text-xl group-hover:scale-110 transition-transform"></i>
          <span>View Construction</span>
        </button>
        <button 
          @click="navigateToAllProperties"
          class="group bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-6 rounded-xl font-semibold flex items-center justify-center space-x-3 shadow-lg transition-all hover:scale-105"
        >
          <i class="fas fa-th-large text-xl group-hover:scale-110 transition-transform"></i>
          <span>Browse All</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { usePropertiesStore } from '@/stores/properties'

// const router = useRouter()
// const propertiesStore = usePropertiesStore()
// const config = useRuntimeConfig()

// Set page metadata
useHead({
  title: 'Dashboard - DJ DJ LLC Property Management'
})

// const navigateToAllProperties = () => {
//   propertiesStore.setCurrentView('list')
//   propertiesStore.setSelectedPhase('')
//   router.push('/properties')
// }

// const navigateToConstruction = () => {
//   propertiesStore.setCurrentView('list')
//   router.push('/properties?category=construction')
// }

// const navigateToUpcoming = () => {
//   propertiesStore.setCurrentView('list')
//   router.push('/properties?category=upcoming')
// }

// const navigateToCompleted = () => {
//   propertiesStore.setCurrentView('list')
//   router.push('/properties?category=completed')
// }

// const openArcGIS = () => {
//   window.open(config.public.arcgisExperienceUrl, '_blank')
// }

// Set current view when component mounts
// onMounted(() => {
//   propertiesStore.setCurrentView('overview')
// })
</script>