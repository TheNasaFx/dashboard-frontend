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
          <div class="row">
            <!-- Go.to.market мэдээлэл -->
            <div class="col-lg-4 col-md-6 mb-3">
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
                  <button
                    type="button"
                    class="btn btn-success btn-sm ms-2"
                    @click="showOrganizationsTable = !showOrganizationsTable"
                  >
                    e-баримт
                  </button>
                  <button
                    type="button"
                    class="btn btn-info btn-sm ms-2"
                    @click="toggleRentTable"
                  >
                    түрээс
                  </button>
                </div>
              </div>
            </div>
            <!-- Map -->
            <div class="col-lg-4 col-md-6 mb-3">
              <MarketMap :centerId="entity.id" />
            </div>
            <!-- 1-р давхарын зураг -->
            <div class="col-lg-4 col-md-12 mb-3">
              <div style="position: relative">
                <img
                  src="/uploads/floor1.jpg"
                  alt=""
                  class="w-100"
                  style="cursor: pointer"
                  @click="showFloorModal = true"
                />
                <div
                  v-if="showFloorModal"
                  class="modal-backdrop"
                  @click.self="showFloorModal = false"
                >
                  <div class="modal-content-custom">
                    <img src="/uploads/floor1.jpg" alt="" class="modal-img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- baiguullaguudiin medeelliig end husnegt baidlaar haruulna -->

          <!-- Байгууллагуудын хүснэгт хэсэг -->
          <div class="row justify-content-center mt-2" v-if="showOrganizationsTable">
            <div class="col-12">
              <div class="card mb-3">
                <div class="card-header d-flex align-items-center">
                  <!-- Давхар сонгох dropdown энд байрлана -->
                  <div class="btn-group floor-dropdown-group me-2">
                    <button
                      type="button"
                      class="btn btn-icon btn-dark btn-sm dropdown-toggle floor-dropdown-btn"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Давхар <i class="las la-angle-down ms-1"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-for="floor in floors" :key="floor">
                        <a
                          class="dropdown-item"
                          :class="{ 'active-floor': floor === selectedFloor }"
                          href="#"
                          @click.prevent="selectFloor(floor)"
                        >
                          {{ floor }}-р давхар
                        </a>
                      </li>
                    </ul>
                  </div>
                  <h5 class="card-title mb-0 me-3">
                    {{ selectedFloor }}-р давхарт байрлах байгууллагууд
                  </h5>
                  <!-- Search input -->
                  <div class="ms-auto">
                    <div class="input-group" style="max-width: 300px;">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="Регистр дугаараар хайх..."
                        v-model="searchQuery"
                        @input="filterOrganizations"
                      />
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        type="button"
                        @click="clearSearch"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Тасгийн нэр (stor_name)</th>
                        <th>Регистр (mrch_regno)</th>
                        <th>Үйл ажиллагааны чиглэл (op_type_name)</th>
                        <th>Баримтын тоо</th>
                        <th>Төлөв</th>
                        <th>Дэлгэрэнгүй</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="org in filteredOrganizations" :key="org.id">
                        <td>{{ org.stor_name }}</td>
                        <td>{{ org.mrch_regno }}</td>
                        <td>{{ org.op_type_name }}</td>
                        <td>{{ org.count_receipt ?? 0 }}</td>
                        <td>
                          <span
                            v-if="!org.count_receipt || org.count_receipt === 0"
                            class="status-badge status-red"
                            >Баримт гаргаагүй</span
                          >
                          <span v-else class="status-badge status-green"
                            >Баримт гаргасан</span
                          >
                        </td>
                        <td>
                          <button class="btn btn-sm btn-info">
                            Дэлгэрэнгүй
                          </button>
                        </td>
                      </tr>
                      <tr v-if="filteredOrganizations.length === 0">
                        <td colspan="6" class="text-center">
                          {{ searchQuery ? 'Хайлтад тохирох мэдээлэл олдсонгүй' : 'Мэдээлэл олдсонгүй' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- Search results info -->
                  <div v-if="searchQuery && filteredOrganizations.length > 0" class="mt-2">
                    <small class="text-muted">
                      {{ filteredOrganizations.length }} / {{ organizations.length }} байгууллага олдлоо
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Түрээсийн хүснэгт -->
          <div class="row justify-content-center mt-2" v-if="showRentTable">
            <div class="col-12">
              <div class="card mb-3">
                <div class="card-header d-flex align-items-center">
                  <h5 class="card-title mb-0 me-3">Түрээсийн мэдээлэл</h5>
                  <!-- Rent Search input -->
                  <div class="ms-auto">
                    <div class="input-group" style="max-width: 300px;">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="Эзэмшигч регистраар хайх..."
                        v-model="rentSearchQuery"
                        @input="filterRentProperties"
                      />
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        type="button"
                        @click="clearRentSearch"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Огноо(updated_date)</th>
                        <th>Төрөл(property_type)</th>
                        <th>Эзэмшигч регистр(owner_regno)</th>
                        <th>Хэмжээ (м2)(property_size)</th>
                        <th>Түрээсийн дүн(rent_amount)</th>
                        <th>1мкв түрээс</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in filteredRentProperties" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.updated_date || item.created_date || '-' }}</td>
                        <td>{{ item.property_type }}</td>
                        <td>{{ item.owner_regno }}</td>
                        <td>{{ item.property_size }}</td>
                        <td>{{ formatNumber(item.rent_amount) }}</td>
                        <td>
                          {{
                            item.property_size && item.rent_amount
                              ? formatNumber(Math.round(item.rent_amount / item.property_size))
                              : '-' 
                          }}
                        </td>
                      </tr>
                      <tr v-if="filteredRentProperties.length === 0">
                        <td colspan="7" class="text-center">
                          {{ rentSearchQuery ? 'Хайлтад тохирох мэдээлэл олдсонгүй' : 'Мэдээлэл олдсонгүй' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- Rent Search results info -->
                  <div v-if="rentSearchQuery && filteredRentProperties.length > 0" class="mt-2">
                    <small class="text-muted">
                      {{ filteredRentProperties.length }} / {{ rentProperties.length }} түрээс олдлоо
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Байгууллагуудын дэлгэрэнгүй шинэ хүснэгт -->
          <div class="row justify-content-center mt-2">
            <div class="col-12">
              <div class="card mb-3">
                <div class="card-header d-flex align-items-center">
                  <h5 class="card-title mb-0 me-3">Байгууллагуудын дэлгэрэнгүй мэдээлэл</h5>
                </div>
                <div class="card-body">
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Бүртгэл</th>
                        <th>И-Баримт сүүлийн 72цагт</th>
                        <th>Зөвшөөрлийн мэдээ</th>
                        <th>Тайлан</th>
                        <th>Төлөлт</th>
                        <th>Өрийн үлдэгдэл</th>
                        <th>Хөрөнгийн мэдээлэл</th>
                        <th>Туслан зөвлөх үйлчилгээ</th>
                        <th>Зөрчлийн мэдээлэл</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="org in organizations" :key="org.id">
                        <!-- Бүртгэл: mrch_regno -->
                        <td>{{ org.mrch_regno || '-' }}</td>
                        <!-- И-Баримт: count_receipt -->
                        <td>
                          <span v-if="!org.count_receipt || org.count_receipt === 0">
                            <i class="fas fa-times-circle text-danger"></i>
                          </span>
                          <span v-else>
                            <i class="fas fa-check-circle text-success"></i>
                          </span>
                        </td>
                        <!-- Зөвшөөрлийн мэдээ -->
                        <td>0</td>
                        <!-- Тайлан -->
                        <td>0</td>
                        <!-- Төлөлт -->
                        <td>0</td>
                        <!-- Өрийн үлдэгдэл -->
                        <td>0</td>
                        <!-- Хөрөнгийн мэдээлэл -->
                        <td>
                          <template v-if="org.pay_center_property">
                            <span v-if="org.pay_center_property.owner_regno && org.mrch_regno && org.pay_center_property.owner_regno.trim() === org.mrch_regno.trim()">
                              Хувийн эзэмшил
                            </span>
                            <span v-else>
                              Түрээсийн газар
                            </span>
                            <span class="ms-1">({{ org.pay_center_property.property_size || '-' }} м²)</span>
                          </template>
                          <template v-else>
                            -
                          </template>
                        </td>
                        <!-- Туслан зөвлөх үйлчилгээ -->
                        <td>0</td>
                        <!-- Зөрчлийн мэдээлэл -->
                        <td>0</td>
                      </tr>
                      <tr v-if="organizations.length === 0">
                        <td colspan="9" class="text-center">Мэдээлэл олдсонгүй</td>
                      </tr>
                    </tbody>
                  </table>
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
import { ref, defineAsyncComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

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

const route = useRoute();
const organizations = ref<any[]>([]);
const floors = ref<number[]>([]);
const selectedFloor = ref<number>(1);
const entity = ref<any>({
  id: route.query.id ? Number(route.query.id) : undefined,
  name: "Go.to market",
  taxPayers: 128,
  type: "Үйлчилгээний төв",
  address:
    "СБД, 11-р хороо, 7-р хороолол /Хангай хотхоны баруун талд/ 14180 Ulaanbaatar, Mongolia",
  registration: 90,
  report: 75,
  mapUrl:
    "https://www.google.com/maps/dir/?api=1&destination=47.934086900672%2C106.91685211685",
});
const showFloorModal = ref(false);
const showOrganizationsTable = ref(false);
const showRentTable = ref(false);
const rentProperties = ref<any[]>([]);
const searchQuery = ref('');
const filteredOrganizations = ref<any[]>([]);
const rentSearchQuery = ref('');
const filteredRentProperties = ref<any[]>([]);

async function fetchFloors() {
  const id = route.query.id;
  if (!id) return;
  const res = await fetch(`http://localhost:8080/api/buildings/${id}/floors`);
  const data = await res.json();
  // floors backend-ээс string хэлбэрээр ирдэг тул number болгоно
  floors.value = data
    .map((f: string) => Number(f))
    .sort((a: number, b: number) => a - b);
  if (floors.value.length > 0) {
    selectedFloor.value = floors.value[0];
    fetchOrganizations();
  }
}

async function fetchOrganizations() {
  const id = route.query.id;
  const floor = selectedFloor.value;
  if (!id || !floor) return;
  const res = await fetch(
    `http://localhost:8080/api/buildings/${id}/floors/${floor}/organizations`
  );
  let orgs = await res.json();
  // Байгууллага бүрийн mrch_regno-оор ebarimt авч нэмэх
  orgs = await Promise.all(
    orgs.map(async (org: any) => {
      if (org.mrch_regno) {
        try {
          const ebarimtRes = await fetch(`http://localhost:8080/api/ebarimt/${org.mrch_regno}`);
          const ebarimtJson = await ebarimtRes.json();
          org.count_receipt = ebarimtJson?.data?.count_receipt ?? 0;
        } catch (e) {
          org.count_receipt = 0;
        }
      } else {
        org.count_receipt = 0;
      }
      // PAY_CENTER_PROPERTY-г нэгтгэх
      if (org.pay_center_property_id) {
        try {
          const propertyRes = await fetch(`http://localhost:8080/api/pay_center_property`);
          const propertyJson = await propertyRes.json();
          const properties = propertyJson.data || [];
          org.pay_center_property = properties.find((p: any) => Number(p.id) === Number(org.pay_center_property_id));
        } catch (e) {
          org.pay_center_property = null;
        }
      } else {
        org.pay_center_property = null;
      }
      return org;
    })
  );
  organizations.value = orgs;
  filteredOrganizations.value = orgs; // Эхлээд бүх байгууллагыг харуулах
}

function selectFloor(floor: number) {
  selectedFloor.value = floor;
  searchQuery.value = ''; // Давхар сонгох үед search-г цэвэрлэх
  fetchOrganizations();
}

function toggleRentTable() {
  showRentTable.value = !showRentTable.value;
  if (showRentTable.value) {
    fetchRentProperties();
  }
}

async function fetchRentProperties() {
  const res = await fetch("http://localhost:8080/api/pay_center_property");
  const data = await res.json();
  // Шинэ backend structure: { success, data: [...] }
  const items = data.data || [];
  rentProperties.value = items.filter((item: any) => Number(item.pay_center_id) === Number(entity.value.id));
  filteredRentProperties.value = rentProperties.value; // Эхлээд бүх түрээсийг харуулах
}

function formatNumber(num: number | string) {
  if (num === undefined || num === null) return '-';
  return Number(num).toLocaleString('en-US');
}

// Search functions
function filterOrganizations() {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) {
    filteredOrganizations.value = organizations.value;
    return;
  }
  
  filteredOrganizations.value = organizations.value.filter(org => {
    if (!org.mrch_regno) return false;
    return org.mrch_regno.toLowerCase().includes(query);
  });
}

function clearSearch() {
  searchQuery.value = '';
  filteredOrganizations.value = organizations.value;
}

// Rent Search functions
function filterRentProperties() {
  const query = rentSearchQuery.value.toLowerCase().trim();
  if (!query) {
    filteredRentProperties.value = rentProperties.value;
    return;
  }
  
  filteredRentProperties.value = rentProperties.value.filter(item => {
    if (!item.owner_regno) return false;
    return item.owner_regno.toLowerCase().includes(query);
  });
}

function clearRentSearch() {
  rentSearchQuery.value = '';
  filteredRentProperties.value = rentProperties.value;
}

onMounted(() => {
  fetchFloors();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content-custom {
  position: relative;
  background: #fff;
  border-radius: 10px;
  padding: 16px 16px 8px 16px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-img {
  max-width: 80vw;
  max-height: 70vh;
  border-radius: 8px;
}
.status-badge {
  display: inline-block;
  min-width: 110px;
  padding: 4px 18px;
  font-size: 13px;
  font-weight: 400;
  border-radius: 999px;
  color: #fff;
  text-align: center;
  margin: 2px 0;
  line-height: 22px;
  vertical-align: middle;
}
.status-green {
  background: #19b86b;
}
.status-red {
  background: #f04646;
}
.status-yellow {
  background: #f7b731;
  color: #fff;
}
.floor-dropdown-group .floor-dropdown-btn {
  background: #222 !important;
  color: #fff !important;
  border: 1px solid #222 !important;
  box-shadow: none !important;
}
.floor-dropdown-group .floor-dropdown-btn:focus,
.floor-dropdown-group .floor-dropdown-btn:active,
.floor-dropdown-group .floor-dropdown-btn:hover {
  background: #222 !important;
  color: #fff !important;
  border: 1px solid #222 !important;
  box-shadow: none !important;
}
.dropdown-menu .dropdown-item.active-floor,
.dropdown-menu .dropdown-item.active-floor:focus,
.dropdown-menu .dropdown-item.active-floor:hover {
  background: #19b86b !important;
  color: #fff !important;
  font-weight: 500;
}
</style>
