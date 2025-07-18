<template>
  <div class="glass-effect rounded-2xl p-8 shadow-xl">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Recent Activity</h2>
      <div class="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
        <i class="fas fa-clock text-blue-600"></i>
      </div>
    </div>
    <div class="space-y-6">
      <ActivityItem
        v-for="activity in recentActivities"
        :key="activity.id"
        :activity="activity"
      />
      <div v-if="recentActivities.length === 0" class="text-center py-8">
        <i class="fas fa-info-circle text-3xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">No recent activity to display</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Activity {
  id: string
  property: string
  message: string
  phase: string
  color: string
}

const propertiesStore = usePropertiesStore()

const recentActivities = computed(() => {
  // Generate activity based on recent property updates
  const activities: Activity[] = []
  
  // Get recently completed properties
  const completedProperties = propertiesStore.completedProperties.slice(0, 2)
  completedProperties.forEach(property => {
    if (property.phase === 'Sold') {
      activities.push({
        id: `${property.id}-sold`,
        property: property.address,
        message: 'Successfully sold - Project completed',
        phase: 'Sold',
        color: 'green'
      })
    } else if (property.phase === 'Listed') {
      activities.push({
        id: `${property.id}-listed`,
        property: property.address,
        message: 'Listed for sale - Ready for market',
        phase: 'Listed',
        color: 'blue'
      })
    }
  })
  
  // Get construction properties
  const constructionProperties = propertiesStore.constructionProperties.slice(0, 2)
  constructionProperties.forEach(property => {
    activities.push({
      id: `${property.id}-construction`,
      property: property.address,
      message: `Advanced to ${property.phase} phase`,
      phase: property.phase,
      color: getPhaseColor(property.phase)
    })
  })
  
  // Get upcoming properties
  const upcomingProperties = propertiesStore.upcomingProperties.slice(0, 1)
  upcomingProperties.forEach(property => {
    activities.push({
      id: `${property.id}-upcoming`,
      property: property.address,
      message: 'Entered design phase - Permits pending',
      phase: 'Design',
      color: 'purple'
    })
  })
  
  // Add system update if we have data
  if (propertiesStore.totalProperties > 0) {
    activities.push({
      id: 'system-update',
      property: 'System Update',
      message: 'Property data successfully loaded and synchronized',
      phase: 'Update',
      color: 'yellow'
    })
  }
  
  return activities.slice(0, 4) // Limit to 4 activities
})

const getPhaseColor = (phase: string) => {
  const colors = {
    'Sheetrock': 'blue',
    'Flatwork': 'gray',
    'Roof': 'teal',
    'Final': 'green',
    'Design': 'purple',
    'Sold': 'green',
    'Listed': 'green',
    'Pending': 'blue'
  }
  return colors[phase as keyof typeof colors] || 'gray'
}
</script>