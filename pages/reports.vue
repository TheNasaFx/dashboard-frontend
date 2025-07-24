<template>
  <NuxtLayout>
    <template #sidebar>
      <TheMenu />
    </template>
    <div class="page-wrapper">
      <div class="page-content">
        <div class="container-fluid">
          <!-- Page Header -->
          <div class="row">
            <div class="col-sm-12">
              <div class="page-title-box d-md-flex justify-content-md-between align-items-center">
                <h4 class="page-title">📊 Татварын алба тайлан</h4>
                <div class="">
                  <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                      <a href="#">МТА – НТГ</a>
                    </li>
                    <li class="breadcrumb-item active">Тайлан</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Title Card -->
          <div class="row mb-4">
            <div class="col-12">
              <div class="card border-0 shadow-sm bg-gradient-primary text-white">
                <div class="card-body text-center py-4">
                  <h4 class="fw-bold mb-3 text-white">
                    🏛️ НИЙСЛЭЛИЙН НУТАГ ДЭВСГЭРТ ҮЙЛ АЖИЛЛАГАА ЭРХЛЭГЧ
                  </h4>
                  <h5 class="fw-bold mb-3 text-white">
                    ТАТВАР ТӨЛӨГЧИЙН ҮЙЛ АЖИЛЛАГААНЫ ЧИГЛЭЛИЙН БҮРТГЭЛ
                  </h5>
                  <div class="row justify-content-center">
                    <div class="col-md-4">
                      <div class="card bg-white bg-opacity-15 border-0">
                        <div class="card-body text-center py-3">
                          <h2 class="display-5 fw-bold text-white mb-1">
                            {{ formatNumber(totalCount) }}
                          </h2>
                          <p class="mb-0 text-white-50">Нийт бүртгэлтэй</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reports Table -->
          <div class="row">
            <div class="col-12">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-bottom">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0 text-primary">
                      📈 Үйл ажиллагааны чиглэлийн тайлан
                    </h5>
                    <div class="text-muted small">
                      {{ new Date().toLocaleDateString('mn-MN') }}
                    </div>
                  </div>
                </div>
                <div class="card-body p-0">
                  <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                      <span class="visually-hidden">Уншиж байна...</span>
                    </div>
                    <p class="text-muted">Тайлангийн мэдээлэл ачааллаж байна...</p>
                  </div>

                  <div v-else-if="error" class="alert alert-danger m-3">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    {{ error }}
                  </div>

                  <div v-else class="table-responsive">
                    <table class="table table-hover mb-0">
                      <thead class="table-dark">
                        <tr>
                          <th class="fw-bold text-center" style="width: 35%;">
                            🏢 Татварын алба
                          </th>
                          <th v-for="district in districtColumns" :key="district.code" class="text-center fw-bold">
                            {{ district.name.replace(' дүүрэг', '') }}
                          </th>
                          <th class="text-center fw-bold bg-warning text-dark">
                            📊 Нийт
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(activity, index) in activityTypes" :key="index" class="border-bottom">
                          <td class="fw-semibold text-dark bg-light">
                            {{ activity.name }}
                          </td>
                          <td v-for="district in districtColumns" :key="district.code" class="text-center">
                            <span 
                              v-if="getCountForActivityAndDistrict(activity.name, district.code) > 0"
                              class="badge bg-primary-subtle text-primary px-2 py-1"
                            >
                              {{ getCountForActivityAndDistrict(activity.name, district.code) }}
                            </span>
                            <span v-else class="text-muted">-</span>
                          </td>
                          <td class="text-center">
                            <span class="badge bg-success px-3 py-2 fw-bold">
                              {{ activity.total }}
                            </span>
                          </td>
                        </tr>
                        <!-- Grand Total row -->
                        <tr class="table-warning border-top border-3">
                          <td class="fw-bold text-dark">
                             НИЙТ ДҮН
                          </td>
                          <td v-for="district in districtColumns" :key="district.code" class="text-center fw-bold">
                            <span class="badge bg-warning text-dark px-2 py-1">
                              {{ getDistrictTotal(district.code) }}
                            </span>
                          </td>
                          <td class="text-center">
                            <span class="badge bg-dark px-3 py-2 fw-bold fs-6">
                              {{ totalCount }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
import { ref, onMounted, computed } from 'vue';

interface ReportData {
  op_type_name: string;
  dist_code: number;
  dist_name: string;
  count: number;
}

interface DistrictColumn {
  code: number;
  name: string;
}

interface ActivityType {
  name: string;
  total: number;
}

const loading = ref(true);
const error = ref('');
const reportData = ref<ReportData[]>([]);
const totalCount = ref(0);

// District columns (based on DIST_CODE mapping)
const districtColumns = ref<DistrictColumn[]>([
  { code: 23, name: 'Баганууд дүүрэг' },
  { code: 24, name: 'Багахангай дүүрэг' },
  { code: 25, name: 'Сүхбаатар дүүрэг' },
  { code: 26, name: 'Баянзүрх дүүрэг' },
  { code: 27, name: 'Налайх дүүрэг' },
  { code: 28, name: 'Сонгинохайрхан дүүрэг' },
  { code: 29, name: 'Чингэлтэй дүүрэг' },
  { code: 34, name: 'Хан-Уул дүүрэг' },
  { code: 35, name: 'Баянгол дүүрэг' }
]);

// Compute unique activity types and their totals
const activityTypes = computed<ActivityType[]>(() => {
  const activityMap = new Map<string, number>();
  
  reportData.value.forEach(item => {
    const current = activityMap.get(item.op_type_name) || 0;
    activityMap.set(item.op_type_name, current + item.count);
  });

  return Array.from(activityMap.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total); // Sort by total descending
});

// Get count for specific activity and district
function getCountForActivityAndDistrict(activityName: string, districtCode: number): number {
  const item = reportData.value.find(
    r => r.op_type_name === activityName && r.dist_code === districtCode
  );
  return item ? item.count : 0;
}

// Get total for a specific district
function getDistrictTotal(districtCode: number): number {
  return reportData.value
    .filter(r => r.dist_code === districtCode)
    .reduce((sum, r) => sum + r.count, 0);
}

// Format number with thousand separators
function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Fetch reports data from API
async function fetchReports() {
  loading.value = true;
  error.value = '';
  
  try {
    // useApi-ийн оронд шууд fetch ашиглаж бүх мэдээллийг авч байна
    const response = await fetch('http://localhost:8080/api/v1/reports/activity-by-district');
    const result = await response.json();
    
    console.log('Reports API full response:', result); // Debug
    
    if (result.success) {
      reportData.value = Array.isArray(result.data) ? result.data : [];
      // Backend-аас шууд total_count авах
      totalCount.value = result.total_count || 0;
      console.log('Total count set to:', totalCount.value); // Debug
    } else {
      error.value = result.error?.message || 'Мэдээлэл авахад алдаа гарлаа';
    }
  } catch (e: any) {
    console.error('Fetch error:', e); // Debug
    error.value = e.message || 'Алдаа гарлаа';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchReports();
});
</script>

<style scoped>
/* Page Title Styling */
.page-title {
  color: #2c3e50;
  font-weight: 600;
}

/* Gradient Background for Main Card */
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

/* Table Styling */
.table {
  border: none;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.table thead th {
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 1rem 0.75rem;
}

.table tbody td {
  padding: 0.875rem 0.75rem;
  border-color: #f1f3f4;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f8f9ff;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Badge Styling */
.badge {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.bg-primary-subtle {
  background-color: #e7f3ff !important;
  color: #0366d6 !important;
  border: 1px solid #b3d9ff;
}

.badge.bg-success {
  background: linear-gradient(45deg, #28a745, #20c997) !important;
}

.badge.bg-warning {
  background: linear-gradient(45deg, #ffc107, #fd7e14) !important;
}

.badge.bg-dark {
  background: linear-gradient(45deg, #343a40, #495057) !important;
}

/* Card Enhancements */
.card {
  border-radius: 15px;
  overflow: hidden;
}

.card.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075), 
              0 0.25rem 0.5rem rgba(0, 0, 0, 0.05) !important;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
}

/* Loading Animation */
.spinner-border {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.8rem;
  }
  
  .table thead th,
  .table tbody td {
    padding: 0.5rem 0.4rem;
  }
  
  .badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
  }
  
  .display-5 {
    font-size: 2rem !important;
  }
}

@media (max-width: 576px) {
  .table thead th {
    font-size: 0.75rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}

/* District Column Names */
@media (max-width: 1200px) {
  .table th {
    font-size: 0.8rem;
    padding: 0.75rem 0.5rem;
  }
}

/* Smooth Transitions */
.card, .badge, .table tbody tr {
  transition: all 0.3s ease;
}

/* Alert Styling */
.alert {
  border-radius: 10px;
  border: none;
  font-weight: 500;
}

.alert-danger {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
}

/* Text Enhancements */
.text-primary {
  color: #667eea !important;
}

.text-muted {
  color: #6c757d !important;
}

/* Background Opacity */
.bg-opacity-15 {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

/* Border Enhancements */
.border-bottom {
  border-bottom: 1px solid #dee2e6 !important;
}

.border-top.border-3 {
  border-top: 3px solid #ffc107 !important;
}
</style> 