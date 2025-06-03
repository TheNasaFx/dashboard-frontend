<template>
  <Menu :name="userName" :avatar="userAvatar" />
  <NuxtPage />
  <Footer />
</template>

<script setup>
import Menu from "~/components/Menu.vue";
import Footer from "~/components/Footer.vue";

const userName = "Админ"; // Replace with real user state
const userAvatar = "/assets/images/avatar.jpg";
</script>
