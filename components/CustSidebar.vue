<template>
  <aside class="sidebar-area">
    <div class="widget widget_categories">
      <h3 class="widget_title">Цэс</h3>
      <ul>
        <li>
          <NuxtLink to="/profile"
            >Хувийн тохиргоо
            <span><i class="fa-sharp fa-light fa-user"></i></span
          ></NuxtLink>
        </li>
        <li>
          <NuxtLink to="/logout"
            >Гарах <span><i class="fa-sharp fa-light fa-logout"></i></span
          ></NuxtLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
// No logic needed
</script>
