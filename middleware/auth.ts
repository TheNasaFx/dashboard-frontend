import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
  const token = localStorage.getItem('token')
  console.log('Auth middleware - Token:', token ? 'exists' : 'not found', 'Path:', to.path)
  
  if (!token && to.path !== '/login' && to.path !== '/setup-2fa' && to.path !== '/') {
    console.log('Redirecting to login from:', to.path)
    return navigateTo('/login')
  }
});
