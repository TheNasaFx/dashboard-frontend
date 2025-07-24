<template>
  <div>
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
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('26', 'Сүхбаатар')"
                          >Сүхбаатар</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('27', 'Багануур')"
                          >Багануур</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('28', 'Багахангай')"
                          >Багахангай</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('29', 'Налайх')"
                          >Налайх</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('23', 'Хан-Уул')"
                          >Хан-Уул</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('24', 'Баянзүрх')"
                          >Баянзүрх</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('34', 'Сүхбаатар')"
                          >Сүхбаатар</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('35', 'Сүхбаатар')"
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
                          v-for="n in 42"
                          :key="n"
                          class="dropdown-item"
                          href="#"
                          @click.prevent="
                            selectKhoroo(formatKhorooCode(n), `${formatKhorooCode(n)}-р хороо`)
                          "
                          >{{ formatKhorooCode(n) }}-р хороо</a
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
                              entity.tax_payers || 0
                            }}</small>
                          </span>
                        </button>
                      </h5>
                      <p class="fs-12 text-muted">{{ entity.address || "Үйлчилгээний төв" }}</p>
                      <p class="fs-12 text-muted">Нэгж талбарын дугаар: {{ entity.parcel_id || '-' }}</p>
                      <p class="fs-12 text-muted">Давхарын тоо: {{ entity.build_floor || 0 }}</p>
                      
                      <!-- Map мэдээлэл -->
                      <div v-if="entity.mapData" class="mt-2">
                        <div class="d-flex justify-content-between small text-muted">
                          <span><i class="fas fa-user text-primary"></i> {{ entity.mapData.owner_count || 0 }} эзэмшигч</span>
                          <span><i class="fas fa-building text-success"></i> {{ entity.mapData.activity_operators || 0 }} үйл ажиллагаа</span>
                        </div>
                        <div class="d-flex justify-content-between small text-muted mt-1">
                          <span><i class="fas fa-expand-arrows-alt text-info"></i> {{ formatNumber(entity.mapData.area || 0) }} мкв</span>
                          <span><i class="fas fa-users text-warning"></i> {{ entity.mapData.tenants || 0 }} түрээслэгч</span>
                        </div>
                      </div>
                      
                      <p class="card-text"></p>
                    </div>
                    <div class="card-footer">
                      <a
                        class="btn btn-icon btn-warning btn-sm"
                        :href="entity.mapUrl || '#'"
                        ><i class="fa fa-map-pin"></i
                      ></a>
                      <div class="btn-group">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useApi } from '../composables/useApi';

interface Building {
  id: number;
  name: string;
  office_code: string;
  kho_code: string;
  build_floor: number;
  address?: string;
  mapUrl?: string;
  tax_payers?: number;
  parcel_id?: string;
  mapData?: any;
  // add other fields if needed
}

const centers = ref<any[]>([]);
const buildings = ref<Building[]>([]);
const error = ref('');
const router = useRouter();

const selectedDistrict = ref("");
const selectedDistrictName = ref("Дүүрэг");
const selectedKhoroo = ref("");
const selectedKhorooName = ref("Хороо");

const districtMap: Record<string, string> = {
  "25": "Сүхбаатар",
  // Add more mappings as you get them
};

function formatKhorooCode(n: number): string {
  return n.toString().padStart(2, '0');
}

function selectDistrict(code: string, name: string) {
  selectedDistrict.value = code;
  selectedDistrictName.value = name;
}
function selectKhoroo(code: string, name: string) {
  selectedKhoroo.value = code;
  selectedKhorooName.value = name;
}

function formatNumber(num: number | string): string {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString('en-US');
}

async function fetchMapDataForBuildings() {
  if (!buildings.value || buildings.value.length === 0) return;
  
  // Batch дуудлага хийх building ID-уудыг цуглуулах
  const buildingIds = buildings.value.map(b => b.id).filter(id => id);
  
  if (buildingIds.length === 0) return;
  
  try {
    const response = await fetch(`http://localhost:8080/api/v1/map-data-batch?pay_center_ids=${buildingIds.join(',')}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      // Building бүрт map data нэмэх
      buildings.value = buildings.value.map(building => {
        const mapDataResponse = result.data[building.id.toString()];
        if (mapDataResponse && mapDataResponse.success && mapDataResponse.data) {
          return {
            ...building,
            mapData: mapDataResponse.data
          };
        } else {
          return {
            ...building,
            mapData: {
              owner_count: 0,
              activity_operators: 0,
              area: 0,
              tenants: 0
            }
          };
        }
      });
    }
  } catch (error) {
    console.error('Error fetching map data batch:', error);
  }
}

const filteredBuildings = computed(() => {
  return buildings.value.filter((b) => {
    const districtMatch =
      !selectedDistrict.value || b.office_code === selectedDistrict.value;
    
    // PAY_CENTER-аас ирэх KHO_CODE-той харьцуулах: "01" == "1" гэх мэт
    const khorooMatch = !selectedKhoroo.value || 
      parseInt(b.kho_code || '0') === parseInt(selectedKhoroo.value);
    
    return districtMatch && khorooMatch;
  });
});

onMounted(async () => {
  const resCenters = await useApi('/centers');
  if (resCenters.success) {
    centers.value = Array.isArray(resCenters.data) ? resCenters.data : [];
  } else {
    error.value = resCenters.error?.message || 'Алдаа';
  }
  const resBuildings = await useApi('/buildings');
  if (resBuildings.success) {
    const buildingsData = Array.isArray(resBuildings.data) ? resBuildings.data : [];
    buildings.value = buildingsData.map((b: any) => ({
      ...b,
      tax_payers: b.tax_payers || 0,
      mapUrl:
        b.mapUrl ||
        "https://www.google.com/maps/dir/?api=1&destination=47.934086900672%2C106.91685211685",
    }));
  } else {
    error.value = resBuildings.error?.message || 'Алдаа';
  }
  await fetchMapDataForBuildings(); // Map data fetch on mount
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
