<template>
  <div v-if="property" class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ property.address }}</h1>
        <p class="text-gray-600">Comprehensive property information and project status</p>
      </div>
      <button 
        @click="goBack"
        class="btn-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Back</span>
      </button>
    </div>
    
    <div class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Property Information -->
        <div class="glass-effect rounded-2xl p-8 shadow-lg">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
              <i class="fas fa-info-circle text-blue-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Property Information</h3>
          </div>
          <div class="space-y-4">
            <PropertyDetailRow label="Address" :value="property.address" icon="fas fa-map-marker-alt" />
            <PropertyDetailRow label="APN/Geo ID" :value="property.apn" icon="fas fa-id-card" mono />
            <PropertyDetailRow label="Phase" :value="property.phase" icon="fas fa-cog">
              <template #value>
                <span :class="getPhaseColorClass(property.phase)" class="px-3 py-1 text-sm font-semibold rounded-lg">
                  {{ property.phase }}
                </span>
              </template>
            </PropertyDetailRow>
            <PropertyDetailRow label="Property Type" :value="property.type" icon="fas fa-building" />
            <PropertyDetailRow label="City" :value="property.city" icon="fas fa-city" />
            <PropertyDetailRow v-if="property.sqft" label="Square Feet" :value="property.sqft" icon="fas fa-ruler-combined" />
            <PropertyDetailRow v-if="property.permit" label="Permit #" :value="property.permit" icon="fas fa-file-alt" />
          </div>
        </div>
        
        <!-- Project Timeline -->
        <div class="glass-effect rounded-2xl p-8 shadow-lg">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200">
              <i class="fas fa-calendar-alt text-green-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Project Timeline</h3>
          </div>
          <div class="space-y-4">
            <PropertyDetailRow v-if="property.permitSubmitted" label="Permit Submitted" :value="property.permitSubmitted" icon="fas fa-file-upload" />
            <PropertyDetailRow v-if="property.permitIssued" label="Permit Issued" :value="property.permitIssued" icon="fas fa-file-check" />
            <PropertyDetailRow v-if="property.startDate" label="Start Date" :value="property.startDate" icon="fas fa-play" />
            <PropertyDetailRow v-if="property.deadline" label="Target Completion" :value="property.deadline" icon="fas fa-flag-checkered" />
            <PropertyDetailRow v-if="property.completed" label="Completed" :value="property.completed" icon="fas fa-check-circle" />
            <PropertyDetailRow v-if="property.client" label="Client" :value="property.client" icon="fas fa-user" />
          </div>
        </div>

        <!-- Timeline & Finance -->
        <div class="glass-effect rounded-2xl p-8 shadow-lg">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-3 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200">
              <i class="fas fa-clock text-yellow-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Timeline & Finance</h3>
          </div>
          <div class="space-y-4">
            <PropertyDetailRow v-if="property.daysToComplete" label="Current Length" :value="`${property.daysToComplete} days`" icon="fas fa-calendar-day" highlight />
            <PropertyDetailRow v-if="property.estimatedDaysToComplete" label="Est. Days to Complete" :value="`${property.estimatedDaysToComplete} days`" icon="fas fa-clock" />
            <PropertyDetailRow v-if="property.financialInstitution" label="Financial Institution" :value="property.financialInstitution" icon="fas fa-university" />
          </div>
        </div>
      </div>
      
      <!-- Project Notes & Status -->
      <div class="glass-effect rounded-2xl p-8 shadow-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
            <i class="fas fa-sticky-note text-purple-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Project Notes & Status</h3>
        </div>
        <div class="bg-gray-50 rounded-xl p-6">
          <p class="text-gray-700 leading-relaxed mb-4">{{ property.notes || 'No additional notes available.' }}</p>
          <div class="flex items-center space-x-3">
            <span class="text-gray-600 font-medium">Category:</span>
            <span class="inline-block px-4 py-2 text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg">{{ property.category }}</span>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="glass-effect rounded-2xl p-8 shadow-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200">
            <i class="fas fa-cogs text-indigo-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Actions</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            @click="viewOnMap"
            class="btn-primary text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
          >
            <i class="fas fa-map-marked-alt text-lg"></i>
            <span>View on Map</span>
          </button>
          <button 
            @click="goToDashboard"
            class="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
          >
            <i class="fas fa-tachometer-alt text-lg"></i>
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Property Not Found -->
  <div v-else class="text-center py-12">
    <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <i class="fas fa-exclamation-triangle text-3xl text-gray-400"></i>
    </div>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">Property not found</h3>
    <p class="text-gray-600 mb-6">The requested property could not be found.</p>
    <button 
      @click="goBack"
      class="btn-primary text-white px-6 py-3 rounded-xl font-semibold"
    >
      Go Back
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const propertiesStore = usePropertiesStore()
const config = useRuntimeConfig()

const propertyId = route.params.id as string
const property = computed(() => propertiesStore.getPropertyById(propertyId))

// Set page metadata
useHead({
  title: computed(() => property.value ? `${property.value.address} - Property Details` : 'Property Not Found'),
})

const getPhaseColorClass = (phase: string) => {
  const colors = {
    'Sheetrock': 'phase-sheetrock',
    'Flatwork': 'phase-flatwork',
    'Roof': 'phase-roof',
    'Final': 'phase-final',
    'Design': 'phase-design',
    'Sold': 'phase-sold',
    'Listed': 'phase-listed',
    'Pending': 'phase-pending',
    'Delete': 'phase-delete',
    'Unknown': 'phase-unknown'
  }
  return colors[phase as keyof typeof colors] || 'phase-unknown'
}

const viewOnMap = () => {
  if (!property.value) return
  const url = `${config.public.arcgisExperienceUrl}#data_s=where:${config.public.dataSourceId}:geo_id='${property.value.apn}'&zoom_to_selection=true`
  window.open(url, '_blank')
}

const goBack = () => {
  router.back()
}

const goToDashboard = () => {
  router.push('/')
}

// Set current view and selected property when component mounts
onMounted(() => {
  propertiesStore.setCurrentView('detail')
  if (property.value) {
    propertiesStore.setSelectedProperty(property.value)
  }
})
</script>