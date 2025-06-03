<template>
  <div>
    <!-- This page will redirect to login -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { navigateTo } from "nuxt/app";

onMounted(() => {
  navigateTo("/login");
});
</script>
