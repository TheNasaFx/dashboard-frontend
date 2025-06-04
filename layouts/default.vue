<template>
  <!-- Basic layout structure - adjust CSS as needed -->
  <div class="app-container">
    <AppHeaderSidebar />
    <div class="content-area">
      <AppCustomerSidebar />
      <main class="main-content">
        <NuxtPage />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeaderSidebar from "~/components/AppHeaderSidebar.vue";
import AppCustomerSidebar from "~/components/AppCustomerSidebar.vue";
import AppFooter from "~/components/AppFooter.vue";
</script>

<style>
/* Add basic layout styles here or in a global stylesheet */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-area {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 1rem; /* Adjust padding as needed */
}
</style>
