export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/login') return;
  const auth = useCookie('auth');
  if (!auth.value) {
    return navigateTo('/login');
  }
}); 