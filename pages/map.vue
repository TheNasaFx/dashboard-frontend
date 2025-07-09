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
                  <div class="d-flex flex-wrap gap-2 align-items-center">
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
                          @click.prevent="selectDistrict('25', 'Сүхбаатар')"
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
                    <input
                      v-model="searchRegno"
                      @keyup.enter="searchByRegno"
                      type="text"
                      class="form-control ms-3"
                      style="max-width: 180px;"
                      placeholder="Регистрээр хайх"
                    />
                    <button class="btn btn-primary ms-2" @click="searchByRegno">Хайх</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <client-only>
                    <MapView
                      :district="selectedDistrict"
                      :khoroo="selectedKhoroo"
                      :category="selectedCategory"
                      :searchLand="searchedLand"
                      :organizations="organizations"
                    />
                  </client-only>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Statistics Cards -->
          <div class="row">
            <div class="col-12">
              <StatisticsCards />
            </div>
          </div>
          <FooterComponent />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useHead } from "@unhead/vue";
import StatisticsCards from "../components/StatisticsCards.vue";

const selectedDistrict = ref("");
const selectedDistrictName = ref("Дүүрэг");
const selectedKhoroo = ref("");
const selectedKhorooName = ref("Хороо");
const selectedCategory = ref("");
const selectedCategoryName = ref("Ү/а чиглэл");

const searchRegno = ref("");
const searchedLand = ref<any[] | null>(null);
const organizations = ref<any[] | null>(null);

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

// Fetch organizations on page load
onMounted(async () => {
  const res = await fetch("http://localhost:8080/api/v1/organizations");
  const data = await res.json();
  organizations.value = Array.isArray(data.data) ? data.data : [];
});

async function searchByRegno() {
  if (!searchRegno.value) return;
  try {
    const res = await fetch(`http://localhost:8080/api/v1/land-views?pin=${searchRegno.value}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      searchedLand.value = data;
      organizations.value = null;
    } else {
      searchedLand.value = null;
      alert("Газрын мэдээлэл олдсонгүй!");
    }
  } catch (e) {
    searchedLand.value = null;
    alert("Алдаа гарлаа!");
  }
}

useHead({
  script: [
    { src: "/assets/js/app.js" },
    { src: "/assets/js/baatars.js" },
    { src: "/assets/js/pages/datatable.init.js" },
  ],
});
</script>
