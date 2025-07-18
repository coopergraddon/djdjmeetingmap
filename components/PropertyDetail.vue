<template>
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
          <div v-if="property.address" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Address:</span>
            <span class="font-bold text-gray-900">{{ property.address }}</span>
          </div>
          <div v-if="property.apn" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">APN/Geo ID:</span>
            <span class="font-mono font-bold text-gray-900">{{ property.apn }}</span>
          </div>
          <div v-if="property.phase" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Phase:</span>
            <span :class="['px-3 py-1 text-sm font-semibold rounded-lg', getPhaseColor(property.phase)]">{{ property.phase }}</span>
          </div>
          <div v-if="property.type" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Property Type:</span>
            <span class="font-bold text-gray-900">{{ property.type }}</span>
          </div>
          <div v-if="property.city" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">City:</span>
            <span class="font-bold text-gray-900">{{ property.city }}</span>
          </div>
          <div v-if="property.sqft" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Square Feet:</span>
            <span class="font-bold text-gray-900">{{ property.sqft }}</span>
          </div>
          <div v-if="property.permit" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Permit #:</span>
            <span class="font-bold text-gray-900">{{ property.permit }}</span>
          </div>
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
          <div v-if="property.permitSubmitted" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Permit Submitted:</span>
            <span class="font-bold text-gray-900">{{ property.permitSubmitted }}</span>
          </div>
          <div v-if="property.permitIssued" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Permit Issued:</span>
            <span class="font-bold text-gray-900">{{ property.permitIssued }}</span>
          </div>
          <div v-if="property.startDate" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Start Date:</span>
            <span class="font-bold text-gray-900">{{ property.startDate }}</span>
          </div>
          <div v-if="property.deadline" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Target Completion:</span>
            <span class="font-bold text-gray-900">{{ property.deadline }}</span>
          </div>
          <div v-if="property.completed && isValidCompletedDate(property.completed)" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Completed:</span>
            <span class="font-bold text-gray-900">{{ property.completed }}</span>
          </div>
          <div v-if="property.client" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Client:</span>
            <span class="font-bold text-gray-900">{{ property.client }}</span>
          </div>
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
          <div v-if="property.daysToComplete" class="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
            <span class="text-blue-700 font-semibold flex items-center space-x-2">
              <i class="fas fa-calendar-day text-lg"></i>
              <span>Current Length:</span>
            </span>
            <span class="font-bold text-blue-900 text-lg">{{ property.daysToComplete }} days</span>
          </div>
          <div v-if="property.estimatedDaysToComplete" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Est. Days to Complete:</span>
            <span class="font-bold text-gray-900">{{ property.estimatedDaysToComplete }} days</span>
          </div>
          <div v-if="property.financialInstitution" class="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <span class="text-gray-600 font-medium">Financial Institution:</span>
            <span class="font-bold text-gray-900">{{ property.financialInstitution }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Current Project Duration -->
    <div class="glass-effect rounded-2xl p-8 shadow-lg">
      <div class="flex items-center space-x-3 mb-6">
        <div class="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200">
          <i class="fas fa-hourglass-half text-orange-600"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900">Current Project Duration</h3>
      </div>
      <div class="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
        <span class="text-gray-600 font-medium">Days since start:</span>
        <span class="font-bold text-gray-900 text-lg">
          {{ projectDurationDays !== null ? projectDurationDays + ' days' : '—' }}
        </span>
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
        <button @click="handleViewArcGIS(property.apn)" class="btn-primary text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3">
          <i class="fas fa-map-marked-alt text-lg"></i>
          <span>View on Map</span>
        </button>
        <button @click="handleViewDashboard()" class="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3">
          <i class="fas fa-tachometer-alt text-lg"></i>
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProperties } from '~/composables/useProperties';
import { computed } from 'vue';

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
});

const { getPhaseColor, handleViewArcGIS } = useProperties();

const handleViewDashboard = () => {
  // Navigate to dashboard
  navigateTo('/');
};

const projectDurationDays = computed(() => {
  if (!props.property.startDate) return null;
  const start = new Date(props.property.startDate);
  if (isNaN(start)) return null;
  const today = new Date();
  const diff = today - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

function isValidCompletedDate(dateStr) {
  if (!dateStr) return false;
  const year = Number(dateStr.split(/[\/-]/)[2]);
  return year && year >= 2000;
}
</script> 