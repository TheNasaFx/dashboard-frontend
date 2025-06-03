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
              <button class="nav-link mobile-menu-btn nav-icon" id="togglemenu">
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
              >
                <i class="iconoir-half-moon dark-mode"></i>
                <i class="iconoir-sun-light light-mode"></i>
              </a>
            </li>
            <li class="dropdown topbar-item">
              <a
                class="nav-link dropdown-toggle arrow-none nav-icon"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
                data-bs-offset="0,19"
              >
                <img :src="avatar" alt="" class="thumb-md rounded-circle" />
              </a>
              <div class="dropdown-menu dropdown-menu-end py-0">
                <div
                  class="d-flex align-items-center dropdown-item py-2 bg-secondary-subtle"
                >
                  <div class="flex-shrink-0">
                    <img :src="avatar" alt="" class="thumb-md rounded-circle" />
                  </div>
                  <div class="flex-grow-1 ms-2 text-truncate align-self-center">
                    <h6 class="my-0 fw-medium text-dark fs-13">{{ name }}</h6>
                    <small class="text-muted mb-0">Хэрэглэгч</small>
                  </div>
                </div>
                <NuxtLink class="dropdown-item text-danger" to="/logout"
                  ><i class="las la-power-off fs-18 me-1 align-text-bottom"></i>
                  Гарах</NuxtLink
                >
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <!-- Startbar -->
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
                <a class="nav-link" href="#">
                  <i class="fa fa-pie-chart menu-icon"></i>
                  <span>Тайлан</span>
                </a>
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

<script setup>
const props = defineProps({
  name: { type: String, default: "Хэрэглэгч" },
  avatar: { type: String, default: "/assets/images/avatar.jpg" },
});
</script>
