<template>
  <AppHeaderSidebar :name="userName" :avatar="userAvatar" />
  <NuxtPage />
  <AppFooter />
</template>

<script setup>
import AppHeaderSidebar from "~/components/AppHeaderSidebar.vue";
import AppFooter from "~/components/AppFooter.vue";

const userName = "Админ"; // Replace with real user state
const userAvatar = "/assets/images/avatar.jpg";
</script>
