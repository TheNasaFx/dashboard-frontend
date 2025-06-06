<template>
  <li class="nav-item">
    <a
      class="nav-link"
      :class="{ active: isActive }"
      :href="href"
      data-bs-toggle="collapse"
      :data-bs-target="`#${id}`"
      :aria-expanded="isExpanded"
      :aria-controls="id"
    >
      <i :class="icon" class="nav-icon"></i>
      <span class="nav-text">{{ title }}</span>
      <i class="ri-arrow-down-s-line nav-arrow"></i>
    </a>
    <div :id="id" class="collapse" :class="{ show: isExpanded }">
      <ul class="nav flex-column">
        <slot></slot>
      </ul>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  title: string;
  icon: string;
  href: string;
  id: string;
}>();

const route = useRoute();
const isExpanded = ref(false);

const isActive = computed(() => {
  return route.path.startsWith(props.href);
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

.nav-arrow {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

[data-sidebar-size="collapsed"] .nav-text,
[data-sidebar-size="collapsed"] .nav-arrow {
  display: none;
}

.collapse {
  padding-left: 2.5rem;
}

[data-sidebar-size="collapsed"] .collapse {
  display: none;
}
</style>
