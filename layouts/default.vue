<template>
  <div class="main-layout">
    <header id="topbar-custom" class="topbar">
      <div class="d-flex align-items-center justify-content-between">
        <button class="btn btn-link px-0" type="button" @click="toggleSidebar">
          <i class="ri-menu-line fs-24"></i>
        </button>
        <div class="d-flex align-items-center">
          <button
            id="light-dark-mode"
            class="btn btn-link px-0"
            type="button"
            @click="toggleTheme"
          >
            <i
              :class="isDark ? 'ri-sun-line' : 'ri-moon-line'"
              class="fs-24"
            ></i>
          </button>
        </div>
      </div>
    </header>
    <div class="layout-body">
      <nav class="main-nav">
        <ul class="navbar-nav">
          <slot name="sidebar"></slot>
        </ul>
      </nav>
      <main class="content-page">
        <slot></slot>
      </main>
    </div>
    <div class="startbar-overlay" @click="toggleSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from "~/composables/useSidebar";
import { useTheme } from "~/composables/useTheme";
const { toggleSidebar } = useSidebar();
const { isDark, toggleTheme } = useTheme();
</script>

<style scoped></style>
