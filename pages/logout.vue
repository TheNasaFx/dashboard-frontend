<template>
  <div>
    <!-- Logging out... -->
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/store/user";

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  userStore.logout();
  router.push("/login");
});
</script>
