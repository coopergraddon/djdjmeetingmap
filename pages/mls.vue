<template>
  <div class="bg-gray-50 min-h-screen">
    <AppHeader 
      @show-all="goToAllProperties"
      @show-construction="goToConstruction"
      @show-completed="goToCompleted"
      @click-dashboard="goToDashboard"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Redirect Message -->
      <div class="text-center py-12">
        <div class="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto shadow-lg">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
            <i class="fas fa-external-link-alt text-3xl text-white"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">MLS Properties</h1>
          <p class="text-gray-600 mb-6">
            MLS properties are now available on our external search platform.
          </p>
          <div class="space-y-4">
            <a 
              href="https://onesearch.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i class="fas fa-external-link-alt"></i>
              <span>Go to MLS Search</span>
            </a>
            <div class="pt-4">
              <NuxtLink 
                to="/" 
                class="inline-flex items-center space-x-3 bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                <i class="fas fa-arrow-left"></i>
                <span>Back to Dashboard</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Navigation functions
const goToDashboard = () => {
  router.push('/');
};

const goToAllProperties = () => {
  router.push('/?view=list');
};

const goToConstruction = () => {
  router.push('/?view=list');
};

const goToCompleted = () => {
  router.push('/?view=list');
};
</script> 