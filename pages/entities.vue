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
                      {{ selectedDistrictName }}
                      <i class="las la-angle-down ms-1"></i>
                    </button>
                    <div class="dropdown-menu">
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectDistrict('25', 'Сүхбаатар')"
                        >Сүхбаатар</a
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
            v-for="entity in filteredBuildings"
            :key="entity.id"
            class="col-lg-6 mb-4"
          >
            <div class="card">
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    :src="'/uploads/go.market.jpeg'"
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
                          <small class="thumb-xs">{{
                            entity.taxPayers || 0
                          }}</small>
                        </span>
                      </button>
                    </h5>
                    <p class="fs-12 text-muted">Үйлчилгээний төв</p>
                    <p class="card-text">{{ entity.address || "" }}</p>
                    <small class="text-muted">Бүртгэл</small>
                    <div class="progress">
                      <div
                        class="progress-bar bg-gray progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        :style="`width:${entity.registration || 90}%`"
                        :aria-valuenow="entity.registration || 90"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <small class="text-muted">Тайлан</small>
                    <div class="progress">
                      <div
                        class="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        :style="`width:${entity.report || 75}%`"
                        :aria-valuenow="entity.report || 75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <a
                      class="btn btn-icon btn-warning btn-sm"
                      :href="entity.mapUrl || '#'"
                      ><i class="fa fa-map-pin"></i
                    ></a>
                    <div v-if="entity.build_floor" class="btn-group">
                      <button
                        type="button"
                        class="btn btn-icon btn-dark btn-sm"
                        @click="handleDetailClick(entity)"
                      >
                        Дэлгэрэнгүй
                      </button>
                    </div>
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import TheMenu from "../components/TheMenu.vue";
import FooterComponent from "../components/FooterComponent.vue";

interface Building {
  id: number;
  name: string;
  office_code: string;
  kho_code: string;
  build_floor: number;
  address?: string;
  registration?: number;
  report?: number;
  mapUrl?: string;
  taxPayers?: number;
  // add other fields if needed
}

const buildings = ref<Building[]>([]);
const router = useRouter();

const selectedDistrict = ref("");
const selectedDistrictName = ref("Дүүрэг");
const selectedKhoroo = ref("");
const selectedKhorooName = ref("Хороо");

const districtMap: Record<string, string> = {
  "25": "Сүхбаатар",
  // Add more mappings as you get them
};

function selectDistrict(code: string, name: string) {
  selectedDistrict.value = code;
  selectedDistrictName.value = name;
}
function selectKhoroo(code: string, name: string) {
  selectedKhoroo.value = code;
  selectedKhorooName.value = name;
}

const filteredBuildings = computed(() => {
  return buildings.value.filter((b) => {
    const districtMatch =
      !selectedDistrict.value || b.office_code === selectedDistrict.value;
    const khorooMatch =
      !selectedKhoroo.value || b.kho_code === selectedKhoroo.value;
    return districtMatch && khorooMatch;
  });
});

onMounted(async () => {
  const res = await fetch("http://localhost:8080/api/buildings");
  const data = await res.json();
  buildings.value = data.map((b: any) => ({
    ...b,
    address:
      b.address ||
      "СБД, 11-р хороо, 7-р хороолол /Хангай хотхоны баруун талд/ 14180 Ulaanbaatar, Mongolia",
    registration: b.registration || 90,
    report: b.report || 75,
    taxPayers: b.taxPayers || 137,
    mapUrl:
      b.mapUrl ||
      "https://www.google.com/maps/dir/?api=1&destination=47.934086900672%2C106.91685211685",
  }));
});

function handleFloorSelect(buildingId: number, floor: number) {
  router.push(`/entity?id=${buildingId}&floor=${floor}`);
}

function handleDetailClick(entity: Building) {
  router.push(`/entity?id=${entity.id}`);
}
</script>

<style scoped>
.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
</style>
