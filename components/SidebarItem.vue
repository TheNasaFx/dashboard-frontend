<template>
  <li class="nav-item">
    <NuxtLink class="nav-link" :class="{ active: isActive }" :to="to">
      <i :class="icon" class="nav-icon"></i>
      <span class="nav-text">{{ title }}</span>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  title: string;
  icon: string;
  to: string;
}>();

const route = useRoute();

const isActive = computed(() => {
  return route.path === props.to;
});
</script>

<style scoped>
.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--bs-body-color);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--bs-primary);
}

.nav-link.active {
  color: var(--bs-primary);
  background: var(--bs-primary-bg-subtle);
}

.nav-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.nav-text {
  flex: 1;
}

[data-sidebar-size="collapsed"] .nav-text {
  display: none;
}
</style>
