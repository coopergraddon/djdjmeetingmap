<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Debug Page</h1>
    <div class="space-y-4">
      <div>
        <strong>Loading:</strong> {{ isLoading }}
      </div>
      <div>
        <strong>Error:</strong> {{ error }}
      </div>
      <div>
        <strong>Properties Count:</strong> {{ allProperties.length }}
      </div>
      <div>
        <strong>First 5 APNs:</strong> {{ allProperties.slice(0, 5).map(p => p.apn).join(', ') }}
      </div>
      <button @click="fetchProperties" class="bg-blue-500 text-white px-4 py-2 rounded">
        Fetch Properties
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProperties } from '~/composables/useProperties';

const { allProperties, isLoading, error, fetchProperties } = useProperties();

onMounted(async () => {
  await fetchProperties();
});
</script> 