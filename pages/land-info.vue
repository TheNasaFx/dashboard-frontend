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
                      <h6 class="mb-0 text-muted">Нийт талбай (га)</h6>
                      <h4 class="mb-0">{{ formatNumber(totalAreaHA) }}</h4>
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
import { useHead } from "@unhead/vue"

// Define interfaces
interface LandData {
  pii: string
  au2_name: string
  area_m2: number
  area_ha: number
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
const landData = ref<LandData[]>([])
const paymentData = ref<PaymentData[]>([])
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

const totalAreaHA = computed(() => {
  return landData.value.reduce((sum, item) => sum + (item.area_ha || 0), 0)
})

// Payment statistics
const totalLandPayment = computed(() => {
  return paymentData.value.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const totalPaymentCount = computed(() => paymentData.value.length)

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
    data.area += (item.area_m2 || 0) + (item.area_ha || 0)
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

// Data fetching
async function fetchData() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Fetching land data from API...')
    
    // Land data (required)
    const landResponse = await useApi('/land-data')
    console.log('Land API response:', landResponse)
    
    if (landResponse.success && landResponse.data) {
      landData.value = Array.isArray(landResponse.data) ? landResponse.data : []
      console.log('Land data loaded:', landData.value.length, 'records')
    } else {
      error.value = 'Газрын мэдээлэл авахад алдаа гарлаа'
      console.error('Land API response error:', landResponse)
      return
    }
    
    // Payment data (optional - don't fail if this fails)
    try {
      const paymentResponse = await useApi('/land-payment-data')
      console.log('Payment API response:', paymentResponse)
      
      if (paymentResponse.success && paymentResponse.data) {
        paymentData.value = Array.isArray(paymentResponse.data) ? paymentResponse.data : []
        console.log('Payment data loaded:', paymentData.value.length, 'records')
      } else {
        console.error('Payment API response error:', paymentResponse)
        paymentData.value = []
      }
    } catch (paymentErr) {
      console.error('Error fetching payment data:', paymentErr)
      paymentData.value = []
      // Don't fail the whole page for payment data errors
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
  fetchData()
})

// Meta
useHead({
  title: 'Газрын мэдээлэл - МТА-НТГ',
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