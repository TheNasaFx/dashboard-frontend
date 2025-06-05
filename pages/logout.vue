<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useUser } from "../composables/useUser";

const router = useRouter();
const { clearUser } = useUser();

onMounted(() => {
  clearUser();
  router.replace({ path: "/login", query: { msg: "Гарсан" } });
});
</script>
