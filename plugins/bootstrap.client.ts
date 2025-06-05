// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: module has no type definitions
import { defineNuxtPlugin } from "nuxt/app";

declare global {
  interface Window {
    bootstrap: any;
  }
}

export default defineNuxtPlugin(() => {
  if (process.client) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: module has no type definitions
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then(() => {
      window.addEventListener("DOMContentLoaded", () => {
        const dropdownTriggerList = [].slice.call(
          document.querySelectorAll('[data-bs-toggle="dropdown"]')
        );
        dropdownTriggerList.forEach(function (dropdownTriggerEl) {
          // eslint-disable-next-line no-undef
          new window.bootstrap.Dropdown(dropdownTriggerEl);
        });
      });
    });
  }
});
