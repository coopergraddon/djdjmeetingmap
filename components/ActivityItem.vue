<template>
  <div class="flex items-center space-x-4 p-4 rounded-xl border" :class="backgroundClass">
    <div class="w-3 h-3 rounded-full animate-pulse" :class="dotColorClass"></div>
    <div class="flex-1">
      <div class="font-medium text-gray-900">{{ activity.property }}</div>
      <div class="text-sm text-gray-600">{{ activity.message }}</div>
    </div>
    <span class="text-xs px-2 py-1 rounded-full font-medium" :class="badgeClass">
      {{ activity.phase }}
    </span>
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

interface Props {
  activity: Activity
}

const props = defineProps<Props>()

const backgroundClass = computed(() => {
  const classes = {
    green: 'bg-green-50 border-green-100',
    blue: 'bg-blue-50 border-blue-100',
    purple: 'bg-purple-50 border-purple-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    gray: 'bg-gray-50 border-gray-100',
    teal: 'bg-teal-50 border-teal-100'
  }
  return classes[props.activity.color as keyof typeof classes] || 'bg-gray-50 border-gray-100'
})

const dotColorClass = computed(() => {
  const classes = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
    teal: 'bg-teal-500'
  }
  return classes[props.activity.color as keyof typeof classes] || 'bg-gray-500'
})

const badgeClass = computed(() => {
  const classes = {
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    gray: 'text-gray-600 bg-gray-100',
    teal: 'text-teal-600 bg-teal-100'
  }
  return classes[props.activity.color as keyof typeof classes] || 'text-gray-600 bg-gray-100'
})
</script>