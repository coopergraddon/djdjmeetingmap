<template>
  <header class="gradient-bg shadow-lg relative overflow-hidden">
    <div class="absolute inset-0 hero-pattern opacity-50"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-3">
            <!-- DJ DJ LLC Logo -->
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI0MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMCAxNjBMMTIwIDBMMjQwIDE2MEgxODBMMTIwIDgwTDYwIDE2MEgxMjBWMTIwSDIwMFYxNjBIMTYwVjEyMEgxMjBWMTYwSDYwTDEyMCA4MEwxODAgMTYwSDE0MEwxMjAgMTIwTDEwMCAxNjBIMFoiIGZpbGw9IiMxZTRkNGIiLz4KPC9zdmc+" 
                   alt="DJ DJ LLC Logo" 
                   class="w-full h-full object-contain">
            </div>
            <div>
              <div class="text-2xl font-bold text-white">DJ DJ LLC</div>
              <div class="text-sm text-green-100">Property Management</div>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <i class="fas fa-link text-green-100"></i>
            <span class="text-sm text-green-100 font-medium">ArcGIS Integrated System</span>
          </div>
        </div>
        <nav class="flex space-x-8">
          <NuxtLink to="/" class="nav-link text-white hover:text-green-100 font-medium py-2">
            <i class="fas fa-chart-pie mr-2"></i>Dashboard
          </NuxtLink>
          <button @click="showAll" class="nav-link text-white hover:text-green-100 font-medium py-2">
            <i class="fas fa-list mr-2"></i>All Properties
          </button>
          <button @click="showConstruction" class="nav-link text-white hover:text-green-100 font-medium py-2">
            <i class="fas fa-hard-hat mr-2"></i>In Construction
          </button>
          <button @click="showCompleted" class="nav-link text-white hover:text-green-100 font-medium py-2">
            <i class="fas fa-check-circle mr-2"></i>Completed
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useProperties } from '~/composables/useProperties';

const { showPropertiesByCategory, showAllProperties } = useProperties();

const showAll = () => {
  showAllProperties();
  navigateTo('/?view=list');
};

const showConstruction = () => {
  showPropertiesByCategory('Construction');
  navigateTo('/?view=list');
};

const showCompleted = () => {
  showPropertiesByCategory('Completed');
  navigateTo('/?view=list');
};
</script> 