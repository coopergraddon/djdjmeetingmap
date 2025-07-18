<template>
  <div class="glass-effect rounded-2xl p-8 shadow-xl mb-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">CSV Data Management</h2>
      <div class="p-3 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200">
        <i class="fas fa-upload text-indigo-600"></i>
      </div>
    </div>
    
    <!-- File Upload Area -->
    <div 
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors duration-300"
      :class="{ 'border-green-500 bg-green-50': isDragging }"
    >
      <div class="space-y-4">
        <div class="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
          <i class="fas fa-file-csv text-2xl text-green-600"></i>
        </div>
        <div>
          <p class="text-lg font-semibold text-gray-900 mb-2">Upload CSV Files</p>
          <p class="text-gray-600 mb-4">Drag and drop your CSV files here, or click to select</p>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept=".csv"
            @change="handleFileSelect"
            class="hidden"
          >
          <button
            @click="$refs.fileInput.click()"
            class="btn-primary text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2"
          >
            <i class="fas fa-plus"></i>
            <span>Select CSV Files</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="propertiesStore.loading" class="mt-6 text-center">
      <div class="inline-flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        <span class="text-gray-600">Loading CSV data...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="propertiesStore.error" class="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
      <div class="flex items-center space-x-3">
        <i class="fas fa-exclamation-triangle text-red-500"></i>
        <div>
          <p class="font-semibold text-red-800">Error loading CSV files</p>
          <p class="text-red-600 text-sm">{{ propertiesStore.error }}</p>
        </div>
      </div>
    </div>

    <!-- Success State -->
    <div v-if="uploadSuccess" class="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
      <div class="flex items-center space-x-3">
        <i class="fas fa-check-circle text-green-500"></i>
        <div>
          <p class="font-semibold text-green-800">CSV files loaded successfully</p>
          <p class="text-green-600 text-sm">{{ propertiesStore.totalProperties }} properties imported</p>
        </div>
      </div>
    </div>

    <!-- Sample Data Button -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold text-gray-900">No CSV files to upload?</p>
          <p class="text-gray-600 text-sm">Load sample data to see the system in action</p>
        </div>
        <button
          @click="loadSampleData"
          class="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
        >
          <i class="fas fa-database"></i>
          <span>Load Sample Data</span>
        </button>
      </div>
    </div>

    <!-- Current Data Info -->
    <div v-if="propertiesStore.totalProperties > 0" class="mt-6 pt-6 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ propertiesStore.stats.total }}</div>
          <div class="text-sm text-gray-600">Total Properties</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ propertiesStore.stats.construction }}</div>
          <div class="text-sm text-gray-600">In Construction</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ propertiesStore.stats.upcoming }}</div>
          <div class="text-sm text-gray-600">Upcoming</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ propertiesStore.stats.completed }}</div>
          <div class="text-sm text-gray-600">Completed</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const propertiesStore = usePropertiesStore()
const isDragging = ref(false)
const uploadSuccess = ref(false)

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = Array.from(event.dataTransfer?.files || []).filter(file => 
    file.type === 'text/csv' || file.name.endsWith('.csv')
  )
  
  if (files.length > 0) {
    uploadFiles(files)
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  if (files.length > 0) {
    uploadFiles(files)
  }
}

const uploadFiles = async (files: File[]) => {
  uploadSuccess.value = false
  await propertiesStore.loadPropertiesFromCSV(files)
  
  if (!propertiesStore.error) {
    uploadSuccess.value = true
    setTimeout(() => {
      uploadSuccess.value = false
    }, 5000)
  }
}

const loadSampleData = () => {
  uploadSuccess.value = false
  propertiesStore.loadSampleData()
  uploadSuccess.value = true
  setTimeout(() => {
    uploadSuccess.value = false
  }, 3000)
}

onMounted(() => {
  // Add drag and drop listeners to prevent default browser behavior
  document.addEventListener('dragover', (e) => e.preventDefault())
  document.addEventListener('drop', (e) => e.preventDefault())
})
</script>