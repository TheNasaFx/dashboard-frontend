import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  if (process.client) {
    import("@/assets/js/app.js");
    import("@/assets/js/baatars.js");
    import("@/assets/js/DynamicSelect.js");
    import("@/assets/js/moment.js");
    // Add more if needed
  }
});
