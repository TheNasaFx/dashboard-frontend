<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.initialize();
});
</script>

<style>
/* Global styles can go here */
</style>
