<template>
  <NuxtLayout>
    <template #sidebar>
      <TheMenu />
    </template>
    <div class="page-wrapper">
      <div class="page-content">
        <div class="container-fluid">
          <!-- Page Title -->
          <div class="row">
            <div class="col-sm-12">
              <div class="page-title-box d-md-flex justify-content-md-between align-items-center">
                <h4 class="page-title">Үл хөдлөх хөрөнгийн мэдээлэл</h4>
                <div class="">
                  <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                    <li class="breadcrumb-item active">Үл хөдлөх хөрөнгийн мэдээлэл</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="statisticsLoading" class="row">
            <div class="col-12">
              <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Ачаалж байна...</span>
                </div>
                <p class="mt-2">Статистик мэдээлэл ачаалж байна...</p>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-if="error" class="row">
            <div class="col-12">
              <div class="alert alert-danger" role="alert">
                <strong>Алдаа!</strong> {{ error }}
                <button @click="fetchStatistics" class="btn btn-sm btn-outline-danger ms-2">Дахин оролдох</button>
              </div>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div v-if="!statisticsLoading && !error" class="row">
            <!-- Total Real Estate Count -->
            <div class="col-lg-3 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-primary-subtle rounded">
                        <i class="iconoir-home text-primary fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт үл хөдлөхийн тоо</h6>
                      <h4 class="mb-0">{{ formatNumber(statistics.totalCount) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Real Estate Size -->
            <div class="col-lg-3 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-success-subtle rounded">
                        <i class="iconoir-expand text-success fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт үл хөдлөхийн хэмжээ</h6>
                      <h4 class="mb-0">{{ formatNumber(statistics.totalSize) }} м²</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Real Estate Value -->
            <div class="col-lg-3 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-warning-subtle rounded">
                        <i class="iconoir-coins text-warning fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт үл хөдлөхийн үнэлгээ</h6>
                      <h4 class="mb-0">{{ formatNumber(statistics.totalValue) }}₮</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Average Price Per SqM -->
            <div class="col-lg-3 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-info-subtle rounded">
                        <i class="iconoir-calculator text-info fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Дундаж мвк-ийн үнэлгээ</h6>
                      <h4 class="mb-0">{{ formatNumber(statistics.avgPricePerSqm) }}₮</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Real Estate Data Table -->
          <div v-if="!statisticsLoading && !error" class="row mt-4">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h5 class="card-title mb-0">Үл хөдлөх хөрөнгийн жагсаалт</h5>
                    </div>
                    <div class="col-auto">
                      <div class="input-group">
                        <input 
                          type="text" 
                          v-model="searchTerm" 
                          @input="handleSearch"
                          placeholder="Регистерийн дугаараар хайх..." 
                          class="form-control"
                        >
                        <button class="btn btn-outline-secondary" type="button" @click="clearSearch">
                          <i class="iconoir-refresh"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <!-- Table Loading -->
                  <div v-if="dataLoading" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Мэдээлэл ачаалж байна...</span>
                    </div>
                    <p class="mt-2">Мэдээлэл ачаалж байна...</p>
                  </div>

                  <!-- Table Data -->
                  <div v-else-if="realEstateData.records && realEstateData.records.length > 0">
                    <div class="table-responsive" style="max-height: 600px; overflow-y: auto;">
                      <table class="table table-striped table-hover">
                        <thead class="table-dark sticky-top">
                          <tr>
                            <th style="min-width: 120px;">#</th>
                            <th style="min-width: 150px;">Регистер</th>
                            <th style="min-width: 200px;">Эзэмшигчийн нэр</th>
                            <th style="min-width: 150px;">ҮХ дугаар</th>
                            <th style="min-width: 120px;">Хэмжээ (м²)</th>
                            <th style="min-width: 150px;">Үнэлгээ (₮)</th>
                            <th style="min-width: 300px;">Хаяг</th>
                            <th style="min-width: 150px;">Төрөл</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in realEstateData.records" :key="item.reg_num">
                            <td>{{ (realEstateData.current_page - 1) * realEstateData.page_size + index + 1 }}</td>
                            <td>{{ item.reg_num || '-' }}</td>
                            <td>{{ item.owner_name || '-' }}</td>
                            <td>{{ item.property_number || '-' }}</td>
                            <td class="text-end">{{ formatNumber(item.property_size) }}</td>
                            <td class="text-end">{{ formatNumber(item.property_value) }}</td>
                            <td>{{ item.full_address || '-' }}</td>
                            <td>{{ item.property_type || '-' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Pagination -->
                    <div class="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span class="text-muted">
                          Нийт {{ formatNumber(realEstateData.total_records) }} бичлэгээс 
                          {{ (realEstateData.current_page - 1) * realEstateData.page_size + 1 }}-{{ Math.min(realEstateData.current_page * realEstateData.page_size, realEstateData.total_records) }} харуулж байна
                        </span>
                      </div>
                      <nav>
                        <ul class="pagination pagination-sm mb-0">
                          <li class="page-item" :class="{ disabled: realEstateData.current_page <= 1 }">
                            <button class="page-link" @click="changePage(realEstateData.current_page - 1)" :disabled="realEstateData.current_page <= 1">
                              <i class="iconoir-nav-arrow-left"></i>
                            </button>
                          </li>
                          <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === realEstateData.current_page }">
                            <button class="page-link" @click="changePage(page)">{{ page }}</button>
                          </li>
                          <li class="page-item" :class="{ disabled: realEstateData.current_page >= realEstateData.total_pages }">
                            <button class="page-link" @click="changePage(realEstateData.current_page + 1)" :disabled="realEstateData.current_page >= realEstateData.total_pages">
                              <i class="iconoir-nav-arrow-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>

                  <!-- No Data -->
                  <div v-else class="text-center py-4">
                    <p class="text-muted">Мэдээлэл олдсонгүй</p>
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
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi'
import { useHead } from "@unhead/vue"

// Interfaces
interface RealEstateStatistics {
  totalCount: number
  totalSize: number
  totalValue: number
  avgPricePerSqm: number
}

interface RealEstateRecord {
  reg_num: string
  owner_name: string
  property_number: string
  property_size: number
  property_value: number
  full_address: string
  property_type: string
}

interface RealEstateData {
  records: RealEstateRecord[]
  total_records: number
  total_pages: number
  current_page: number
  page_size: number
}

// Reactive data
const statisticsLoading = ref(true)
const dataLoading = ref(false)
const error = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const searchDebounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const statistics = ref<RealEstateStatistics>({
  totalCount: 0,
  totalSize: 0,
  totalValue: 0,
  avgPricePerSqm: 0
})

const realEstateData = ref<RealEstateData>({
  records: [],
  total_records: 0,
  total_pages: 0,
  current_page: 1,
  page_size: 50
})

// Computed
const visiblePages = computed(() => {
  const totalPages = realEstateData.value.total_pages
  const current = realEstateData.value.current_page
  const delta = 2
  const range: number[] = []

  const start = Math.max(1, current - delta)
  const end = Math.min(totalPages, current + delta)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
})

// Methods
function formatNumber(num: number | null | undefined): string {
  if (num === undefined || num === null || isNaN(num)) return '0'
  return Number(num).toLocaleString('en-US')
}

async function fetchStatistics() {
  statisticsLoading.value = true
  error.value = ''
  
  try {
    const response = await useApi('/real-estate/statistics')
    if (response.success && response.data) {
      const data = response.data as any
      statistics.value = {
        totalCount: data.total_count || 0,
        totalSize: data.total_size || 0,
        totalValue: data.total_value || 0,
        avgPricePerSqm: data.avg_price_per_sqm || 0
      }
    } else {
      error.value = 'Статистик мэдээлэл авахад алдаа гарлаа'
    }
  } catch (err) {
    console.error('Error fetching statistics:', err)
    error.value = 'Серверт холбогдоход алдаа гарлаа'
  } finally {
    statisticsLoading.value = false
  }
}

async function fetchRealEstateData(page: number = 1, search: string = '') {
  dataLoading.value = true
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '50'
    })
    
    if (search.trim()) {
      params.append('search', search.trim())
    }
    
    const response = await useApi(`/real-estate/data?${params.toString()}`)
    if (response.success && response.data) {
      realEstateData.value = response.data as RealEstateData
    } else {
      console.error('Real estate data API response error:', response)
      realEstateData.value = {
        records: [],
        total_records: 0,
        total_pages: 0,
        current_page: 1,
        page_size: 50
      }
    }
  } catch (err) {
    console.error('Error fetching real estate data:', err)
    realEstateData.value = {
      records: [],
      total_records: 0,
      total_pages: 0,
      current_page: 1,
      page_size: 50
    }
  } finally {
    dataLoading.value = false
  }
}

function handleSearch() {
  // Clear existing timer
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }
  
  // Set new timer for debounced search
  searchDebounceTimer.value = setTimeout(() => {
    currentPage.value = 1
    fetchRealEstateData(1, searchTerm.value)
  }, 500)
}

function clearSearch() {
  searchTerm.value = ''
  currentPage.value = 1
  fetchRealEstateData(1, '')
}

function changePage(page: number) {
  if (page >= 1 && page <= realEstateData.value.total_pages) {
    currentPage.value = page
    fetchRealEstateData(page, searchTerm.value)
  }
}

// Lifecycle
onMounted(async () => {
  await fetchStatistics()
  await fetchRealEstateData()
})

// Meta
useHead({
  title: 'Үл хөдлөх хөрөнгийн мэдээлэл - МТА-НТГ',
  script: [
    { src: "/assets/js/app.js" },
    { src: "/assets/js/baatars.js" }
  ]
})
</script>

<style scoped>
.avatar-sm {
  height: 3rem;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-subtle {
  background-color: rgba(59, 130, 246, 0.1) !important;
}

.bg-success-subtle {
  background-color: rgba(16, 185, 129, 0.1) !important;
}

.bg-warning-subtle {
  background-color: rgba(245, 158, 11, 0.1) !important;
}

.bg-info-subtle {
  background-color: rgba(6, 182, 212, 0.1) !important;
}

.table-responsive {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 10;
}

.table td, .table th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-group {
  min-width: 300px;
}

.pagination .page-link {
  min-width: 40px;
  text-align: center;
}
</style> 