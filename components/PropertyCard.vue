<template>
  <div class="property-card glass-effect rounded-2xl overflow-hidden shadow-lg">
    <div class="p-6">
      <div class="flex justify-between items-start mb-6">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ property.address }}</h3>
          <div v-if="property.lot" class="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <i class="fas fa-th-large"></i>
            <span>Lot #{{ property.lot }}</span>
          </div>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ property.city }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end space-y-2">
          <span :class="['px-3 py-2 text-sm font-semibold rounded-xl flex items-center space-x-2', getPhaseColor(property.phase)]">
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
        <NuxtLink :to="`/property/${property.apn}`" class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2" @click.native="cacheSearchState">
          <i class="fas fa-info-circle"></i>
          <span>Details</span>
        </NuxtLink>
        <button @click="$emit('view-arcgis')" class="flex-1 btn-primary text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
          <i class="fas fa-map-marked-alt"></i>
          <span>Map</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProperties } from '~/composables/useProperties';

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['view-arcgis']);

const { getPhaseColor, getPhaseIcon, searchTerm, searchField, selectedPhase, completionFrom, completionTo } = useProperties();

function cacheSearchState() {
  const state = {
    searchTerm: searchTerm.value,
    searchField: searchField.value,
    selectedPhase: selectedPhase.value,
    completionFrom: completionFrom.value,
    completionTo: completionTo.value
  };
  sessionStorage.setItem('propertySearchState', JSON.stringify(state));
}
</script> 