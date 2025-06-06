import { defineNuxtPlugin } from "#app";
import "bootstrap";
import { createIcons, icons } from "lucide";
import { useSidebar } from "~/composables/useSidebar";
import { useTheme } from "~/composables/useTheme";
import { useVerticalMenu } from "~/composables/useVerticalMenu";

declare global {
  interface Window {
    bootstrap: {
      Tooltip: any;
      Popover: any;
      Collapse: any;
    };
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    // Initialize composables
    useSidebar();
    useTheme();
    useVerticalMenu();

    // Dropdown stop
    const dropdownMenus = document.querySelectorAll(".dropdown-menu.stop");
    dropdownMenus.forEach((dropdownMenu) => {
      dropdownMenu.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    });

    // Icon initialization
    createIcons({ icons });

    // Initialize tooltips and popovers
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl)
    );

    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    const popoverList = [...popoverTriggerList].map(
      (popoverTriggerEl) => new window.bootstrap.Popover(popoverTriggerEl)
    );
  });
});
