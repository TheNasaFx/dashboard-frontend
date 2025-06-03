<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
// TODO: Replace with real user state management (Pinia, etc.)
const router = useRouter();
onMounted(() => {
  // Clear user state here (e.g., Pinia store, cookies, etc.)
  // For now, just redirect to login
  router.replace("/login");
});
</script>

<template>
  <div></div>
</template>
