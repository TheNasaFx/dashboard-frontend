import { defineNuxtConfig } from "nuxt/config";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: true,
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: [
    "~/assets/css/bootstrap.min.css",
    "~/assets/css/icons.min.css",
    "~/assets/css/app.css",
  ],
  vite: {
    optimizeDeps: {
      include: ["vue3-apexcharts"],
    },
  },
});
