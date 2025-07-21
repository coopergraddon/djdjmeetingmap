<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="glass-effect rounded-2xl p-8 shadow-xl w-full max-w-md">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Login</h1>
        <p class="text-gray-600">Enter your password to access the dashboard</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Password</label>
          <input v-model="password" type="password" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80" required />
        </div>
        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
        <button type="submit" class="btn-primary w-full py-3 rounded-xl font-semibold text-white">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  try {
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: { password: password.value }
    });
    if (res.success) {
      // Set cookie and redirect
      document.cookie = `auth=1; path=/;`;
      window.location.href = '/';
    } else {
      error.value = 'Incorrect password.';
    }
  } catch (e) {
    error.value = 'Login failed.';
  }
};
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(90deg, #059669 0%, #2563EB 100%);
  transition: background 0.2s;
}
.btn-primary:hover {
  background: linear-gradient(90deg, #2563EB 0%, #059669 100%);
}
.glass-effect {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
}
</style> 