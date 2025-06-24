import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
  const token = process.client ? localStorage.getItem('token') : null
  if (!token && to.path !== '/login') {
    return navigateTo('/login')
  }
});
