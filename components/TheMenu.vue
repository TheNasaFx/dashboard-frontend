<template>
  <div>
    <!-- Topbar -->
    <div class="topbar d-print-none">
      <div class="container-fluid">
        <nav
          class="topbar-custom d-flex justify-content-between"
          id="topbar-custom"
        >
          <ul
            class="topbar-item list-unstyled d-inline-flex align-items-center mb-0"
          >
            <li>
              <button
                class="nav-link mobile-menu-btn nav-icon"
                id="togglemenu"
                @click="toggleSidebar"
              >
                <i class="iconoir-menu"></i>
              </button>
            </li>
            <li class="hide-phone app-search">
              <form role="search" action="#" method="get">
                <input
                  type="search"
                  name="search"
                  class="form-control top-search mb-0"
                  placeholder="Search here..."
                />
                <button type="submit"><i class="iconoir-search"></i></button>
              </form>
            </li>
          </ul>
          <ul
            class="topbar-item list-unstyled d-inline-flex align-items-center mb-0"
          >
            <li class="topbar-item">
              <a
                class="nav-link nav-icon"
                href="javascript:void(0);"
                id="light-dark-mode"
                @click="toggleTheme"
              >
                <i class="iconoir-half-moon dark-mode"></i>
                <i class="iconoir-sun-light light-mode"></i>
              </a>
            </li>
            <li class="topbar-item">
              <a
                class="nav-link nav-icon"
                href="#"
                @click.prevent="showProfileModal = true"
              >
                <img
                  :src="unref(avatar) || '/assets/images/avatar.jpg'"
                  alt=""
                  class="thumb-md rounded-circle"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <component :is="ProfileInfoModal.default"
      :show="showProfileModal"
      :token="unref(token) || ''"
      :workerCode="unref(workerCode) || ''"
      :onClose="() => (showProfileModal = false)"
    />

    <!-- Sidebar -->
    <div class="startbar d-print-none">
      <div class="brand">
        <NuxtLink to="/dashboard" class="logo">
          <span>
            <img
              src="/assets/images/logo.png"
              alt="logo-small"
              class="logo-sm"
            />
          </span>
          <span class="">
            <img
              src="/assets/images/logo.png"
              alt="logo-large"
              class="logo-lg logo-light"
            />
            <img
              src="/assets/images/logo.png"
              alt="logo-large"
              class="logo-lg logo-dark"
            />
          </span>
        </NuxtLink>
      </div>
      <div class="startbar-menu">
        <div class="startbar-collapse" id="startbarCollapse" data-simplebar>
          <div class="d-flex align-items-start flex-column w-100">
            <ul class="navbar-nav mb-auto w-100">
              <li class="menu-label mt-2">
                <span>Цэс</span>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/dashboard">
                  <i class="iconoir-report-columns menu-icon"></i>
                  <span>Хянах самбар</span>
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/map">
                  <i class="iconoir-map-pin menu-icon"></i>
                  <span>Газрын зураг</span>
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/entities">
                  <i class="iconoir-list menu-icon"></i>
                  <span>Жагсаалт</span>
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/reports">
                  <i class="fa fa-pie-chart menu-icon"></i>
                  <span>Үйл ажиллагааны чиглэл</span>
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/land-info">
                  <i class="iconoir-globe menu-icon"></i>
                  <span>Газрын мэдээлэл</span>
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/real-estate-info">
                  <i class="iconoir-building menu-icon"></i>
                  <span>Үл хөдлөхийн мэдээлэл</span>
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/users">
                  <i class="iconoir-user menu-icon"></i>
                  <span>Байцаагчид</span>
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/logout">
                  <i class="icofont-logout menu-icon"></i>
                  <span>Гарах</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="startbar-overlay d-print-none"></div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "../composables/useUser";
import { unref, ref } from "vue";
import { useSidebar } from "../composables/useSidebar";
import { useTheme } from "../composables/useTheme";
import * as ProfileInfoModal from "./ProfileInfoModal.vue";

const { name, avatar, token, workerCode } = useUser();
const { toggleSidebar } = useSidebar();
const { toggleTheme } = useTheme();

const showProfileModal = ref(false);

// if (typeof window !== "undefined") loadUser(); // УСТГАСАН
</script>

<style scoped>
/* Та өөрийн custom style-уудыг энд бичиж болно */
.main-nav,
.startbar {
  background: #181c32 !important; /* эсвэл яг оригинал sidebar-ийн өнгө */
  color: #fff !important;
}
.main-nav .nav-link,
.startbar .nav-link,
.startbar .menu-label span {
  color: #fff !important;
}
.main-nav .nav-link.active,
.startbar .nav-link.active {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
}
</style>
