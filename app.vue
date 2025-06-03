<template>
  <Menu :name="userName" :avatar="userAvatar" />
  <NuxtPage />
  <Footer />
</template>

<script setup>
const userName = "Админ"; // Replace with real user state
const userAvatar = "/assets/images/avatar.jpg";
</script>
