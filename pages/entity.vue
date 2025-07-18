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
                <div class="d-flex align-items-center">
                  <!-- Cache Statistics (Debug) -->
                  <div class="me-3">
                    <small class="text-muted">
                      Cache: {{ getStats().totalItems }} items
                    </small>
                  </div>
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
                        <small class="thumb-xs">{{ entity.tax_payers || 0 }}</small>
                      </span>
                    </button>
                  </h5>
                  <p class="fs-12 text-muted">{{ entity.address || "Үйлчилгээний төв" }}</p>
                  <p class="fs-12 text-muted">Давхарын тоо: {{ entity.build_floor || 0 }}</p>
                  <p class="card-text"></p>
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
                    :class="{ active: activeTab === 'ebarimt' }"
                    @click="setActiveTab('ebarimt')"
                  >
                    Байгууллагууд
                  </button>
                  <button
                    type="button"
                    class="btn btn-info btn-sm ms-2"
                    :class="{ active: activeTab === 'rent' }"
                    @click="setActiveTab('rent')"
                  >
                    Түрээс
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

          <!-- Байгууллагуудын хүснэгт хэсэг -->
          <div class="row justify-content-center mt-2" v-if="activeTab === 'ebarimt'">
            <div class="col-12">
              <div class="card mb-3">
                <div class="card-header d-flex align-items-center">
                  <!-- Давхар сонгох dropdown энд байрлана -->
                  <div class="btn-group floor-dropdown-group me-2">
                    <button
                      type="button"
                      class="btn btn-icon btn-dark btn-sm dropdown-toggle floor-dropdown-btn"
                      :class="{ 'show': showDropdown }"
                      @click="toggleDropdown"
                    >
                      Давхар <i class="las la-angle-down ms-1" :class="{ 'rotate': showDropdown }"></i>
                    </button>
                    <ul class="dropdown-menu" :class="{ 'show': showDropdown }">
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
                        <th>Баримтын тоо (3)</th>
                        <th>Баримтын тоо (30)</th>
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
                        <td>{{ org.cnt_30 ?? 0 }}</td>
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
                          <button class="btn btn-sm btn-info" @click="openDetailModal(org.mrch_regno)">
                            Дэлгэрэнгүй
                          </button>
                        </td>
                      </tr>
                      <tr v-if="filteredOrganizations.length === 0">
                        <td colspan="7" class="text-center">
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
          <div class="row justify-content-center mt-2" v-if="activeTab === 'rent'">
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
          
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-8">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h4 class="card-title">Бүртгэлийн статистик</h4>
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
    
    <!-- Organization Detail Modal -->
    <OrganizationDetailModal 
      :is-open="detailModalOpen" 
      :mrch-regno="selectedMrchRegno"
      @close="closeDetailModal"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useApi } from '../composables/useApi';

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
const OrganizationDetailModal = defineAsyncComponent(
  () => import("../components/OrganizationDetailModal.vue")
);

const route = useRoute();
const organizations = ref<any[]>([]);
const floors = ref<number[]>([]);
const selectedFloor = ref<number>(1);
const entity = ref<any>({
  id: route.query.id ? Number(route.query.id) : undefined,
  name: "",
  tax_payers: 0,
  address: "",
  registration: 90,
  report: 75,
  mapUrl: "https://www.google.com/maps/dir/?api=1&destination=47.934086900672%2C106.91685211685",
});
const showFloorModal = ref(false);
const activeTab = ref<string>('');
const rentProperties = ref<any[]>([]);
const searchQuery = ref('');
const filteredOrganizations = ref<any[]>([]);
const rentSearchQuery = ref('');
const filteredRentProperties = ref<any[]>([]);

// Modal state
const detailModalOpen = ref(false);
const selectedMrchRegno = ref('');
const showDropdown = ref(false);

// Import cache composable
import { useCache } from '../composables/useCache';
const { get, set, has, getStats } = useCache();

// Function to get cache key
function getEntityCacheKey(id: string, floor: number) {
  return `entity_${id}_floor_${floor}`;
}

async function fetchEntity() {
  const id = route.query.id;
  if (!id) return;
  
  try {
    const res = await useApi(`/buildings/${id}`);
    if (res.success && res.data) {
      const data: any = res.data;
      entity.value = {
        ...entity.value,
        id: data.id,
        name: data.name || "",
        tax_payers: data.tax_payers || 0,
        address: data.address || "",
        build_floor: data.build_floor || 0,
        registration: data.registration || 90,
        report: data.report || 75,
        mapUrl: entity.value.mapUrl, // Keep existing mapUrl
      };
    }
  } catch (error) {
    console.error('Error fetching entity:', error);
  }
}

async function fetchFloors() {
  const id = route.query.id;
  if (!id) return;
  
  // Check cache first
  const cacheKey = `floors_${id}`;
  const cachedData = get(cacheKey);
  
  if (cachedData) {
    console.log('Using cached floors data');
    floors.value = cachedData;
    if (floors.value.length > 0) {
      selectedFloor.value = floors.value[0];
    }
    return;
  }
  
  try {
    const res = await useApi(`/buildings/${id}/floors`);
    if (res.success && res.data) {
  // floors backend-ээс string хэлбэрээр ирдэг тул number болгоно
      const data = Array.isArray(res.data) ? res.data
    .map((f: string) => Number(f))
        .sort((a: number, b: number) => a - b) : [];
      
      floors.value = data;
  if (floors.value.length > 0) {
    selectedFloor.value = floors.value[0];
      }
      
      // Cache the result
      set(cacheKey, data);
      console.log('Cached floors data');
    }
  } catch (error) {
    console.error('Error fetching floors:', error);
  }
}

async function fetchOrganizations() {
  const id = route.query.id;
  const floor = selectedFloor.value;
  if (!id) return;
  
  // Check cache first
  const cacheKey = getEntityCacheKey(id.toString(), floor);
  const cachedData = get(cacheKey);
  
  if (cachedData) {
    console.log('Using cached organizations data');
    organizations.value = cachedData;
    filteredOrganizations.value = organizations.value;
    return;
  }
  
  try {
    // Get organizations data
    const url = floor 
      ? `/buildings/${id}/floors/${floor}/organizations`
      : `/buildings/${id}/organizations`;
    
    const res = await useApi(url);
    if (res.success && res.data) {
      const orgsData = Array.isArray(res.data) ? res.data : [];
      // Get all MRCH_REGNO values for batch processing
      const mrchRegnos = orgsData.map(org => org.mrch_regno).filter(regno => regno);
      
      // Batch fetch all API data at once
      const [ebarimtBatchData, reportBatchData, paymentBatchData, debtBatchData] = await Promise.all([
        // Ebarimt batch data (сүүлийн 3 болон 30 хоног)
        Promise.all(mrchRegnos.map(async (regno: string) => {
          try {
            const response = await fetch(`http://localhost:8080/api/ebarimt/${regno}`);
            if (response.ok) {
              const data = await response.json();
              return { regno, data: data.data || {} };
            }
          } catch (error) {
            console.error(`Error fetching ebarimt for ${regno}:`, error);
          }
          return { regno, data: {} };
        })),
        
        // Report batch data (V_E_TUB_REPORT_DATA-аас SUBMITTED_DATE)
        Promise.all(mrchRegnos.map(async (regno: string) => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/tub-report-data?tin=${regno}`);
            if (response.ok) {
              const data = await response.json();
              const reportData = data.data;
              // Get the latest submitted date from the array
              if (Array.isArray(reportData) && reportData.length > 0) {
                const latestReport = reportData.reduce((latest, current) => {
                  if (!latest.submitted_date) return current;
                  if (!current.submitted_date) return latest;
                  return new Date(current.submitted_date) > new Date(latest.submitted_date) ? current : latest;
                });
                return { regno, data: latestReport };
              }
              return { regno, data: {} };
            }
          } catch (error) {
            console.error(`Error fetching report for ${regno}:`, error);
          }
          return { regno, data: {} };
        })),
        
        // Payment batch data (V_E_TUB_PAYMENTS-аас AMOUNT нийлбэр)
        Promise.all(mrchRegnos.map(async (regno: string) => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/payments/${regno}`);
            if (response.ok) {
              const data = await response.json();
              return { regno, data: data.data || {} };
            }
          } catch (error) {
            console.error(`Error fetching payments for ${regno}:`, error);
          }
          return { regno, data: {} };
        })),
        
        // Debt batch data (V_ACCOUNT_GENERAL_YEAR-аас C2_DEBIT нийлбэр)
        Promise.all(mrchRegnos.map(async (regno: string) => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/account-general-years?regno=${regno}&tab=debt`);
            if (response.ok) {
              const data = await response.json();
              // Calculate total C2_DEBIT for all records
              if (Array.isArray(data) && data.length > 0) {
                const totalDebt = data.reduce((total, record) => {
                  const c2Debit = record.C2_DEBIT || 0;
                  return total + parseFloat(c2Debit);
                }, 0);
                return { regno, data: { total_debt: totalDebt } };
              }
              return { regno, data: { total_debt: 0 } };
            }
          } catch (error) {
            console.error(`Error fetching debt for ${regno}:`, error);
          }
          return { regno, data: { total_debt: 0 } };
        }))
      ]);

      // Create lookup maps for fast access
      const ebarimtMap = new Map(ebarimtBatchData.map(item => [item.regno, item.data]));
      const reportMap = new Map(reportBatchData.map(item => [item.regno, item.data]));
      const paymentMap = new Map(paymentBatchData.map(item => [item.regno, item.data]));
      const debtMap = new Map(debtBatchData.map(item => [item.regno, item.data]));

      // Combine all data
      const enrichedOrgs = orgsData.map((org: any) => {
        const mrchRegno = org.mrch_regno;
        const ebarimtData = ebarimtMap.get(mrchRegno) || {};
        const reportData = reportMap.get(mrchRegno) || {};
        const paymentData = paymentMap.get(mrchRegno) || {};
        const debtData = debtMap.get(mrchRegno) || {};

        return {
          ...org,
          count_receipt: (ebarimtData as any)?.count_receipt || 0,
          cnt_3: (ebarimtData as any)?.cnt_3 || 0,
          cnt_30: (ebarimtData as any)?.cnt_30 || 0,
          report_submitted_date: (reportData as any)?.submitted_date || '',
          payment_amount: (paymentData as any)?.total_amount || 0,
          debt_amount: (debtData as any)?.total_debt || 0,
          advice_count: 0 // Fixed value as requested
        };
      });

      organizations.value = enrichedOrgs;
      filteredOrganizations.value = organizations.value;
      
      // Cache the result
      set(cacheKey, enrichedOrgs);
      console.log('Cached organizations data');
    } else {
      console.error('Invalid response format from organizations API');
      organizations.value = [];
      filteredOrganizations.value = [];
    }
  } catch (error) {
    console.error('Error fetching organizations:', error);
    organizations.value = [];
    filteredOrganizations.value = [];
  }
}

function toggleDropdown() {
  console.log('Toggle dropdown clicked, current state:', showDropdown.value);
  showDropdown.value = !showDropdown.value;
  console.log('New dropdown state:', showDropdown.value);
}

function selectFloor(floor: number) {
  selectedFloor.value = floor;
  searchQuery.value = ''; // Давхар сонгох үед search-г цэвэрлэх
  showDropdown.value = false; // Dropdown-г хаах
  fetchOrganizations();
}

async function setActiveTab(tab: 'ebarimt' | 'rent') {
  if (activeTab.value === tab) {
    activeTab.value = '';
    return;
  }
  activeTab.value = tab;
  if (tab === 'ebarimt') {
    await fetchOrganizations();
  }
  if (tab === 'rent') {
    await fetchRentProperties();
  }
}

async function fetchRentProperties() {
  // Check cache first
  const cacheKey = `rent_properties_${entity.value.id}`;
  const cachedData = get(cacheKey);
  
  if (cachedData) {
    console.log('Using cached rent properties data');
    rentProperties.value = cachedData;
    filteredRentProperties.value = rentProperties.value;
    return;
  }
  
  try {
    const res = await useApi("/pay-center-properties");
    if (res.success && res.data) {
  // Шинэ backend structure: { success, data: [...] }
      const items = Array.isArray(res.data) ? res.data : [];
      const filteredItems = items.filter((item: any) => Number(item.pay_center_id) === Number(entity.value.id));
      
      rentProperties.value = filteredItems;
  filteredRentProperties.value = rentProperties.value; // Эхлээд бүх түрээсийг харуулах
      
      // Cache the result
      set(cacheKey, filteredItems);
      console.log('Cached rent properties data');
    }
  } catch (error) {
    console.error('Error fetching rent properties:', error);
    rentProperties.value = [];
    filteredRentProperties.value = [];
  }
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

// Modal functions
function openDetailModal(mrchRegno: string) {
  selectedMrchRegno.value = mrchRegno;
  detailModalOpen.value = true;
}

function closeDetailModal() {
  detailModalOpen.value = false;
  selectedMrchRegno.value = '';
}

// Event listener functions
function handleClickOutside(e: Event) {
  const target = e.target as HTMLElement;
  if (!target.closest('.floor-dropdown-group')) {
    showDropdown.value = false;
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    showDropdown.value = false;
  }
}

onMounted(() => {
  fetchEntity();
  fetchFloors();
  
  // Dropdown-г гаднаас дарж хаах
  document.addEventListener('click', handleClickOutside);
  
  // ESC товчлуураар dropdown хаах
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // Cleanup event listeners
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});

defineExpose({ activeTab, setActiveTab });
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
.floor-dropdown-group {
  position: relative;
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

/* Custom dropdown styles */
.floor-dropdown-group .dropdown-menu.show {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
}

.floor-dropdown-group .dropdown-menu {
  min-width: 150px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border-radius: 4px;
}

.floor-dropdown-group .dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.floor-dropdown-group .dropdown-item:hover {
  background-color: #f8f9fa;
}

/* Rotate animation for dropdown arrow */
.floor-dropdown-group .las.rotate {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.floor-dropdown-group .las {
  transition: transform 0.3s ease;
}
</style>
