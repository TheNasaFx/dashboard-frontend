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
                <h4 class="page-title">Газрын мэдээлэл</h4>
                <div class="">
                  <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                    <li class="breadcrumb-item active">Газрын мэдээлэл</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="row">
            <div class="col-12">
              <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Ачаалж байна...</span>
                </div>
                <p class="mt-2">Мэдээлэл ачаалж байна...</p>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-if="error" class="row">
            <div class="col-12">
              <div class="alert alert-danger" role="alert">
                <strong>Алдаа!</strong> {{ error }}
                <button @click="fetchData" class="btn btn-sm btn-outline-danger ms-2">Дахин оролдох</button>
              </div>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div v-if="!loading && !error" class="row">
            <!-- Total Land Owners -->
            <div class="col-lg-3 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-primary-subtle rounded">
                        <i class="iconoir-user text-primary fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт газар эзэмшигчид</h6>
                      <h4 class="mb-0">{{ formatNumber(totalLandOwners) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Land Count -->
            <div class="col-lg-3 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-success-subtle rounded">
                        <i class="iconoir-globe text-success fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт газрын тоо</h6>
                      <h4 class="mb-0">{{ formatNumber(totalLandCount) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Area M2 -->
            <div class="col-lg-3 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-warning-subtle rounded">
                        <i class="iconoir-expand text-warning fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт талбай (мкв)</h6>
                      <h4 class="mb-0">{{ formatNumber(totalAreaM2) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Area HA -->
            <div class="col-lg-3 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-info-subtle rounded">
                        <i class="iconoir-map text-info fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт талбай (м²)</h6>
                      <h4 class="mb-0">{{ formatNumber(totalAreaM2) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Statistics Cards -->
          <div v-if="!loading && !error" class="row mt-4">
            <!-- Total Land Payment -->
            <div class="col-lg-6 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-danger-subtle rounded">
                        <i class="iconoir-coins text-danger fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт газрын татвар төлөлт</h6>
                      <h4 class="mb-0">{{ formatNumber(totalLandPayment) }}₮</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Payment Count -->
            <div class="col-lg-6 col-md-6">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-sm bg-purple-subtle rounded">
                        <i class="iconoir-receipt text-purple fs-20"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-0 text-muted">Нийт төлөлтийн тоо</h6>
                      <h4 class="mb-0">{{ formatNumber(totalPaymentCount) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div v-if="!loading && !error" class="row">
            <!-- Land Count by District Chart -->
            <div class="col-lg-6">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">Дүүрэг бүрт бүртгэлтэй газрын тоо</h5>
                </div>
                <div class="card-body">
                  <client-only>
                    <apexchart
                      v-if="districtLandCountChart.series.length > 0"
                      type="donut"
                      :options="districtLandCountChart.options"
                      :series="districtLandCountChart.series"
                      height="400"
                    />
                    <div v-else class="text-center py-4">
                      <p class="text-muted">Мэдээлэл байхгүй байна</p>
                    </div>
                  </client-only>
                </div>
              </div>
            </div>

            <!-- Land Area by District Chart -->
            <div class="col-lg-6">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">Газрын талбай дүүрэгээр (мкв)</h5>
                </div>
                <div class="card-body">
                  <client-only>
                    <apexchart
                      v-if="districtAreaChart.series.length > 0"
                      type="bar"
                      :options="districtAreaChart.options"
                      :series="districtAreaChart.series"
                      height="400"
                    />
                    <div v-else class="text-center py-4">
                      <p class="text-muted">Мэдээлэл байхгүй байна</p>
                    </div>
                  </client-only>
                </div>
              </div>
            </div>
          </div>

          <!-- Land Activity Types Section -->
          <div v-if="!loading && !error" class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">Газрын үйл ажиллагааны төрөл</h5>
                  <button 
                    v-if="otherActivityTypes.length > 0"
                    @click="showOtherActivities = !showOtherActivities"
                    class="btn btn-outline-primary btn-sm"
                  >
                    {{ showOtherActivities ? 'Нуух' : 'Бусад харах' }} ({{ otherActivityTypes.length }})
                  </button>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-8">
                      <client-only>
                        <apexchart
                          v-if="activityTypesChart.series.length > 0"
                          type="bar"
                          :options="activityTypesChart.options"
                          :series="activityTypesChart.series"
                          height="400"
                        />
                        <div v-else class="text-center py-4">
                          <p class="text-muted">Мэдээлэл байхгүй байна</p>
                        </div>
                      </client-only>
                    </div>
                    <div class="col-lg-4">
                      <h6 class="mb-3">Топ 10 төрөл</h6>
                      <div class="table-responsive">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th>Төрөл</th>
                              <th class="text-end">Тоо</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in top10ActivityTypes" :key="index">
                              <td class="small">{{ item.name }}</td>
                              <td class="text-end">{{ formatNumber(item.count) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- Other Activities Table -->
                  <div v-if="showOtherActivities && otherActivityTypes.length > 0" class="mt-4">
                    <hr>
                    <h6 class="mb-3">Бусад төрлүүд</h6>
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Төрөл</th>
                            <th class="text-end">Тоо</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in otherActivityTypes" :key="index">
                            <td>{{ index + 11 }}</td>
                            <td>{{ item.name }}</td>
                            <td class="text-end">{{ formatNumber(item.count) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Land Tax Payment Distribution Section -->
          <div v-if="!loading && !error && paymentData.length > 0" class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">Нийт газрын төлөлтийн тархалт</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-8">
                      <client-only>
                        <apexchart
                          v-if="paymentDistributionChart.series.length > 0"
                          type="pie"
                          :options="paymentDistributionChart.options"
                          :series="paymentDistributionChart.series"
                          height="450"
                        />
                        <div v-else class="text-center py-4">
                          <p class="text-muted">Төлөлтийн мэдээлэл байхгүй байна</p>
                        </div>
                      </client-only>
                    </div>
                    <div class="col-lg-4">
                      <h6 class="mb-3">Дүүрэг бүрийн төлөлт</h6>
                      <div class="table-responsive">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th>Дүүрэг</th>
                              <th class="text-end">Төлөлт (₮)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in paymentByDistrict.slice(0, 10)" :key="index">
                              <td class="small">{{ item.name }}</td>
                              <td class="text-end">{{ formatNumber(item.amount) }}₮</td>
                            </tr>
                          </tbody>
                        </table>
                        <div v-if="paymentByDistrict.length > 10" class="text-center mt-2">
                          <small class="text-muted">+ {{ paymentByDistrict.length - 10 }} бусад дүүрэг</small>
                        </div>
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi'
import { useCache } from '../composables/useCache'
import { useAuth } from '../composables/useAuth'

// Define interfaces
interface LandData {
  pii: string
  au2_name: string
  area_m2: number
  name: string
}

interface DistrictData {
  district: string
  count: number
  area: number
}

interface ActivityType {
  name: string
  count: number
}

interface PaymentData {
  pin: string
  au2_name: string
  branch_code: string
  branch_name: string
  sub_branch_code: string
  sub_branch_name: string
  tax_type_code: string
  tax_type_name: string
  amount: number
}

// Reactive data
const loading = ref(true)
const error = ref('')
const { requireAuth } = useAuth()
const landData = ref<LandData[]>([])
const paymentData = ref<PaymentData[]>([])
const landTaxData = ref<any>({}) // Шинэ газрын татвар төлөлтийн өгөгдөл
const showOtherActivities = ref(false)

// Computed statistics
const totalLandOwners = computed(() => {
  const uniquePiis = new Set(landData.value.map(item => item.pii))
  return uniquePiis.size
})

const totalLandCount = computed(() => landData.value.length)

const totalAreaM2 = computed(() => {
  return landData.value.reduce((sum, item) => sum + (item.area_m2 || 0), 0)
})



// Payment statistics - PAY_MARKET + V_E_TUB_PAYMENTS аас
const totalLandPayment = computed(() => {
  // Шинэ land-tax-payments API-аас ирсэн нийт дүнг ашиглана
  return landTaxData.value?.summary?.total_amount || 0
})

const totalPaymentCount = computed(() => {
  // Шинэ land-tax-payments API-аас ирсэн нийт тоог ашиглана  
  return landTaxData.value?.summary?.total_count || 0
})

// Payment data by district
const paymentByDistrict = computed(() => {
  const districts = new Map<string, number>()
  
  paymentData.value.forEach(item => {
    const district = item.branch_name || 'Тодорхойгүй'
    districts.set(district, (districts.get(district) || 0) + (item.amount || 0))
  })
  
  return Array.from(districts.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
})

// District data processing
const districtData = computed(() => {
  const districts = new Map<string, DistrictData>()
  
  landData.value.forEach(item => {
    const district = item.au2_name || 'Тодорхойгүй'
    if (!districts.has(district)) {
      districts.set(district, { district, count: 0, area: 0 })
    }
    const data = districts.get(district)!
    data.count += 1
    data.area += (item.area_m2 || 0)
  })
  
  return Array.from(districts.values()).sort((a, b) => b.count - a.count)
})

// Activity types processing
const activityTypes = computed(() => {
  const activities = new Map<string, number>()
  
  landData.value.forEach(item => {
    const activity = item.name || 'Тодорхойгүй'
    activities.set(activity, (activities.get(activity) || 0) + 1)
  })
  
  return Array.from(activities.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const top10ActivityTypes = computed(() => activityTypes.value.slice(0, 10))
const otherActivityTypes = computed(() => activityTypes.value.slice(10))

// Chart configurations
const districtLandCountChart = computed(() => ({
  series: districtData.value.map(d => d.count),
  options: {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
    },
    labels: districtData.value.map(d => d.district),
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Нийт',
              formatter: () => formatNumber(totalLandCount.value)
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => Math.round(val) + '%'
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatNumber(val) + ' газар'
      }
    }
  }
}))

const districtAreaChart = computed(() => ({
  series: [{
    name: 'Талбай (мкв)',
    data: districtData.value.map(d => Math.round(d.area))
  }],
  options: {
    chart: {
      type: 'bar',
      fontFamily: 'inherit',
      toolbar: { show: false }
    },
    colors: ['#3B82F6'],
    xaxis: {
      categories: districtData.value.map(d => d.district),
      labels: {
        rotate: -45
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatNumber(val)
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatNumber(val) + ' мкв'
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
      }
    }
  }
}))

const activityTypesChart = computed(() => ({
  series: [{
    name: 'Тоо',
    data: top10ActivityTypes.value.map(a => a.count)
  }],
  options: {
    chart: {
      type: 'bar',
      fontFamily: 'inherit',
      toolbar: { show: false }
    },
    colors: ['#10B981'],
    xaxis: {
      categories: top10ActivityTypes.value.map(a => a.name.length > 20 ? a.name.substring(0, 20) + '...' : a.name),
      labels: {
        rotate: -45
      }
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatNumber(val)
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      x: {
        formatter: (seriesName: string, opts: any) => top10ActivityTypes.value[opts.dataPointIndex]?.name || ''
      },
      y: {
        formatter: (val: number) => formatNumber(val) + ' ширхэг'
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
      }
    }
  }
}))

// Payment distribution chart
const paymentDistributionChart = computed(() => ({
  series: paymentByDistrict.value.map(d => d.amount),
  options: {
    chart: {
      type: 'pie',
      fontFamily: 'inherit',
    },
    labels: paymentByDistrict.value.map(d => d.name),
    colors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Нийт',
              formatter: () => formatNumber(totalLandPayment.value) + '₮'
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => Math.round(val) + '%'
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatNumber(val) + '₮'
      }
    }
  }
}))

// Utility functions
function formatNumber(num: number): string {
  if (num === undefined || num === null) return '0'
  return Number(num).toLocaleString('en-US')
}

// Data fetching with caching and optimization
async function fetchData() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Fetching land data from API...')
    
    // Check cache first
    const { get, set } = useCache()
    const landCacheKey = 'land_data_all'
    const paymentCacheKey = 'land_payment_data_all'
    
    // Try to get cached land data
    let cachedLandData = get(landCacheKey)
    if (cachedLandData && Array.isArray(cachedLandData)) {
      console.log('Using cached land data:', cachedLandData.length, 'records')
      landData.value = cachedLandData
    } else {
      // Fetch land data with timeout
      const landController = new AbortController()
      const landTimeoutId = setTimeout(() => landController.abort(), 30000) // 30s timeout
      
      try {
        const landResponse = await useApi('/land-data', {}, false) // No caching in useApi, we handle it here
        clearTimeout(landTimeoutId)
        
        if (landResponse.success && landResponse.data) {
          const landArray = Array.isArray(landResponse.data) ? landResponse.data : []
          landData.value = landArray
          
          // Cache for 10 minutes
          set(landCacheKey, landArray, 600000)
          console.log('Land data loaded and cached:', landArray.length, 'records')
        } else {
          error.value = 'Газрын мэдээлэл авахад алдаа гарлаа'
          console.error('Land API response error:', landResponse)
          return
        }
      } catch (landErr) {
        clearTimeout(landTimeoutId)
        if (landErr instanceof Error && landErr.name === 'AbortError') {
          error.value = 'Газрын мэдээлэл ачаалах хугацаа дууслаа. Дахин оролдоно уу.'
        } else {
          error.value = 'Газрын мэдээлэл авахад алдаа гарлаа'
        }
        console.error('Land API error:', landErr)
        return
      }
    }
    
    // Шинэ газрын татвар төлөлтийн мэдээлэл авах (PAY_MARKET + V_E_TUB_PAYMENTS)
    const landTaxCacheKey = 'land_tax_payments_summary'
    let cachedLandTaxData = get(landTaxCacheKey)
    if (cachedLandTaxData) {
      console.log('Using cached land tax data:', cachedLandTaxData)
      landTaxData.value = cachedLandTaxData
    } else {
      try {
        const landTaxController = new AbortController()
        const landTaxTimeoutId = setTimeout(() => landTaxController.abort(), 15000) // 15s timeout
        
        // Зөвхөн summary мэдээлэл авах (хурдан ажиллуулахын тулд limit=1)
        const landTaxResponse = await useApi('/land-tax-payments?page=1&limit=1', {}, false)
        clearTimeout(landTaxTimeoutId)
        
        if (landTaxResponse.success) {
          const response = landTaxResponse as any
          landTaxData.value = {
            summary: response.summary || {},
            pagination: response.pagination || {}
          }
          
          // Cache for 15 minutes
          set(landTaxCacheKey, landTaxData.value, 900000)
          console.log('Land tax data loaded and cached:', landTaxData.value.summary)
        } else {
          console.error('Land tax API response error:', landTaxResponse)
          landTaxData.value = { summary: { total_amount: 0, total_count: 0 } }
        }
      } catch (landTaxErr) {
        if (landTaxErr instanceof Error && landTaxErr.name === 'AbortError') {
          console.warn('Land tax data request timed out')
        } else {
          console.error('Error fetching land tax data:', landTaxErr)
        }
        landTaxData.value = { summary: { total_amount: 0, total_count: 0 } }
      }
    }
    
    // Try to get cached payment data
    let cachedPaymentData = get(paymentCacheKey)
    if (cachedPaymentData && Array.isArray(cachedPaymentData)) {
      console.log('Using cached payment data:', cachedPaymentData.length, 'records')
      paymentData.value = cachedPaymentData
    } else {
      // Payment data with pagination for better performance
      try {
        const paymentController = new AbortController()
        const paymentTimeoutId = setTimeout(() => paymentController.abort(), 30000) // Reduced timeout
        
        // Fetch first page with reasonable limit for dashboard overview
        const paymentResponse = await useApi('/land-payment-data?page=1&limit=5000', {}, false)
        clearTimeout(paymentTimeoutId)
        
        if (paymentResponse.success && paymentResponse.data) {
          const paymentArray = Array.isArray(paymentResponse.data) ? paymentResponse.data : []
          paymentData.value = paymentArray
          
          // Cache for 10 minutes
          set(paymentCacheKey, paymentArray, 600000)
          console.log('Payment data loaded and cached:', paymentArray.length, 'records')
          
          // Log pagination info if available (cast to any to access pagination)
          const paginatedResponse = paymentResponse as any
          if (paginatedResponse.pagination) {
            console.log('Payment pagination:', paginatedResponse.pagination)
          }
        } else {
          console.error('Payment API response error:', paymentResponse)
          paymentData.value = []
        }
      } catch (paymentErr) {
        if (paymentErr instanceof Error && paymentErr.name === 'AbortError') {
          console.warn('Payment data request timed out, continuing without payment data')
        } else {
          console.error('Error fetching payment data:', paymentErr)
        }
        paymentData.value = []
        // Don't fail the whole page for payment data errors
      }
    }
    
  } catch (err) {
    console.error('Error fetching main data:', err)
    error.value = 'Серверт холбогдоход алдаа гарлаа'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (!requireAuth()) return;
  fetchData()
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

.bg-danger-subtle {
  background-color: rgba(239, 68, 68, 0.1) !important;
}

.bg-purple-subtle {
  background-color: rgba(147, 51, 234, 0.1) !important;
}

.text-purple {
  color: #9333ea !important;
}

.table-responsive {
  max-height: 300px;
  overflow-y: auto;
}

.small {
  font-size: 0.875rem;
  max-width: 200px;
  word-break: break-word;
}
</style> 