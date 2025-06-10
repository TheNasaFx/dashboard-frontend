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
                <h4 class="page-title">Татвар төлөгчид</h4>
                <div class="">
                  <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="#">МТА – НТГ</a></li>
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
                        {{ selectedDistrictName }}
                        <i class="las la-angle-down ms-1"></i>
                      </button>
                      <div class="dropdown-menu">
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('1', 'Баянгол')"
                          >Баянгол</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('2', 'Баянзүрх')"
                          >Баянзүрх</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('3', 'Чингэлтэй')"
                          >Чингэлтэй</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('4', 'Сүхбаатар')"
                          >Сүхбаатар</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('5', 'Сонгинохайрхан')"
                          >Сонгинохайрхан</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('6', 'Хан-Уул')"
                          >Хан-Уул</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('7', 'Багахангай')"
                          >Багахангай</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('8', 'Налайх')"
                          >Налайх</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('9', 'Багануур')"
                          >Багануур</a
                        >
                        <div class="dropdown-divider"></div>
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('', 'Бүгд')"
                          >Бүгд</a
                        >
                      </div>
                    </div>
                    <div class="dropdown">
                      <button
                        type="button"
                        class="btn btn-outline-warning dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {{ selectedKhorooName }}
                        <i class="las la-angle-down ms-1"></i>
                      </button>
                      <div class="dropdown-menu">
                        <a
                          v-for="n in 20"
                          :key="n"
                          class="dropdown-item"
                          href="#"
                          @click.prevent="
                            selectKhoroo(n.toString(), `${n}-р хороо`)
                          "
                          >{{ n }}-р хороо</a
                        >
                        <div class="dropdown-divider"></div>
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectKhoroo('', 'Бүгд')"
                          >Бүгд</a
                        >
                      </div>
                    </div>
                    <div class="dropdown">
                      <button
                        type="button"
                        class="btn btn-outline-dark dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {{ selectedCategoryName }}
                        <i class="las la-angle-down ms-1"></i>
                      </button>
                      <div class="dropdown-menu">
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectCategory('1', 'Худалдаа')"
                          >Худалдаа</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectCategory('2', 'Хүнс')"
                          >Хүнс</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectCategory('3', 'Санхүү')"
                          >Санхүү</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectCategory('4', 'Тээвэр')"
                          >Тээвэр</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectCategory('5', 'Эрүүл мэнд')"
                          >Эрүүл мэнд</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectCategory('6', 'Боловсрол')"
                          >Боловсрол</a
                        >
                        <div class="dropdown-divider"></div>
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectCategory('', 'Бүгд')"
                          >Бүгд</a
                        >
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
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <MapView
                    :zips="selectedZips"
                    :khoroo="selectedKhoroo"
                    :category="selectedCategory"
                  />
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
import { ref, computed } from "vue";
import MapView from "../components/MapView.vue";
import TheMenu from "../components/TheMenu.vue";
import { districtsZipMap } from "../components/districtsZipMap";
import "../assets/js/baatars.js";
import "../assets/js/app.js";
import "../assets/js/pages/datatable.init.js";

const selectedDistrict = ref("");
const selectedDistrictName = ref("Дүүрэг");
const selectedKhoroo = ref("");
const selectedKhorooName = ref("Хороо");
const selectedCategory = ref("");
const selectedCategoryName = ref("Ү/а чиглэл");

const selectedZips = computed(() => {
  if (!selectedDistrict.value) return [];
  return districtsZipMap[selectedDistrict.value] || [];
});

function selectDistrict(val: string, name: string) {
  selectedDistrict.value = val;
  selectedDistrictName.value = name;
}
function selectKhoroo(val: string, name: string) {
  selectedKhoroo.value = val;
  selectedKhorooName.value = name;
}
function selectCategory(val: string, name: string) {
  selectedCategory.value = val;
  selectedCategoryName.value = name;
}
</script>
