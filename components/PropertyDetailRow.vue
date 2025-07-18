<template>
  <div class="flex justify-between items-center p-3 rounded-lg bg-gray-50" :class="{ 'p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500': highlight }">
    <span class="text-gray-600 font-medium flex items-center space-x-2" :class="{ 'text-blue-700 font-semibold': highlight }">
      <i :class="[icon, 'text-sm', highlight ? 'text-lg' : '']"></i>
      <span>{{ label }}:</span>
    </span>
    <span v-if="!$slots.value" class="font-bold text-gray-900" :class="{ 'font-mono': mono, 'text-blue-900 text-lg': highlight }">
      {{ value }}
    </span>
    <div v-else>
      <slot name="value" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value?: string
  icon: string
  mono?: boolean
  highlight?: boolean
}

defineProps<Props>()
defineSlots<{
  value?: {}
}>()
</script>