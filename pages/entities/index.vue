<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div
              class="page-title-box d-md-flex justify-content-md-between align-items-center"
            >
              <h4 class="page-title">Татвар төлөгчид</h4>
              <div class="">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                  <li class="breadcrumb-item">
                    <a href="#">Татвар төлөгчид</a>
                  </li>
                  <li class="breadcrumb-item active">Жагсаалт</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-12 col-lg-12">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-wrap gap-2">
                  <!-- Dropdowns for filters -->
                  <!-- TODO: Implement filter logic and connect to API -->
                  <!-- Example Filter Structure (adapt as needed from map.vue or original entities.php) -->
                  <!-- District Filter -->
                  <button
                    type="button"
                    class="btn btn-outline-primary dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Дүүрэг: Бүгд <i class="las la-angle-down ms-1"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Бүгд</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item" href="#">Баянгол</a></li>
                    <!-- Add other districts -->
                  </ul>

                  <!-- Activity Type Filter -->
                  <button
                    type="button"
                    class="btn btn-outline-dark dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Ү/а чиглэл: Бүгд <i class="las la-angle-down ms-1"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Бүгд</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item" href="#">Худалдаа</a></li>
                    <!-- Add other activity types -->
                  </ul>

                  <!-- Type Filter -->
                  <button
                    type="button"
                    class="btn btn-outline-light dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Төрөл: Бүгд <i class="las la-angle-down ms-1"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Бүгд</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item" href="#">Хувь хүн</a></li>
                    <li>
                      <a class="dropdown-item" href="#">Хуулийн этгээд</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Loop through entities data to generate cards -->
        <div class="row">
          <div class="col-lg-6" v-for="entity in entities" :key="entity.id">
            <div class="card">
              <div class="row g-0">
                <div class="col-md-4">
                  <!-- TODO: Update image source dynamically -->
                  <img
                    :src="entity.image || '/uploads/default-entity.jpeg'"
                    <!--
                    Assuming
                    entity
                    data
                    includes
                    image
                    path
                    --
                  />
                  class="img-fluid rounded-start" :alt="entity.name" />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">
                      {{ entity.name }}
                      <!-- TODO: Add dynamic count or status indicator if available in data -->
                      <button
                        type="button"
                        class="btn btn-primary position-relative btn-sm"
                      >
                        Татвар төлөгч
                        <span
                          class="position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle"
                        >
                          <small class="thumb-xs">{{
                            entity.taxpayerCount || "--"
                          }}</small>
                          <!-- Assuming entity data includes taxpayerCount -->
                        </span>
                      </button>
                    </h5>
                    <!-- TODO: Display dynamic type or category -->
                    <p class="fs-12 text-muted">{{ entity.type || "--" }}</p>
                    <!-- TODO: Display dynamic address or location -->
                    <p class="card-text">
                      {{ entity.address || "--" }}
                    </p>
                    <!-- TODO: Display dynamic progress bars if data available -->
                    <small class="text-muted">Бүртгэл</small>
                    <div class="progress">
                      <div
                        class="progress-bar bg-gray progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        :style="{
                          width: (entity.registrationProgress || 0) + '%',
                        }"
                        :aria-valuenow="entity.registrationProgress || 0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <small class="text-muted">Тайлан</small>
                    <div class="progress">
                      <div
                        class="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        :style="{ width: (entity.reportProgress || 0) + '%' }"
                        :aria-valuenow="entity.reportProgress || 0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <!-- TODO: Add actual map link if lat/lng available -->
                    <a
                      class="btn btn-icon btn-warning btn-sm"
                      :href="
                        entity.lat && entity.lng
                          ? `https://www.google.com/maps/dir/?api=1&destination=${entity.lat}%2C${entity.lng}`
                          : '#'
                      "
                      :class="{ disabled: !entity.lat || !entity.lng }"
                      target="_blank"
                      ><i class="fa fa-map-pin"></i
                    ></a>
                    <!-- Link to entity detail page -->
                    <NuxtLink
                      :to="`/entities/${entity.id}`"
                      class="btn btn-icon btn-primary btn-sm"
                    >
                      <i class="fa fa-edit"></i>
                    </NuxtLink>
                    <!-- TODO: Implement floor/organization structure logic if needed -->
                    <!-- Original floor dropdown -->
                    <!--
                    <button
                      type="button"
                      class="btn btn-icon btn-dark btn-sm dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Давхар <i class="las la-angle-down ms-1"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">1</a>
                    </div>
                    -->
                    <!-- Example organization link if needed -->
                    <!--
                     <NuxtLink :to="`/entities/${entity.id}/organization`" class="btn btn-icon btn-dark btn-sm">
                        Зохион байгуулалт
                    </NuxtLink>
                    -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Placeholder row if no data -->
          <div class="col-12" v-if="entities.length === 0">
            <div class="card">
              <div class="card-body text-center">Өгөгдөл олдсонгүй.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { $fetch } from "ofetch";

// Define reactive state for entities data
const entities = ref([]); // Placeholder for entity list data

// Fetch entity data from API endpoint (e.g., /api/entities)
const fetchEntities = async () => {
  try {
    const entitiesData = await $fetch("/api/entities");
    // Assuming entitiesData is an array of entity objects with properties like id, name, image, type, address, taxpayerCount, registrationProgress, reportProgress, lat, lng
    entities.value = entitiesData;
  } catch (error) {
    console.error("Error fetching entities data:", error);
    // TODO: Display an error message to the user
  }
};

// Fetch data when component is mounted
onMounted(() => {
  fetchEntities();
});

// TODO: Add filter logic and re-fetch data when filters change
// Example reactive variables for filters:
// const selectedDistrict = ref(null);
// const selectedActivityType = ref(null);
// const selectedType = ref(null);
// Use watchEffect to call fetchEntities when filter variables change
</script>

definePageMeta({ middleware: ["auth"], });

<style scoped>
/* Add any component-specific styles here */
</style>
