import { defineNuxtConfig } from "nuxt/config";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@/assets/css/app.css",
    "@/assets/css/icons.min.css",
  ],
  plugins: [{ src: "~/plugins/bootstrap.client.ts", mode: "client" }],
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:8000",
    },
  },
  app: {
    head: {
      title: "МТА - НТГ",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  vite: {
    optimizeDeps: {
      include: ["vue3-apexcharts"],
    },
  },
  build: {
    transpile: ["vue3-apexcharts"],
  },
  nitro: {
    compatibilityDate: "2025-06-04",
  },
});
