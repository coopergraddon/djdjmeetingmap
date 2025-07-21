export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return; // Only run on client
  if (to.path === '/login') return;
  const auth = useCookie('auth');
  if (!auth.value) {
    return navigateTo('/login');
  }
}); 