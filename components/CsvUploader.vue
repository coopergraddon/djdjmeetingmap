<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <div class="text-center mb-6">
      <i class="fas fa-upload text-3xl text-blue-500 mb-3"></i>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Upload Your Own CSV</h3>
      <p class="text-gray-600">If the default data fails to load, you can upload your own CSV file</p>
    </div>

    <div class="space-y-4">
      <!-- File Upload Area -->
      <div 
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleFileDrop"
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
      >
        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
        <p class="text-lg font-medium text-gray-700 mb-2">
          {{ isDragOver ? 'Drop your CSV file here' : 'Click to upload or drag and drop' }}
        </p>
        <p class="text-sm text-gray-500">Supports .csv files</p>
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileSelect"
          class="hidden"
        />
      </div>

      <!-- Selected File Info -->
      <div v-if="selectedFile" class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <i class="fas fa-file-csv text-green-500"></i>
            <div>
              <p class="font-medium text-green-800">{{ selectedFile.name }}</p>
              <p class="text-sm text-green-600">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
          <button @click="removeFile" class="text-red-500 hover:text-red-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Upload Button -->
      <button
        v-if="selectedFile"
        @click="uploadFile"
        :disabled="isUploading"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <i v-if="isUploading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-upload"></i>
        <span>{{ isUploading ? 'Uploading...' : 'Upload CSV' }}</span>
      </button>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center space-x-2">
          <i class="fas fa-exclamation-triangle text-red-500"></i>
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center space-x-2">
          <i class="fas fa-check-circle text-green-500"></i>
          <p class="text-green-700">{{ success }}</p>
        </div>
      </div>

      <!-- CSV Format Instructions -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 mb-2">Expected CSV Format:</h4>
        <div class="text-sm text-gray-600 space-y-1">
          <p>Required columns: <strong>Address</strong>, <strong>APN</strong>, <strong>Phase</strong></p>
          <p>Optional columns: City, Client, Notes, Permit Submitted, etc.</p>
          <p class="text-xs text-gray-500 mt-2">
            <i class="fas fa-info-circle mr-1"></i>
            The first row should contain column headers
          </p>
          <div class="mt-3 pt-3 border-t border-gray-200">
            <a 
              href="/property-template.csv" 
              download
              class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <i class="fas fa-download"></i>
              <span>Download CSV Template</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['data-loaded']);

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragOver = ref(false);
const isUploading = ref(false);
const error = ref('');
const success = ref('');

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleFileDrop = (event) => {
  isDragOver.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  error.value = '';
  success.value = '';
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    error.value = 'Please select a CSV file';
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    error.value = 'File size must be less than 10MB';
    return;
  }
  
  selectedFile.value = file;
};

const removeFile = () => {
  selectedFile.value = null;
  error.value = '';
  success.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const uploadFile = async () => {
  if (!selectedFile.value) return;
  
  isUploading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    const formData = new FormData();
    formData.append('csv', selectedFile.value);
    
    const response = await $fetch('/api/upload-csv', {
      method: 'POST',
      body: formData
    });
    
    if (response.success) {
      success.value = `Successfully loaded ${response.properties.length} properties`;
      emit('data-loaded', response.properties);
    } else {
      error.value = response.error || 'Failed to process CSV file';
    }
  } catch (err) {
    console.error('Upload error:', err);
    error.value = 'Failed to upload file. Please try again.';
  } finally {
    isUploading.value = false;
  }
};
</script> 