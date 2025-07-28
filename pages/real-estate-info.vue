<template>
  <NuxtLayout>
    <template #sidebar>
      <TheMenu />
    </template>
    <div class="page-wrapper">
      <div class="page-content">
        <div class="container-fluid" style="overflow-x: hidden; max-width: 100vw;">
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
                <button @click="fetchAllData" class="btn btn-sm btn-outline-danger ms-2">Дахин оролдох</button>
              </div>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div v-if="!statisticsLoading && !error" class="row">
            <!-- Total Real Estate Count -->
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card stats-card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-lg bg-primary-subtle rounded-circle">
                        <i class="iconoir-home text-primary fs-24"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-1 text-muted fs-14">Нийт үл хөдлөхийн тоо</h6>
                      <h4 class="mb-0 fw-bold">{{ formatNumber(statistics.totalCount) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Real Estate Size -->
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card stats-card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-lg bg-success-subtle rounded-circle">
                        <i class="iconoir-expand text-success fs-24"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-1 text-muted fs-14">Нийт үл хөдлөхийн хэмжээ</h6>
                      <h4 class="mb-0 fw-bold">{{ formatNumber(statistics.totalSize) }} м²</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Real Estate Value -->
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card stats-card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-lg bg-warning-subtle rounded-circle">
                        <i class="iconoir-coins text-warning fs-24"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-1 text-muted fs-14">Нийт үл хөдлөхийн үнэлгээ</h6>
                      <h4 class="mb-0 fw-bold">{{ formatNumber(statistics.totalValue) }}₮</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Average Price Per SqM -->
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card stats-card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-lg bg-info-subtle rounded-circle">
                        <i class="iconoir-calculator text-info fs-24"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-1 text-muted fs-14">Дундаж мвк-ийн үнэлгээ</h6>
                      <h4 class="mb-0 fw-bold">{{ formatNumber(statistics.avgPricePerSqm) }}₮</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Statistics Cards -->
          <div v-if="!statisticsLoading && !error" class="row">
            <!-- Total Payment Amount -->
            <div class="col-lg-6 col-md-6 mb-3">
              <div class="card stats-card payment-card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-lg bg-danger-subtle rounded-circle">
                        <i class="iconoir-wallet text-danger fs-24"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-1 text-muted fs-14">Нийт үл хөдлөхийн татвар төлөлт</h6>
                      <h4 class="mb-0 fw-bold text-danger">{{ formatNumber(paymentStats.totalAmount) }}₮</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Payment Count -->
            <div class="col-lg-6 col-md-6 mb-3">
              <div class="card stats-card payment-card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar-lg bg-purple-subtle rounded-circle">
                        <i class="iconoir-receipt text-purple fs-24"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-1 text-muted fs-14">Нийт төлөлтийн тоо</h6>
                      <h4 class="mb-0 fw-bold text-purple">{{ formatNumber(paymentStats.totalCount) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div v-if="!statisticsLoading && !error" class="row mt-2">
            <!-- Real Estate Count by District Chart -->
            <div class="col-xl-6 col-lg-12 mb-3">
              <div class="card chart-card">
                <div class="card-header chart-header">
                  <h5 class="card-title mb-0">
                    <i class="iconoir-stats-up-square text-primary me-2"></i>
                    Дүүрэг бүрт бүртгэлтэй үл хөдлөхийн тоо
                  </h5>
                </div>
                <div class="card-body">
                  <apexchart
                    v-if="districtCountChart.series.length > 0"
                    type="bar"
                    height="300"
                    :options="districtCountChart.options"
                    :series="districtCountChart.series"
                  />
                  <div v-else class="text-center py-4">
                    <i class="iconoir-database text-muted fs-36 mb-2"></i>
                    <p class="text-muted mb-0">Мэдээлэл олдсонгүй</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Real Estate Area by District Chart -->
            <div class="col-xl-6 col-lg-12 mb-3">
              <div class="card chart-card">
                <div class="card-header chart-header">
                  <h5 class="card-title mb-0">
                    <i class="iconoir-expand text-success me-2"></i>
                    Үл хөдлөхийн талбай дүүрэгээр
                  </h5>
                </div>
                <div class="card-body">
                  <apexchart
                    v-if="districtAreaChart.series.length > 0"
                    type="bar"
                    height="300"
                    :options="districtAreaChart.options"
                    :series="districtAreaChart.series"
                  />
                  <div v-else class="text-center py-4">
                    <i class="iconoir-database text-muted fs-36 mb-2"></i>
                    <p class="text-muted mb-0">Мэдээлэл олдсонгүй</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Charts Section -->
          <div v-if="!statisticsLoading && !error" class="row mt-2">
            <!-- Payment Distribution Pie Chart -->
            <div class="col-12">
              <div class="card chart-card">
                <div class="card-header chart-header">
                  <h5 class="card-title mb-0">
                    <i class="iconoir-pie-chart text-warning me-2"></i>
                    Нийт үл хөдлөхийн төлөлтийн тархалт
                  </h5>
                </div>
                <div class="card-body">
                  <apexchart
                    v-if="paymentDistributionChart.series.length > 0"
                    type="pie"
                    height="350"
                    :options="paymentDistributionChart.options"
                    :series="paymentDistributionChart.series"
                  />
                  <div v-else class="text-center py-4">
                    <i class="iconoir-database text-muted fs-36 mb-2"></i>
                    <p class="text-muted mb-0">Төлөлтийн мэдээлэл олдсонгүй</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Real Estate Data Table -->
          <div v-if="!statisticsLoading && !error" class="row mt-4">
            <div class="col-12">
              <div class="card table-card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col">
                      <h5 class="card-title mb-0">
                        <i class="iconoir-table text-info me-2"></i>
                        Үл хөдлөх хөрөнгийн жагсаалт
                      </h5>
                    </div>
                    <div class="col-auto">
                      <div class="input-group input-group-sm">
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
                <div class="card-body p-0">
                  <!-- Table Loading -->
                  <div v-if="dataLoading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Мэдээлэл ачаалж байна...</span>
                    </div>
                    <p class="mt-2 text-muted">Мэдээлэл ачаалж байна...</p>
                  </div>

                  <!-- Table Data -->
                  <div v-else-if="realEstateData.records && realEstateData.records.length > 0">
                    <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                      <table class="table table-striped table-hover table-sm mb-0">
                        <thead class="table-dark sticky-top">
                          <tr>
                            <th style="min-width: 50px;" class="text-center">#</th>
                            <th style="min-width: 100px;">Регистер</th>
                            <th style="min-width: 120px;">Эзэмшигчийн нэр</th>
                            <th style="min-width: 80px;">ҮХ дугаар</th>
                            <th style="min-width: 80px;" class="text-end">Хэмжээ (м²)</th>
                            <th style="min-width: 90px;" class="text-end">Үнэлгээ (₮)</th>
                            <th style="min-width: 150px;">Хаяг</th>
                            <th style="min-width: 70px;">Төрөл</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in realEstateData.records" :key="item.reg_num">
                            <td class="text-center small">{{ (realEstateData.current_page - 1) * realEstateData.page_size + index + 1 }}</td>
                            <td class="small" :title="item.reg_num">{{ truncateText(item.reg_num, 12) || '-' }}</td>
                            <td class="small" :title="item.owner_name">{{ truncateText(item.owner_name, 15) || '-' }}</td>
                            <td class="small" :title="item.property_number">{{ truncateText(item.property_number, 10) || '-' }}</td>
                            <td class="text-end small">{{ formatNumber(item.property_size) }}</td>
                            <td class="text-end small">{{ formatShortNumber(item.property_value) }}</td>
                            <td class="small" :title="item.full_address">{{ truncateText(item.full_address, 20) || '-' }}</td>
                            <td>
                              <span class="badge bg-primary-subtle text-primary small">
                                {{ truncateText(item.property_type, 8) || '-' }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Pagination -->
                    <div class="card-footer bg-light">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <span class="text-muted small">
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
                  </div>

                  <!-- No Data -->
                  <div v-else class="text-center py-5">
                    <i class="iconoir-database text-muted fs-48 mb-3"></i>
                    <p class="text-muted mb-0">Мэдээлэл олдсонгүй</p>
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

interface PaymentStatistics {
  totalAmount: number
  totalCount: number
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

interface DistrictData {
  branch_id: string
  district_name: string
  property_count: number
  total_area: number
}

interface PaymentDistribution {
  branch_id: string
  district_name: string
  total_amount: number
  payment_count: number
}

// Reactive data
const statisticsLoading = ref(true)
const dataLoading = ref(false)
const error = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const searchDebounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const districtData = ref<DistrictData[]>([])
const paymentDistribution = ref<PaymentDistribution[]>([])

const statistics = ref<RealEstateStatistics>({
  totalCount: 0,
  totalSize: 0,
  totalValue: 0,
  avgPricePerSqm: 0
})

const paymentStats = ref<PaymentStatistics>({
  totalAmount: 0,
  totalCount: 0
})

const realEstateData = ref<RealEstateData>({
  records: [],
  total_records: 0,
  total_pages: 0,
  current_page: 1,
  page_size: 30
})

// Colors for charts
const chartColors = {
  primary: ['#3B82F6', '#1E40AF', '#1D4ED8', '#2563EB'],
  success: ['#10B981', '#059669', '#047857', '#065F46'],
  warning: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
  danger: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
  info: ['#06B6D4', '#0891B2', '#0E7490', '#155E75'],
  purple: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'],
  gradient: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'],
  pie: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055'
  ]
}

// Chart configurations
const districtCountChart = computed(() => ({
  series: [{
    name: 'Үл хөдлөхийн тоо',
    data: districtData.value.map(item => item.property_count)
  }],
  options: {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: chartColors.primary,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: districtData.value.map(item => item.district_name),
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Үл хөдлөхийн тоо',
        style: {
          fontSize: '14px'
        }
      },
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    fill: {
      opacity: 0.9,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#1E40AF'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + ' үл хөдлөх'
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  }
}))

const districtAreaChart = computed(() => ({
  series: [{
    name: 'Нийт талбай (м²)',
    data: districtData.value.map(item => Math.round(item.total_area))
  }],
  options: {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: chartColors.success,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: districtData.value.map(item => item.district_name),
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Нийт талбай (м²)',
        style: {
          fontSize: '14px'
        }
      },
      labels: {
        style: {
          fontSize: '12px'
        },
        formatter: function (val: number) {
          return formatNumber(val)
        }
      }
    },
    fill: {
      opacity: 0.9,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#047857'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return formatNumber(val) + ' м²'
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  }
}))

const paymentDistributionChart = computed(() => ({
  series: paymentDistribution.value.map(item => item.total_amount),
  options: {
    chart: {
      type: 'pie',
      height: 350,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    labels: paymentDistribution.value.map(item => item.district_name),
    colors: chartColors.pie,
    dataLabels: {
      enabled: true,
      formatter: function(val: number, opts: any) {
        return paymentDistribution.value[opts.seriesIndex]?.district_name + "\n" + val.toFixed(1) + "%"
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '30%'
        },
        expandOnClick: true
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return formatNumber(val) + '₮'
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 350
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }
}))

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

function formatShortNumber(num: number | null | undefined): string {
  if (num === undefined || num === null || isNaN(num)) return '0'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return formatNumber(num)
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

async function fetchStatistics() {
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
    }
  } catch (err) {
    console.error('Error fetching statistics:', err)
    throw err
  }
}

async function fetchPaymentStats() {
  try {
    const response = await useApi('/real-estate/payments')
    if (response.success && response.data) {
      const data = response.data as any
      paymentStats.value = {
        totalAmount: data.total_payment_amount || 0,
        totalCount: data.total_payment_count || 0
      }
    }
  } catch (err) {
    console.error('Error fetching payment statistics:', err)
    throw err
  }
}

async function fetchDistrictData() {
  try {
    const response = await useApi('/real-estate/by-district')
    if (response.success && response.data) {
      districtData.value = response.data as DistrictData[]
    }
  } catch (err) {
    console.error('Error fetching district data:', err)
    throw err
  }
}

async function fetchPaymentDistribution() {
  try {
    const response = await useApi('/real-estate/payments-by-district')
    if (response.success && response.data) {
      paymentDistribution.value = response.data as PaymentDistribution[]
    }
  } catch (err) {
    console.error('Error fetching payment distribution:', err)
    throw err
  }
}

async function fetchRealEstateData(page: number = 1, search: string = '') {
  dataLoading.value = true
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '30'
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
        page_size: 30
      }
    }
  } catch (err) {
    console.error('Error fetching real estate data:', err)
    realEstateData.value = {
      records: [],
      total_records: 0,
      total_pages: 0,
      current_page: 1,
      page_size: 30
    }
  } finally {
    dataLoading.value = false
  }
}

async function fetchAllData() {
  statisticsLoading.value = true
  error.value = ''
  
  try {
    await Promise.all([
      fetchStatistics(),
      fetchPaymentStats(),
      fetchDistrictData(),
      fetchPaymentDistribution(),
      fetchRealEstateData()
    ])
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Серверт холбогдоход алдаа гарлаа'
  } finally {
    statisticsLoading.value = false
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
  await fetchAllData()
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
.stats-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.payment-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-left: 4px solid #dc3545;
}

.chart-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.chart-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem;
}

.table-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.avatar-lg {
  height: 3.5rem;
  width: 3.5rem;
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
  background-color: rgba(139, 92, 246, 0.1) !important;
}

.text-purple {
  color: #8B5CF6 !important;
}

.table-responsive {
  border-radius: 8px;
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
  border-color: #f1f3f4;
  max-width: 150px;
}

.table td.small, .table th.small {
  max-width: 120px;
}

.table-sm {
  font-size: 0.875rem;
}

.table-sm th,
.table-sm td {
  padding: 0.75rem 0.5rem;
  vertical-align: middle;
}

.table-dark th {
  background-color: #495057 !important;
  border-color: #6c757d !important;
}

.input-group-sm .form-control {
  min-width: 250px;
  border-radius: 6px;
}

.pagination .page-link {
  min-width: 35px;
  text-align: center;
  border-radius: 6px;
  margin: 0 2px;
  border: 1px solid #e9ecef;
}

.pagination .page-link:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.fs-48 {
  font-size: 3rem !important;
}

.fs-36 {
  font-size: 2.25rem !important;
}

.fs-24 {
  font-size: 1.5rem !important;
}

.fs-14 {
  font-size: 0.875rem !important;
}

.small {
  font-size: 0.8rem !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .avatar-lg {
    height: 2.5rem;
    width: 2.5rem;
  }
  
  .fs-24 {
    font-size: 1.25rem !important;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .chart-header {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .table-responsive {
    font-size: 0.75rem;
  }
  
  .input-group-sm .form-control {
    min-width: 200px;
  }
  
  .pagination .page-link {
    min-width: 30px;
    padding: 0.25rem 0.5rem;
  }
}

.badge {
  padding: 0.5em 0.75em;
  border-radius: 6px;
}

.btn {
  border-radius: 6px;
}

.alert {
  border-radius: 8px;
  border: none;
}

.breadcrumb-item a {
  color: #6c757d;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #495057;
}

/* Page width controls */
.page-wrapper {
  overflow-x: hidden;
  max-width: 100vw;
}

.page-content {
  overflow-x: hidden;
}

.container-fluid {
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}
</style> 