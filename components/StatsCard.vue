<template>
  <div 
    class="stats-card card-hover rounded-2xl p-8 text-center cursor-pointer"
    @click="$emit('click')"
  >
    <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
         :class="gradientClass">
      <i :class="[icon, 'text-2xl text-white']"></i>
    </div>
    <div class="text-3xl font-bold text-gray-900 mb-2">{{ value }}</div>
    <div class="text-gray-600 font-medium">{{ title }}</div>
    <div class="mt-2 text-sm" :class="subtitleColorClass">{{ subtitle }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  subtitle: string
  icon: string
  color: 'green' | 'blue' | 'purple' | 'yellow' | 'red'
}

const props = defineProps<Props>()
defineEmits<{
  click: []
}>()

const gradientClass = computed(() => {
  const classes = {
    green: 'gradient-bg',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    red: 'bg-gradient-to-br from-red-500 to-red-600'
  }
  return classes[props.color]
})

const subtitleColorClass = computed(() => {
  const classes = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  }
  return classes[props.color]
})
</script>