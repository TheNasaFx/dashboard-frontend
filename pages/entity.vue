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
                  <p class="fs-12 text-muted">Нэгж талбарын дугаар: {{ entity.parcel_id || '-' }}</p>
                  <p class="fs-12 text-muted">Давхарын тоо: {{ entity.build_floor || 0 }}</p>
                  
                  <!-- Map мэдээлэл -->
                  <div v-if="mapData" class="mt-3">
                    <div class="row text-center">
                      <div class="col-4 mb-2">
                        <div class="border rounded p-2">
                          <div class="fs-14 fw-bold text-primary">{{ mapData.owner_count || 0 }}</div>
                          <div class="fs-11 text-muted">Эзэмшигч</div>
                        </div>
                      </div>
                      <div class="col-4 mb-2">
                        <div class="border rounded p-2">
                          <div class="fs-14 fw-bold text-success">{{ mapData.activity_operators || 0 }}</div>
                          <div class="fs-11 text-muted">Үйл ажиллагаа эрхлэгч байгууллагууд</div>
                        </div>
                      </div>
                      <div class="col-4 mb-2">
                        <div class="border rounded p-2">
                          <div class="fs-14 fw-bold text-warning">{{ mapData.tenants || 0 }}</div>
                          <div class="fs-11 text-muted">Түрээслэгч</div>
                        </div>
                      </div>
                      <div class="col-4 mb-2">
                        <div class="border rounded p-2">
                          <div class="fs-14 fw-bold text-warning">{{ Math.floor(mapData.activity_operators - mapData.tenants) || 0 }}</div>
                          <div class="fs-11 text-muted">Давхар түрээслэгч</div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="border rounded p-2">
                          <div class="fs-14 fw-bold text-secondary">{{ formatNumber(mapData.land_area || 0) }}</div>
                          <div class="fs-11 text-muted">Газрын талбай (мкв)</div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="border rounded p-2">
                          <div class="fs-14 fw-bold text-info">{{ formatNumber(mapData.area || 0) }}</div>
                          <div class="fs-11 text-muted">Ашиглагдаж байгаа талбай (мкв)</div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="border rounded p-2">
                          <div class="fs-14 fw-bold text-dark">{{ formatNumber(mapData.unused_area || 0) }}</div>
                          <div class="fs-11 text-muted">Ашиглагдаагүй талбай (мкв)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p class="card-text"></p>
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
                  <button
                    type="button"
                    class="btn btn-primary btn-sm ms-2"
                    :class="{ active: activeTab === 'reports' }"
                    @click="setActiveTab('reports')"
                  >
                    Чиглэлийн бүртгэл
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

          <!-- Татвар төлөгчдийн ангилал - доод талд хэвтээ байдлаар -->
          <div class="row mb-4">
            <!-- Сайн татвар төлөгч -->
            <div class="col-lg-4 col-md-4 mb-3">
              <div class="card bg-success text-white h-100">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-smile fa-2x me-2"></i>
                    <div>
                      <h6 class="card-title mb-0">Сайн татвар төлөгч</h6>
                      <small class="opacity-75">TTToo-10</small>
                    </div>
                  </div>
                  <div class="small">
                    <div>1.Бүртгэл</div>
                    <div>2.И-Баримт</div>
                    <div>3.Зөвшөөрлийн мэдээ (НӨАТ, НХАТ,ОАТ)</div>
                    <div>4.Тайлан</div>
                    <div>5.Төлөлт</div>
                    <div>6.Өрийн үлдэгдэл</div>
                    <div>7.Хөрөнгийн мэдээлэл</div>
                    <div>8.Туслан зөвлөх үйлчилгээ</div>
                    <div>9.Зөрчийн мэдээлэл</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Туслага хэрэгтэй -->
            <div class="col-lg-4 col-md-4 mb-3">
              <div class="card bg-warning text-dark h-100">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-meh fa-2x me-2"></i>
                    <div>
                      <h6 class="card-title mb-0">Тусламж хэрэгтэй татвар төлөгч</h6>
                      <small class="opacity-75">TTToo-10</small>
                    </div>
                  </div>
                  <div class="small">
                    <div>1.Бүртгэл</div>
                    <div>2.И-Баримт -5</div>
                    <div>3.Зөвшөөрлийн мэдээ (НӨАТ, НХАТ,ОАТ)</div>
                    <div>4.Тайлан -2</div>
                    <div>5.Төлөлт</div>
                    <div>6.Өрийн үлдэгдэл-3</div>
                    <div>7.Хөрөнгийн мэдээлэл</div>
                    <div>8.Туслан зөвлөх үйлчилгээ</div>
                    <div>9.Зөрчийн мэдээлэл</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Асуудалтай -->
            <div class="col-lg-4 col-md-4 mb-3">
              <div class="card bg-danger text-white h-100">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center mb-2">
                    <i class="fas fa-frown fa-2x me-2"></i>
                    <div>
                      <h6 class="card-title mb-0">Асуудалтай татвар төлөгч</h6>
                      <small class="opacity-75">TTToo-10</small>
                    </div>
                    <i class="fas fa-question-circle fa-lg ms-2"></i>
                  </div>
                  <div class="small">
                    <div>1.Бүртгэл</div>
                    <div>2.И-Баримт</div>
                    <div>3.Зөвшөөрлийн мэдээ (НӨАТ, НХАТ,ОАТ) -5</div>
                    <div>4.Тайлан -2</div>
                    <div>5.Төлөлт</div>
                    <div>6.Өрийн</div>
                    <div>7.Хөрөнгийн мэдээлэл -3</div>
                    <div>8.Туслан зөвлөх үйлчилгээ</div>
                    <div>9.Зөрчийн мэдээлэл</div>
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
                  <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
                    <table class="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Тасгийн нэр (stor_name)</th>
                          <th>Регистр (mrch_regno)</th>
                          <th>Үйл ажиллагааны чиглэл (op_type_name)</th>
                          <th>Дэлгэрэнгүй</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="org in filteredOrganizations" :key="org.id">
                          <td>{{ org.stor_name }}</td>
                          <td>{{ org.mrch_regno }}</td>
                          <td>{{ org.op_type_name }}</td>
                          <td>
                            <button class="btn btn-sm btn-info" @click="openDetailModal(org.mrch_regno)">
                              Дэлгэрэнгүй
                            </button>
                          </td>
                        </tr>
                        <tr v-if="filteredOrganizations.length === 0">
                          <td colspan="4" class="text-center">
                            {{ searchQuery ? 'Хайлтад тохирох мэдээлэл олдсонгүй' : 'Мэдээлэл олдсонгүй' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                  <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
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
                  </div>
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
          
          <!-- Чиглэлийн бүртгэлийн хүснэгт -->
          <div class="row justify-content-center mt-2" v-if="activeTab === 'reports'">
            <div class="col-12">
              <div class="card mb-3">
                <div class="card-header d-flex align-items-center">
                  <h5 class="card-title mb-0 me-3">📊 Үйл ажиллагааны чиглэлийн бүртгэл</h5>
                  <div class="ms-auto">
                    <span class="badge bg-primary px-3 py-2">
                      Нийт: {{ entityReportsTotal }}
                    </span>
                  </div>
                </div>
                <div class="card-body">
                  <div v-if="entityReports.length === 0" class="text-center py-4 text-muted">
                    <i class="fas fa-chart-bar fs-1 mb-3 text-muted"></i>
                    <p>Энэ барилганд үйл ажиллагааны мэдээлэл олдсонгүй</p>
                  </div>
                  <div v-else>
                    <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
                      <table class="table table-hover table-striped">
                        <thead class="table-dark">
                          <tr>
                            <th class="text-center" style="width: 5%;">#</th>
                            <th style="width: 70%;">🏢 Үйл ажиллагааны чиглэл</th>
                            <th class="text-center" style="width: 15%;">👥 Тоо</th>
                            <th class="text-center" style="width: 10%;">📊 Хувь</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(report, index) in entityReports" :key="index">
                            <td class="text-center">{{ index + 1 }}</td>
                            <td class="fw-semibold">{{ report.op_type_name }}</td>
                            <td class="text-center">
                              <span class="badge bg-success px-3 py-1">{{ report.count }}</span>
                            </td>
                            <td class="text-center">
                              <span class="text-muted small">
                                {{ entityReportsTotal > 0 ? Math.round((report.count / entityReportsTotal) * 100) : 0 }}%
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <!-- Summary info -->
                    <div class="mt-3 p-3 bg-light rounded">
                      <div class="row text-center">
                        <div class="col-md-6">
                          <div class="border-end">
                            <h5 class="text-primary mb-1">{{ entityReports.length }}</h5>
                            <small class="text-muted">Төрлийн тоо</small>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div>
                            <h5 class="text-success mb-1">{{ entityReportsTotal }}</h5>
                            <small class="text-muted">Нийт татвар төлөгч</small>
                          </div>
                        </div>
                      </div>
                    </div>
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
                      <h4 class="card-title">Татварын алба</h4>
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
                  <client-only><EntityPolarAreaChart :centerId="entity.id" /></client-only>
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
  mapUrl: "https://www.google.com/maps/dir/?api=1&destination=47.934086900672%2C106.91685211685",
});
const activeTab = ref<string>('');
const rentProperties = ref<any[]>([]);
const searchQuery = ref('');
const filteredOrganizations = ref<any[]>([]);
const rentSearchQuery = ref('');
const filteredRentProperties = ref<any[]>([]);

// Reports functionality
const entityReports = ref<any[]>([]);
const entityReportsTotal = ref(0);

// Modal state
const detailModalOpen = ref(false);
const selectedMrchRegno = ref('');
const showDropdown = ref(false);
const showFloorModal = ref(false); // New state for floor modal

// Map data state
const mapData = ref<any>(null);

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
        parcel_id: data.parcel_id || "",
        mapUrl: entity.value.mapUrl, // Keep existing mapUrl
      };
    }
  } catch (error) {
    console.error('Error fetching entity:', error);
  }
}

async function fetchMapData() {
  const id = route.query.id;
  if (!id) return;
  
  try {
    const response = await fetch(`http://localhost:8080/api/v1/map-data?pay_center_id=${id}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      mapData.value = result.data;
    } else {
      mapData.value = {
        owner_count: 0,
        activity_operators: 0,
        area: 0,
        tenants: 0
      };
    }
  } catch (error) {
    console.error('Error fetching map data:', error);
    mapData.value = {
      owner_count: 0,
      activity_operators: 0,
      area: 0,
      tenants: 0
    };
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
    // Get organizations data only - no additional API calls
    const url = floor 
      ? `/buildings/${id}/floors/${floor}/organizations`
      : `/buildings/${id}/organizations`;
    
    // Add timeout for large data requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const res = await useApi(url, {}, false); // Disable cache for large data
      clearTimeout(timeoutId);
      
      if (res.success && res.data) {
        const orgsData = Array.isArray(res.data) ? res.data : [];
        
        // Validate organization data
        const validOrgs = orgsData.filter((org: any) => 
          org && 
          typeof org === 'object' && 
          org.id && 
          typeof org.id === 'number'
        );
        
        // Set basic organization data without additional API calls
        organizations.value = validOrgs.map((org: any) => ({
          ...org,
          // Initialize with default values - these will be loaded in detail modal
          count_receipt: 0,
          cnt_3: 0,
          cnt_30: 0,
          report_submitted_date: '',
          payment_amount: 0,
          debt_amount: 0,
          advice_count: 0
        }));
        
        filteredOrganizations.value = organizations.value;
        
        // Cache the result
        set(cacheKey, organizations.value);
        console.log(`Cached organizations data: ${organizations.value.length} organizations`);
      } else {
        console.error('Invalid response format from organizations API:', res);
        organizations.value = [];
        filteredOrganizations.value = [];
      }
    } catch (apiError) {
      clearTimeout(timeoutId);
      if (apiError instanceof Error && apiError.name === 'AbortError') {
        console.error('Organizations API request timed out');
        organizations.value = [];
        filteredOrganizations.value = [];
      } else {
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error fetching organizations:', error);
    organizations.value = [];
    filteredOrganizations.value = [];
  }
}

async function fetchEntityReports() {
  const id = route.query.id;
  if (!id) return;

  try {
    const response = await fetch(`http://localhost:8080/api/v1/reports/activity-by-pay-center/${id}`);
    const result = await response.json();
    
    if (result.success) {
      entityReports.value = Array.isArray(result.data) ? result.data : [];
      entityReportsTotal.value = result.total_count || 0;
    } else {
      console.error('Error fetching entity reports:', result.error);
      entityReports.value = [];
      entityReportsTotal.value = 0;
    }
  } catch (error) {
    console.error('Error fetching entity reports:', error);
    entityReports.value = [];
    entityReportsTotal.value = 0;
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

async function setActiveTab(tab: 'ebarimt' | 'rent' | 'reports') {
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
  if (tab === 'reports') {
    await fetchEntityReports();
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
  fetchMapData(); // Call fetchMapData here
  
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
