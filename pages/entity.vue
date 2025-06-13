<template>
  <NuxtLayout>
    <template #sidebar>
      <TheMenu />
    </template>
    <div class="page-wrapper">
      <div class="page-content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-12">
              <div
                class="page-title-box d-md-flex justify-content-md-between align-items-center"
              >
                <h4 class="page-title">{{ entity.name }}</h4>
                <div class="">
                  <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                    <li class="breadcrumb-item">
                      <a href="#">Татвар төлөгч</a>
                    </li>
                    <li class="breadcrumb-item active">Дэлгэрэнгүй</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-8">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                    {{ entity.name }}
                    <button
                      type="button"
                      class="btn btn-primary position-relative btn-sm"
                    >
                      Татвар төлөгч
                      <span
                        class="position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle"
                      >
                        <small class="thumb-xs">{{ entity.taxPayers }}</small>
                      </span>
                    </button>
                  </h5>
                  <p class="fs-12 text-muted">{{ entity.type }}</p>
                  <p class="card-text">{{ entity.address }}</p>
                  <small class="text-muted">Бүртгэл</small>
                  <div class="progress">
                    <div
                      class="progress-bar bg-gray progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      :style="`width:${entity.registration}%`"
                      :aria-valuenow="entity.registration"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small class="text-muted">Тайлан</small>
                  <div class="progress">
                    <div
                      class="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      :style="`width:${entity.report}%`"
                      :aria-valuenow="entity.report"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                <div class="card-footer">
                  <a
                    class="btn btn-icon btn-warning btn-sm"
                    :href="entity.mapUrl"
                    ><i class="fa fa-map-pin"></i
                  ></a>
                  <div class="btn-group">
                    <button
                      type="button"
                      class="btn btn-icon btn-dark btn-sm dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Давхар <i class="las la-angle-down ms-1"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-for="floor in entity.floors" :key="floor.number">
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectFloor(floor)"
                        >
                          {{ floor.number }}-р давхар
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <a href="/uploads/floor1.jpg" class="image-link">
                <img src="/uploads/floor1.jpg" alt="" class="w-100" />
              </a>
            </div>
          </div>
          <div class="row justify-content-center mt-2">
            <div class="col-12">
              <div class="card mb-3">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    {{ selectedFloor.number }}-р давхарт байрлах байгууллагууд
                  </h5>
                </div>
                <div class="card-body">
                  <ul class="list-group">
                    <li
                      v-for="org in selectedFloor.organizations"
                      :key="org.id"
                      class="list-group-item"
                    >
                      <strong>{{ org.name }}</strong>
                      <span class="badge bg-secondary ms-2">{{
                        org.type
                      }}</span>
                      <div class="text-muted small">{{ org.address }}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-8">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="card-title">Татвар бүрдүүлэлт</h4>
                    </div>
                  </div>
                </div>
                <div class="card-body pt-0">
                  <client-only><EntityLineChart /></client-only>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="card-title">Үйл ажиллагааны чиглэл</h4>
                    </div>
                  </div>
                </div>
                <div class="card-body pt-0">
                  <client-only><EntityPieChart /></client-only>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-8">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="card-title">Татварын орлого</h4>
                    </div>
                  </div>
                </div>
                <div class="card-body pt-0">
                  <client-only><EntityBarChart /></client-only>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="card-title">Ebarimt гаргах</h4>
                    </div>
                  </div>
                </div>
                <div class="card-body pt-0">
                  <client-only><EntityPolarAreaChart /></client-only>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-6">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="card-title">Хуулийн этгээдийн төрөл</h4>
                    </div>
                  </div>
                </div>
                <div class="card-body pt-0">
                  <client-only><EntityPieTypeChart /></client-only>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-6">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="card-title">Зөвлөгөө өгөх явц</h4>
                    </div>
                  </div>
                </div>
                <div class="card-body pt-0">
                  <client-only><EntityRadarChart /></client-only>
                </div>
              </div>
            </div>
          </div>
          <FooterComponent />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import TheMenu from "../components/TheMenu.vue";
import FooterComponent from "../components/FooterComponent.vue";

const EntityLineChart = defineAsyncComponent(
  () => import("../components/EntityLineChart.vue")
);
const EntityPieChart = defineAsyncComponent(
  () => import("../components/EntityPieChart.vue")
);
const EntityBarChart = defineAsyncComponent(
  () => import("../components/EntityBarChart.vue")
);
const EntityPolarAreaChart = defineAsyncComponent(
  () => import("../components/EntityPolarAreaChart.vue")
);
const EntityPieTypeChart = defineAsyncComponent(
  () => import("../components/EntityPieTypeChart.vue")
);
const EntityRadarChart = defineAsyncComponent(
  () => import("../components/EntityRadarChart.vue")
);

const entity = {
  id: 1,
  name: "Go.to market",
  taxPayers: 128,
  type: "Үйлчилгээний төв",
  address:
    "СБД, 11-р хороо, 7-р хороолол /Хангай хотхоны баруун талд/ 14180 Ulaanbaatar, Mongolia",
  registration: 90,
  report: 75,
  mapUrl:
    "https://www.google.com/maps/dir/?api=1&destination=47.934086900672%2C106.91685211685",
  floors: [
    {
      number: 1,
      organizations: [
        {
          id: 101,
          name: "Органик дэлгүүр",
          type: "Дэлгүүр",
          address: "1-р давхар 101",
        },
        {
          id: 102,
          name: "Кофе шоп",
          type: "Кофе шоп",
          address: "1-р давхар 102",
        },
        {
          id: 103,
          name: "Татварын зөвлөх",
          type: "Зөвлөх",
          address: "1-р давхар 103",
        },
      ],
    },
    {
      number: 2,
      organizations: [
        {
          id: 201,
          name: "Эмийн сан",
          type: "Эмийн сан",
          address: "2-р давхар 201",
        },
      ],
    },
    {
      number: 3,
      organizations: [
        { id: 301, name: "Банк", type: "Банк", address: "3-р давхар 301" },
      ],
    },
  ],
};

const selectedFloor = ref(entity.floors[0]);

function selectFloor(floor: any) {
  selectedFloor.value = floor;
}
</script>
