<script setup lang="ts">
import { onMounted } from "vue";
import { navigateTo } from "nuxt/app";

onMounted(() => {
  navigateTo("/login");
});
</script>
