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
                  <!-- Map Type Selection Buttons -->
                  <div class="d-flex gap-2 mb-3">
                    <button 
                      type="button" 
                      class="btn"
                      :class="mapType === 'land' ? 'btn-success' : 'btn-outline-success'"
                      @click="selectMapType('land')"
                    >
                      <i class="las la-map-marked-alt me-1"></i>
                      Газар
                    </button>
                    <button 
                      type="button" 
                      class="btn"
                      :class="mapType === 'real_estate' ? 'btn-info' : 'btn-outline-info'"
                      @click="selectMapType('real_estate')"
                    >
                      <i class="las la-building me-1"></i>
                      Үл хөдлөх хөрөнгө
                    </button>
                  </div>
                  
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
                          @click.prevent="selectDistrict('25', 'Сүхбаатар')"
                          >Сүхбаатар</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('26', 'Баянгол')"
                          >Баянгол</a
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
                          @click.prevent="selectDistrict('34', 'Сонгинохайрхан')"
                          >Сонгинохайрхан</a
                        >
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectDistrict('35', 'Чингэлтэй')"
                          >Чингэлтэй</a
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
                      <div class="dropdown-menu" style="max-height: 300px; overflow-y: auto;">
                        <a
                          v-for="khoroo in khorooList"
                          :key="khoroo.code"
                          class="dropdown-item"
                          href="#"
                          @click.prevent="selectKhoroo(khoroo.code, khoroo.name)"
                          >{{ khoroo.name }}</a
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
                      v-model="searchName"
                      @keyup.enter="filterOrganizations"
                      type="text"
                      class="form-control ms-3"
                      style="max-width: 180px;"
                      placeholder="Объектийн нэрээр хайх"
                    />
                    <input
                      v-model="searchRegno"
                      @keyup.enter="filterOrganizations"
                      type="text"
                      class="form-control ms-2"
                      style="max-width: 180px;"
                      placeholder="Регистрээр хайх"
                    />
                    <button class="btn btn-primary ms-2" @click="filterOrganizations">Хайх</button>
                    <button class="btn btn-secondary ms-1" @click="resetFilters">Цэвэрлэх</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="d-flex position-relative">
                <!-- Map Container -->
                <div class="flex-grow-1">
                  <div class="card">
                    <div class="card-body">
                      <client-only>
                        <MapView
                          :organizations="organizations || []"
                          :payCenter="payCenter || []"
                          :mapType="mapType"
                        />
                      </client-only>
                    </div>
                  </div>
                </div>
                
                <!-- Land Information Sidebar -->
                <div 
                  v-show="showLandSidebar" 
                  class="land-sidebar"
                  :class="{ 'show': showLandSidebar }"
                >
                  <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">
                        <i class="las la-map-marked-alt me-2"></i>
                        Газрын мэдээлэл
                      </h5>
                      <button 
                        class="btn btn-sm btn-outline-secondary"
                        @click="showLandSidebar = false"
                      >
                        <i class="las la-times"></i>
                      </button>
                    </div>
                    <div class="card-body p-3">
                      <!-- Loading State -->
                      <div v-if="landDataLoading" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                          <span class="visually-hidden">Ачаалж байна...</span>
                        </div>
                        <p class="mt-2 small text-muted">Газрын мэдээлэл ачаалж байна...</p>
                      </div>

                      <!-- Land Statistics -->
                      <div v-else>
                        <!-- Land Count Statistics -->
                        <div class="mb-4">
                          <h6 class="text-primary mb-3">
                            <i class="las la-map-marked-alt me-1"></i>
                            Газрын статистик
                          </h6>
                          <div class="row g-2">
                            <div class="col-6">
                              <div class="bg-light rounded p-2 text-center">
                                <div class="fs-6 fw-bold text-primary">{{ formatNumber(landStatistics.totalUniqueLands) }}</div>
                                <div class="small text-muted">Нийт газар</div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="bg-light rounded p-2 text-center">
                                <div class="fs-6 fw-bold text-success">{{ formatNumber(landStatistics.mappedLandsCount) }}</div>
                                <div class="small text-muted">Map дээрх газар</div>
                              </div>
                            </div>
                          </div>
                          <div class="mt-2">
                            <div class="d-flex justify-content-between align-items-center">
                              <span class="small text-muted">Харьцаа:</span>
                              <span class="fw-bold text-success">{{ landStatistics.mappedPercentage.toFixed(1) }}%</span>
                            </div>
                            <div class="progress mt-1" style="height: 8px;">
                              <div class="progress-bar bg-success" 
                                   :style="{ width: landStatistics.mappedPercentage + '%' }">
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Payment Statistics -->
                        <div class="mb-4">
                          <h6 class="text-warning mb-3">
                            <i class="las la-money-bill me-1"></i>
                            Газрын төлөлт
                          </h6>
                          <div class="row g-2">
                            <div class="col-12">
                              <div class="bg-light rounded p-2">
                                <div class="d-flex justify-content-between">
                                  <span class="small text-muted">Нийт дүн:</span>
                                  <span class="fw-bold text-warning">{{ formatNumber(landPayments.totalPaymentAmount) }}₮</span>
                                </div>
                                <div class="d-flex justify-content-between mt-1">
                                  <span class="small text-muted">Төлөлтийн тоо:</span>
                                  <span class="fw-bold text-info">{{ formatNumber(landPayments.totalPaymentCount) }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Payment Distribution Chart -->
                        <div v-if="landPaymentDistribution.length > 0">
                          <h6 class="text-info mb-3">
                            <i class="las la-chart-pie me-1"></i>
                            Төлөлтийн тархалт
                          </h6>
                          <div class="chart-container">
                            <client-only>
                              <apexchart
                                type="pie"
                                height="250"
                                :options="landPaymentDistributionChart.options"
                                :series="landPaymentDistributionChart.series"
                              />
                            </client-only>
                          </div>
                        </div>

                        <!-- No Data State -->
                        <div v-else-if="!landDataLoading && landPaymentDistribution.length === 0" 
                             class="text-center py-3">
                          <i class="las la-info-circle text-muted fs-3"></i>
                          <p class="small text-muted mb-0">Төлөлтийн мэдээлэл олдсонгүй</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
import { ref, onMounted, computed } from "vue";
import { useHead } from "@unhead/vue";
import StatisticsCards from "../components/StatisticsCards.vue";
import { useCache } from "../composables/useCache";
import { useApi } from "../composables/useApi";

// Interfaces for land data
interface LandStatistics {
  totalUniqueLands: number
  mappedLandsCount: number
  mappedPercentage: number
}

interface LandPayments {
  totalPaymentCount: number
  totalPaymentAmount: number
}

interface LandPaymentDistribution {
  branchId: string
  districtName: string
  totalAmount: number
  paymentCount: number
}

const { get, set } = useCache();
const selectedDistrict = ref("");
const selectedDistrictName = ref("Дүүрэг");
const selectedKhoroo = ref("");
const selectedKhorooName = ref("Хороо");
const selectedCategory = ref("");
const selectedCategoryName = ref("Ү/а чиглэл");

const searchName = ref("");
const searchRegno = ref("");
const searchedLand = ref<any[] | null>(null);
const organizations = ref<any[] | null>(null);
const mapType = ref(""); // Current map type: 'land' or 'real_estate'
const payCenter = ref<any[] | null>(null);
const showLandSidebar = ref(false); // New state for sidebar visibility

// Land data states
const landStatistics = ref<LandStatistics>({
  totalUniqueLands: 0,
  mappedLandsCount: 0,
  mappedPercentage: 0
});

const landPayments = ref<LandPayments>({
  totalPaymentCount: 0,
  totalPaymentAmount: 0
});

const landPaymentDistribution = ref<LandPaymentDistribution[]>([]);
const landDataLoading = ref(false);

// Chart colors for land data
const landChartColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3'
];

// Computed chart configuration for land payments by district
const landPaymentDistributionChart = computed(() => ({
  series: landPaymentDistribution.value.map(item => item.totalAmount),
  options: {
    chart: {
      type: 'pie',
      height: 300,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    labels: landPaymentDistribution.value.map(item => item.districtName),
    colors: landChartColors,
    dataLabels: {
      enabled: true,
      formatter: function(val: number, opts: any) {
        return landPaymentDistribution.value[opts.seriesIndex]?.districtName + "\n" + val.toFixed(1) + "%"
      },
      style: {
        fontSize: '11px',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '30%'
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      markers: {
        width: 10,
        height: 10,
        radius: 5
      },
      itemMargin: {
        horizontal: 8,
        vertical: 3
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return formatNumber(val) + '₮'
        }
      }
    }
  }
}));

// Helper function for number formatting
function formatNumber(num: number | null | undefined): string {
  if (num === undefined || num === null || isNaN(num)) return '0'
  return Number(num).toLocaleString('en-US')
}

// Khoroo list with proper formatting
const khorooList = ref([
  { code: "01", name: "01-р хороо" },
  { code: "02", name: "02-р хороо" },
  { code: "03", name: "03-р хороо" },
  { code: "04", name: "04-р хороо" },
  { code: "05", name: "05-р хороо" },
  { code: "06", name: "06-р хороо" },
  { code: "07", name: "07-р хороо" },
  { code: "08", name: "08-р хороо" },
  { code: "09", name: "09-р хороо" },
  { code: "10", name: "10-р хороо" },
  { code: "11", name: "11-р хороо" },
  { code: "12", name: "12-р хороо" },
  { code: "13", name: "13-р хороо" },
  { code: "14", name: "14-р хороо" },
  { code: "15", name: "15-р хороо" },
  { code: "16", name: "16-р хороо" },
  { code: "17", name: "17-р хороо" },
  { code: "18", name: "18-р хороо" },
  { code: "19", name: "19-р хороо" },
  { code: "20", name: "20-р хороо" },
  { code: "21", name: "21-р хороо" },
  { code: "22", name: "22-р хороо" },
  { code: "24", name: "24-р хороо" },
  { code: "25", name: "25-р хороо" },
  { code: "26", name: "26-р хороо" },
  { code: "27", name: "27-р хороо" },
  { code: "28", name: "28-р хороо" },
  { code: "29", name: "29-р хороо" },
  { code: "32", name: "32-р хороо" },
  { code: "42", name: "42-р хороо" }
]);

function selectDistrict(val: string, name: string) {
  selectedDistrict.value = val;
  selectedDistrictName.value = name;
  filterOrganizations();
}
function selectKhoroo(val: string, name: string) {
  selectedKhoroo.value = val;
  selectedKhorooName.value = name;
  filterOrganizations();
}
function selectCategory(val: string, name: string) {
  selectedCategory.value = val;
  selectedCategoryName.value = name;
  filterOrganizations();
}

async function selectMapType(type: string) {
  if (type === 'land') {
    // Toggle logic for land button
    if (mapType.value === 'land') {
      // If land is already selected, toggle sidebar and deselect
      if (showLandSidebar.value) {
        showLandSidebar.value = false;
      } else {
        mapType.value = "";
        payCenter.value = null;
      }
    } else {
      // First time selecting land - show sidebar
      mapType.value = type;
      showLandSidebar.value = true;
      await Promise.all([
        loadPayCenterData(),
        fetchLandData()
      ]);
    }
  } else if (type === 'real_estate') {
    // For real estate, hide sidebar and deselect if same type
    if (mapType.value === type) {
      mapType.value = "";
      payCenter.value = null;
    } else {
      mapType.value = type;
      payCenter.value = null;
    }
    showLandSidebar.value = false;
  } else {
    // Reset to default - show organizations only
    mapType.value = "";
    showLandSidebar.value = false;
    payCenter.value = null;
  }
}

async function loadPayCenterData() {
  try {
    console.log('Loading pay center data...');
    const res = await useApi("/pay-center-locations?grouped=true");
    if (res.success && res.data) {
      payCenter.value = res.data as any; // This will be a grouped object now
      // Keep existing organizations - don't clear them
      console.log('Pay center data loaded (grouped):', Object.keys(payCenter.value || {}).length, 'groups');
    } else {
      console.error('Failed to fetch pay center data:', res);
      payCenter.value = null;
      alert("Газрын мэдээлэл авахад алдаа гарлаа!");
    }
  } catch (error) {
    console.error('Error loading pay center data:', error);
    payCenter.value = null;
    alert("Газрын мэдээлэл авахад алдаа гарлаа!");
  }
}

// Land data fetch functions
async function fetchLandStatistics() {
  try {
    const response = await useApi('/land/statistics');
    if (response.success && response.data) {
      const data = response.data as any;
      landStatistics.value = {
        totalUniqueLands: data.total_unique_lands || 0,
        mappedLandsCount: data.mapped_lands_count || 0,
        mappedPercentage: data.mapped_percentage || 0
      };
    }
  } catch (err) {
    console.error('Error fetching land statistics:', err);
  }
}

async function fetchLandPayments() {
  try {
    const response = await useApi('/land/payments');
    if (response.success && response.data) {
      const data = response.data as any;
      landPayments.value = {
        totalPaymentCount: data.total_payment_count || 0,
        totalPaymentAmount: data.total_payment_amount || 0
      };
    }
  } catch (err) {
    console.error('Error fetching land payments:', err);
  }
}

async function fetchLandPaymentDistribution() {
  try {
    const response = await useApi('/land/payments-by-district');
    if (response.success && response.data) {
      const data = Array.isArray(response.data) ? response.data : [];
      landPaymentDistribution.value = data.map((item: any) => ({
        branchId: item.branch_id,
        districtName: item.district_name,
        totalAmount: item.total_amount,
        paymentCount: item.payment_count
      }));
    }
  } catch (err) {
    console.error('Error fetching land payment distribution:', err);
  }
}

async function fetchLandData() {
  landDataLoading.value = true;
  try {
    await Promise.all([
      fetchLandStatistics(),
      fetchLandPayments(),
      fetchLandPaymentDistribution()
    ]);
  } catch (err) {
    console.error('Error fetching land data:', err);
  } finally {
    landDataLoading.value = false;
  }
}

// Fetch organizations on page load
onMounted(async () => {
  const cacheKey = 'organizations_list';
  const cachedData = get(cacheKey);
  
  if (cachedData) {
    console.log('Using cached organizations data');
    organizations.value = cachedData;
  } else {
    console.log('Fetching organizations from API...');
    const res = await useApi("/organizations");
    if (res.success && res.data) {
      organizations.value = Array.isArray(res.data) ? res.data : [];
      set(cacheKey, organizations.value);
      console.log('Cached organizations data');
      console.log('Organizations loaded:', organizations.value.length);
    } else {
      console.error('Failed to fetch organizations:', res);
      organizations.value = [];
    }
  }
});

async function filterOrganizations() {
  // Get all organizations from cache or API
  let allOrganizations = get('organizations_list');
  
  if (!allOrganizations) {
    const res = await useApi("/organizations");
    if (res.success && res.data) {
      allOrganizations = Array.isArray(res.data) ? res.data : [];
      set('organizations_list', allOrganizations);
    } else {
      organizations.value = null;
      alert("Мэдээлэл авахад алдаа гарлаа!");
      return;
    }
  }

  // Filter locally
  let filtered = [...allOrganizations];
  
  // Filter by district (OFFICE_CODE)
  if (selectedDistrict.value) {
    filtered = filtered.filter(org => org.office_code === selectedDistrict.value);
  }
  
  // Filter by khoroo (KHO_CODE)
  if (selectedKhoroo.value) {
    filtered = filtered.filter(org => org.kho_code === selectedKhoroo.value);
  }
  
  // Filter by category (ADDRESS)
  if (selectedCategory.value) {
    filtered = filtered.filter(org => {
      if (!org.address) return false;
      const address = org.address.toLowerCase();
      const category = selectedCategory.value.toLowerCase();
      
      // Simple category matching based on address keywords
      const categoryMap: any = {
        '1': ['худалдаа', 'дэлгүүр', 'супермаркет', 'маркет'],
        '2': ['хүнс', 'ресторан', 'кафе', 'зоогий'],
        '3': ['санхүү', 'банк', 'зээл', 'даатгал'],
        '4': ['тээвэр', 'такси', 'авто', 'машин'],
        '5': ['эрүүл', 'эмнэлэг', 'клиник', 'эм'],
        '6': ['боловсрол', 'сургууль', 'цэцэрлэг', 'их сургууль']
      };
      
      const keywords = categoryMap[category] || [];
      return keywords.some((keyword: string) => address.includes(keyword));
    });
  }
  
  // Filter by name
  if (searchName.value) {
    const search = searchName.value.toLowerCase();
    filtered = filtered.filter(org => 
      org.name && org.name.toLowerCase().includes(search)
    );
  }
  
  // Filter by regno
  if (searchRegno.value) {
    const search = searchRegno.value.toLowerCase();
    filtered = filtered.filter(org => 
      org.regno && org.regno.toLowerCase().includes(search)
    );
  }
  
  if (filtered.length > 0) {
    organizations.value = filtered;
    searchedLand.value = null;
  } else {
    organizations.value = null;
    alert("Хайлтад тохирох мэдээлэл олдсонгүй!");
  }
}

async function resetFilters() {
  searchName.value = "";
  searchRegno.value = "";
  selectedDistrict.value = "";
  selectedDistrictName.value = "Дүүрэг";
  selectedKhoroo.value = "";
  selectedKhorooName.value = "Хороо";
  selectedCategory.value = "";
  selectedCategoryName.value = "Ү/а чиглэл";
  searchedLand.value = null;
  
  // Re-fetch all organizations
  const res = await useApi("/organizations");
  if (res.success && res.data) {
    organizations.value = Array.isArray(res.data) ? res.data : [];
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

<style scoped>
.land-sidebar {
  width: 0;
  max-width: 0;
  min-width: 0;
  margin-left: 0;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  transform: translateX(100%);
}

.land-sidebar.show {
  width: 400px;
  max-width: 400px;
  min-width: 350px;
  margin-left: 15px;
  opacity: 1;
  transform: translateX(0);
}

.land-sidebar .card {
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.land-sidebar .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem;
}

.land-sidebar .card-body {
  background-color: #ffffff;
  min-height: 400px;
  padding: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .land-sidebar.show {
    width: 300px;
    min-width: 300px;
  }
}

@media (max-width: 992px) {
  .land-sidebar {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
    height: 100%;
  }
  
  .land-sidebar.show {
    width: 320px;
    min-width: 320px;
    margin-left: 0;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .d-flex {
    position: relative;
    overflow: hidden;
  }
}

@media (max-width: 768px) {
  .land-sidebar.show {
    width: 280px;
    min-width: 280px;
  }
}
</style>
