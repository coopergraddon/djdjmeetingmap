<template>
  <div class="property-card glass-effect rounded-2xl overflow-hidden shadow-lg">
    <div class="p-6">
      <div class="flex justify-between items-start mb-6">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ property.address }}</h3>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ property.city }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end space-y-2">
          <span :class="getPhaseColorClass(property.phase)" class="px-3 py-2 text-sm font-semibold rounded-xl flex items-center space-x-2">
            <i :class="getPhaseIcon(property.phase)"></i>
            <span>{{ property.phase }}</span>
          </span>
        </div>
      </div>
      
      <div class="space-y-3 mb-6">
        <div class="flex justify-between items-center">
          <span class="text-gray-600 flex items-center space-x-2">
            <i class="fas fa-id-card text-sm"></i>
            <span>APN:</span>
          </span>
          <span class="font-mono text-sm font-medium">{{ property.apn }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600 flex items-center space-x-2">
            <i class="fas fa-building text-sm"></i>
            <span>Type:</span>
          </span>
          <span class="font-medium">{{ property.type }}</span>
        </div>
        <div v-if="property.permit" class="flex justify-between items-center">
          <span class="text-gray-600 flex items-center space-x-2">
            <i class="fas fa-file-alt text-sm"></i>
            <span>Permit:</span>
          </span>
          <span class="font-medium">{{ property.permit }}</span>
        </div>
        <div v-if="property.sqft" class="flex justify-between items-center">
          <span class="text-gray-600 flex items-center space-x-2">
            <i class="fas fa-ruler-combined text-sm"></i>
            <span>Sq Ft:</span>
          </span>
          <span class="font-medium">{{ property.sqft }}</span>
        </div>
      </div>
      
      <div class="flex gap-3">
        <button 
          @click="viewDetails"
          class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <i class="fas fa-info-circle"></i>
          <span>Details</span>
        </button>
        <button 
          @click="viewOnMap"
          class="flex-1 btn-primary text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <i class="fas fa-map-marked-alt"></i>
          <span>Map</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Property } from '~/stores/properties'

interface Props {
  property: Property
}

const props = defineProps<Props>()
const router = useRouter()
const config = useRuntimeConfig()
const propertiesStore = usePropertiesStore()

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

const getPhaseIcon = (phase: string) => {
  const icons = {
    'Sheetrock': 'fas fa-paint-roller',
    'Flatwork': 'fas fa-hammer',
    'Roof': 'fas fa-home',
    'Final': 'fas fa-check-circle',
    'Design': 'fas fa-drafting-compass',
    'Sold': 'fas fa-dollar-sign',
    'Listed': 'fas fa-tag',
    'Pending': 'fas fa-clock',
    'Delete': 'fas fa-trash'
  }
  return icons[phase as keyof typeof icons] || 'fas fa-info'
}

const viewDetails = () => {
  propertiesStore.setSelectedProperty(props.property)
  propertiesStore.setCurrentView('detail')
  router.push(`/properties/${props.property.id}`)
}

const viewOnMap = () => {
  const url = `${config.public.arcgisExperienceUrl}#data_s=where:${config.public.dataSourceId}:geo_id='${props.property.apn}'&zoom_to_selection=true`
  window.open(url, '_blank')
}
</script>