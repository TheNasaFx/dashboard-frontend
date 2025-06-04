<template>
  <aside class="sidebar-area">
    <div class="widget widget_categories">
      <h3 class="widget_title">Цэс</h3>
      <ul>
        <li>
          <!-- Link should ideally be NuxtLink -->
          <a href="/profile">Хувийн тохиргоо</a>
          <span><i class="fa-sharp fa-light fa-user"></i></span>
        </li>
        <li>
          <!-- The logout link might need to be a NuxtLink and trigger a logout action -->
          <a href="/logout">Гарах</a>
          <span><i class="fa-sharp fa-light fa-logout"></i></span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
// The logout link should trigger a logout action, possibly via an API call or a Pinia action.
// Navigation links should ideally use NuxtLink for client-side navigation.
// import { NuxtLink } from '#components'; // Example import if using NuxtLink
</script>

<style scoped>
/* Add any specific styles for the customer sidebar here if needed */
/* Most styling seems to rely on existing CSS classes */
</style>
