<template>
  <TheMenu />
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
                  <div class="dropdown">
                    <button
                      type="button"
                      class="btn btn-outline-primary dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Дүүрэг <i class="las la-angle-down ms-1"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">Баянгол</a>
                      <a class="dropdown-item" href="#">Баянзүрх</a>
                      <a class="dropdown-item" href="#">Чингэлтэй</a>
                      <a class="dropdown-item" href="#">Сүхбаатар</a>
                      <a class="dropdown-item" href="#">Сонгинохайрхан</a>
                      <a class="dropdown-item" href="#">Хан-Уул</a>
                      <a class="dropdown-item" href="#">Багахангай</a>
                      <a class="dropdown-item" href="#">Налайх</a>
                      <a class="dropdown-item" href="#">Багануур</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Бүгд</a>
                    </div>
                  </div>
                  <div class="dropdown">
                    <button
                      type="button"
                      class="btn btn-outline-warning dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Хороо <i class="las la-angle-down ms-1"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">1-р хороо</a>
                      <a class="dropdown-item" href="#">2-р хороо</a>
                      <a class="dropdown-item" href="#">3-р хороо</a>
                      <a class="dropdown-item" href="#">4-р хороо</a>
                      <a class="dropdown-item" href="#">5-р хороо</a>
                      <a class="dropdown-item" href="#">6-р хороо</a>
                      <a class="dropdown-item" href="#">7-р хороо</a>
                      <a class="dropdown-item" href="#">8-р хороо</a>
                      <a class="dropdown-item" href="#">9-р хороо</a>
                      <a class="dropdown-item" href="#">10-р хороо</a>
                      <a class="dropdown-item" href="#">11-р хороо</a>
                      <a class="dropdown-item" href="#">12-р хороо</a>
                      <a class="dropdown-item" href="#">13-р хороо</a>
                      <a class="dropdown-item" href="#">14-р хороо</a>
                      <a class="dropdown-item" href="#">15-р хороо</a>
                      <a class="dropdown-item" href="#">16-р хороо</a>
                      <a class="dropdown-item" href="#">17-р хороо</a>
                      <a class="dropdown-item" href="#">18-р хороо</a>
                      <a class="dropdown-item" href="#">19-р хороо</a>
                      <a class="dropdown-item" href="#">20-р хороо</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Бүгд</a>
                    </div>
                  </div>
                  <div class="dropdown">
                    <button
                      type="button"
                      class="btn btn-outline-dark dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Ү/а чиглэл <i class="las la-angle-down ms-1"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">Худалдаа</a>
                      <a class="dropdown-item" href="#">Хүнс</a>
                      <a class="dropdown-item" href="#">Санхүү</a>
                      <a class="dropdown-item" href="#">Тээвэр</a>
                      <a class="dropdown-item" href="#">Эрүүл мэнд</a>
                      <a class="dropdown-item" href="#">Боловсрол</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Бүгд</a>
                    </div>
                  </div>
                  <div class="dropdown">
                    <button
                      type="button"
                      class="btn btn-outline-light dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Төрөл <i class="las la-angle-down ms-1"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#">Хувь хүн</a>
                      <a class="dropdown-item" href="#">Хуулийн этгээд</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Бүгд</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            v-for="entity in entities"
            :key="entity.id"
            class="col-lg-6 mb-4"
          >
            <div class="card">
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    :src="entity.image"
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div class="col-md-8">
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
                    <a class="btn btn-icon btn-primary btn-sm" href="#"
                      ><i class="fa fa-edit"></i
                    ></a>
                    <button
                      v-if="entity.floors"
                      type="button"
                      class="btn btn-icon btn-dark btn-sm dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Давхар <i class="las la-angle-down ms-1"></i>
                    </button>
                    <div v-if="entity.floors" class="dropdown-menu">
                      <a
                        v-for="floor in entity.floors"
                        :key="floor"
                        class="dropdown-item"
                        :href="`/entity?id=${entity.id}&floor=${floor}`"
                        >{{ floor }}</a
                      >
                    </div>
                    <a
                      v-if="entity.organization"
                      class="btn btn-icon btn-dark btn-sm"
                      :href="`/entity?id=${entity.id}`"
                      >Зохион байгуулалт</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TheMenu from "../components/TheMenu.vue";
import FooterComponent from "../components/FooterComponent.vue";

const entities = [
  {
    id: 1,
    name: "Go.to market",
    image: "/uploads/go.market.jpeg",
    taxPayers: 128,
    type: "Үйлчилгээний төв",
    address:
      "СБД, 11-р хороо, 7-р хороолол /Хангай хотхоны баруун талд/ 14180 Ulaanbaatar, Mongolia",
    registration: 90,
    report: 75,
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&destination=47.934086900672%2C106.91685211685",
    floors: [1, 2, 3],
  },
  {
    id: 2,
    name: "Нарантуул-2 зах",
    image: "/uploads/narantuul2.jpeg",
    taxPayers: 256,
    type: "Үйлчилгээний төв",
    address:
      'Нарантуул-2" худалдааны төв, Чингэлтэй дүүрэг - 12 хороо, Улаанбаатар 15120',
    registration: 45,
    report: 35,
    mapUrl:
      "https://www.google.com/maps/search/%D0%BD%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D1%83%D1%83%D0%BB+%D0%B7%D0%B0%D1%85/@47.9471627,106.9023049,13z?entry=s&sa=X",
    organization: true,
  },
];

onMounted(async () => {
  if (process.client) {
    await import("~/assets/js/app.js");
    await import("~/assets/js/pages/datatable.init.js");
  }
});
</script>
