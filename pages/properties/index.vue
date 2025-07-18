<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ pageTitle }}</h1>
        <p class="text-gray-600">Manage and track all development properties</p>
      </div>
      <button 
        @click="goBack"
        class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Back to Dashboard</span>
      </button>
    </div>
    
    <!-- Search and Filter -->
    <div class="glass-effect rounded-2xl p-6 shadow-lg">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            v-model="propertiesStore.searchTerm"
            type="text" 
            placeholder="Search by address, APN, or city..." 
            class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
          >
        </div>
        <div class="relative">
          <i class="fas fa-filter absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <select 
            v-model="propertiesStore.selectedPhase"
            class="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white/80 min-w-[200px]"
          >
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
    
    <!-- Properties Count -->
    <div v-if="displayedProperties.length > 0" class="text-sm text-gray-600">
      Showing {{ displayedProperties.length }} of {{ propertiesStore.totalProperties }} properties
    </div>
    
    <!-- No Properties Message -->
    <div v-if="displayedProperties.length === 0" class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fas fa-search text-3xl text-gray-400"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
      <p class="text-gray-600">
        {{ propertiesStore.totalProperties === 0 
          ? 'Upload CSV files to get started' 
          : 'Try adjusting your search or filter criteria' 
        }}
      </p>
    </div>
    
    <!-- Properties Grid -->
    <div v-if="displayedProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PropertyCard 
        v-for="property in displayedProperties" 
        :key="property.id" 
        :property="property" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const propertiesStore = usePropertiesStore()

// Set page metadata
useHead({
  title: 'Properties - DJ DJ LLC Property Management'
})

const pageTitle = computed(() => {
  const category = route.query.category as string
  if (category === 'construction') return 'In Construction Properties'
  if (category === 'completed') return 'Completed Properties'
  if (category === 'upcoming') return 'Upcoming Properties'
  return 'All Properties'
})

const displayedProperties = computed(() => {
  const category = route.query.category as string
  
  if (category === 'construction') {
    return propertiesStore.constructionProperties.filter(property => {
      const matchesSearch = !propertiesStore.searchTerm || 
        property.address.toLowerCase().includes(propertiesStore.searchTerm.toLowerCase()) ||
        property.apn.includes(propertiesStore.searchTerm) ||
        property.city.toLowerCase().includes(propertiesStore.searchTerm.toLowerCase())
      
      const matchesPhase = !propertiesStore.selectedPhase || property.phase === propertiesStore.selectedPhase
      
      return matchesSearch && matchesPhase
    })
  }
  
  if (category === 'completed') {
    return propertiesStore.completedProperties.filter(property => {
      const matchesSearch = !propertiesStore.searchTerm || 
        property.address.toLowerCase().includes(propertiesStore.searchTerm.toLowerCase()) ||
        property.apn.includes(propertiesStore.searchTerm) ||
        property.city.toLowerCase().includes(propertiesStore.searchTerm.toLowerCase())
      
      const matchesPhase = !propertiesStore.selectedPhase || property.phase === propertiesStore.selectedPhase
      
      return matchesSearch && matchesPhase
    })
  }
  
  if (category === 'upcoming') {
    return propertiesStore.upcomingProperties.filter(property => {
      const matchesSearch = !propertiesStore.searchTerm || 
        property.address.toLowerCase().includes(propertiesStore.searchTerm.toLowerCase()) ||
        property.apn.includes(propertiesStore.searchTerm) ||
        property.city.toLowerCase().includes(propertiesStore.searchTerm.toLowerCase())
      
      const matchesPhase = !propertiesStore.selectedPhase || property.phase === propertiesStore.selectedPhase
      
      return matchesSearch && matchesPhase
    })
  }
  
  return propertiesStore.filteredProperties
})

const goBack = () => {
  router.push('/')
}

// Set current view when component mounts
onMounted(() => {
  propertiesStore.setCurrentView('list')
})

// Clear search and filter when leaving the page
onUnmounted(() => {
  propertiesStore.setSearchTerm('')
  propertiesStore.setSelectedPhase('')
})
</script>