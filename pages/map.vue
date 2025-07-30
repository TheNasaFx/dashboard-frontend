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
              <div class="page-title-box d-md-flex justify-content-md-between align-items-center">
                <h4 class="page-title">Татвар төлөгчид</h4>
                <div class="">
                  <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="#">МТА – НТГ</a></li>
                    <li class="breadcrumb-item"><a href="#">Татвар төлөгчид</a></li>
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
                    <button
                      type="button"
                      class="btn"
                      :class="mapType === 'ebarimt' ? 'btn-warning' : 'btn-outline-warning'"
                      @click="selectMapType('ebarimt')"
                    >
                      <i class="las la-receipt me-1"></i>
                      Е-баримт
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

                      <!-- Land Debt Statistics -->
                      <div class="mb-4">
                        <h6 class="text-danger mb-3">
                          <i class="las la-exclamation-triangle me-1"></i>
                          Газрын өр
                        </h6>
                        <div class="bg-light rounded p-3 text-center">
                          <div class="fs-5 fw-bold text-danger">{{ formatNumber(landDebtTotal) }}₮</div>
                          <div class="small text-muted">Нийт газрын өр</div>
                        </div>
                      </div>

                      <!-- Land Debt Distribution Chart -->
                      <div class="mb-4">
                        <h6 class="text-info mb-3">
                          <i class="las la-chart-bar me-1"></i>
                          Газрын өрийн тархалт (дүүрэг дүүрэгээр)
                        </h6>
                        <div v-if="landDebtDistribution.length > 0">
                          <div class="chart-container" style="height: 300px;">
                            <client-only>
                              <apexchart
                                type="bar"
                                :options="landDebtDistributionChart.options"
                                :series="landDebtDistributionChart.series"
                              />
                            </client-only>
                          </div>
                        </div>
                        <div v-else-if="!landDataLoading" class="text-center py-3">
                          <i class="las la-info-circle text-muted fs-3"></i>
                          <p class="small text-muted mb-0">Өрийн мэдээлэл олдсонгүй</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- E-Barimt Information Sidebar -->
                <div 
                  v-show="showEbarimtSidebar" 
                  class="ebarimt-sidebar"
                  :class="{ 'show': showEbarimtSidebar }"
                >
                  <div class="card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">
                        <i class="las la-receipt me-2"></i>
                        Е-баримтын статистик
                      </h5>
                      <button 
                        class="btn btn-sm btn-outline-secondary"
                        @click="showEbarimtSidebar = false"
                      >
                        <i class="las la-times"></i>
                      </button>
                    </div>
                    <div class="card-body p-3 ebarimt-scrollable-content">
                      <!-- Loading State -->
                      <div v-if="ebarimtDataLoading" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-warning" role="status">
                          <span class="visually-hidden">Ачаалж байна...</span>
                        </div>
                        <p class="mt-2 small text-muted">Е-баримтын мэдээлэл ачаалж байна...</p>
                      </div>

                      <!-- E-Barimt Statistics -->
                      <div v-else>
                        <!-- Organization Count Statistics -->
                        <div class="mb-4">
                          <h6 class="text-primary mb-3">
                            <i class="las la-building me-1"></i>
                            Байгууллагын статистик
                          </h6>
                          <div class="row g-2">
                            <div class="col-6">
                              <div class="bg-light rounded p-2 text-center">
                                <div class="fs-6 fw-bold text-primary">{{ formatNumber(ebarimtStatistics.totalOrganizations) }}</div>
                                <div class="small text-muted">Нийт байгууллага</div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="bg-light rounded p-2 text-center">
                                <div class="fs-6 fw-bold text-success">{{ formatNumber(ebarimtStatistics.organizationsWithEbarimt) }}</div>
                                <div class="small text-muted">Е-баримт гаргадаг</div>
                              </div>
                            </div>
                          </div>
                          <div class="mt-2">
                            <div class="d-flex justify-content-between align-items-center">
                              <span class="small text-muted">Харьцаа:</span>
                              <span class="fw-bold text-success">{{ ebarimtStatistics.ebarimtPercentage.toFixed(1) }}%</span>
                            </div>
                            <div class="progress mt-1" style="height: 8px;">
                              <div class="progress-bar bg-success" 
                                   :style="{ width: ebarimtStatistics.ebarimtPercentage + '%' }">
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Activity Type Charts -->
                        <div class="mb-4">
                          <div class="chart-section-header">
                            <h6 class="text-info mb-3">
                              <i class="las la-chart-bar me-1"></i>
                              Сүүлийн 3 хоногт хамгийн их е-баримт гаргасан 10 үйл ажиллагааны төрөл
                            </h6>
                            <div class="chart-summary">
                              <span class="badge bg-info">{{ formatNumber(activityTypes3Days.reduce((sum, item) => sum + item.total_count, 0)) }} нийт</span>
                            </div>
                          </div>
                          <div v-if="activityTypes3Days.length > 0">
                            <div class="chart-container" style="height: 280px;">
                              <client-only>
                                <apexchart
                                  type="bar"
                                  :options="ebarimtActivityTypes3DaysChart.options"
                                  :series="ebarimtActivityTypes3DaysChart.series"
                                />
                              </client-only>
                            </div>
                            <!-- Activity Type Summary Cards -->
                            <div class="activity-summary-cards mt-3">
                              <div class="row g-2">
                                <div v-for="(item, index) in activityTypes3Days.slice(0, 10)" :key="index" class="col-6">
                                  <div class="activity-card">
                                    <div class="activity-rank">{{ index + 1 }}</div>
                                    <div class="activity-info">
                                      <div class="activity-name">{{ item.op_type_name.length > 20 ? item.op_type_name.substring(0, 20) + '...' : item.op_type_name }}</div>
                                      <div class="activity-count">{{ formatNumber(item.total_count) }}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-center py-3">
                            <i class="las la-info-circle text-muted fs-3"></i>
                            <p class="small text-muted mb-0">3 хоногийн е-баримтын мэдээлэл олдсонгүй</p>
                          </div>
                        </div>

                        <div class="mb-4">
                          <div class="chart-section-header">
                            <h6 class="text-warning mb-3">
                              <i class="las la-chart-bar me-1"></i>
                              Сүүлийн 30 хоногт хамгийн их е-баримт гаргасан 10 үйл ажиллагааны төрөл
                            </h6>
                            <div class="chart-summary">
                              <span class="badge bg-warning">{{ formatNumber(activityTypes30Days.reduce((sum, item) => sum + item.total_count, 0)) }} нийт</span>
                            </div>
                          </div>
                          <div v-if="activityTypes30Days.length > 0">
                            <div class="chart-container" style="height: 280px;">
                              <client-only>
                                <apexchart
                                  type="bar"
                                  :options="ebarimtActivityTypes30DaysChart.options"
                                  :series="ebarimtActivityTypes30DaysChart.series"
                                />
                              </client-only>
                            </div>
                            <!-- Activity Type Summary Cards -->
                            <div class="activity-summary-cards mt-3">
                              <div class="row g-2">
                                <div v-for="(item, index) in activityTypes30Days.slice(0, 10)" :key="index" class="col-6">
                                  <div class="activity-card">
                                    <div class="activity-rank">{{ index + 1 }}</div>
                                    <div class="activity-info">
                                      <div class="activity-name">{{ item.op_type_name.length > 20 ? item.op_type_name.substring(0, 20) + '...' : item.op_type_name }}</div>
                                      <div class="activity-count">{{ formatNumber(item.total_count) }}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-center py-3">
                            <i class="las la-info-circle text-muted fs-3"></i>
                            <p class="small text-muted mb-0">30 хоногийн е-баримтын мэдээлэл олдсонгүй</p>
                          </div>
                        </div>

                        <!-- Activity Types Without E-Barimt Chart -->
                        <div class="mb-4">
                          <div class="chart-section-header">
                            <h6 class="text-danger mb-3">
                              <i class="las la-exclamation-triangle me-1"></i>
                              Е-баримт гаргадгүй хамгийн их 10 үйл ажиллагааны чиглэл
                            </h6>
                            <div class="chart-summary">
                              <span class="badge bg-danger">{{ formatNumber(activityTypesWithoutEbarimt.reduce((sum, item) => sum + item.total_count, 0)) }} нийт</span>
                            </div>
                          </div>
                          <div v-if="activityTypesWithoutEbarimt.length > 0">
                            <div class="chart-container" style="height: 280px;">
                              <client-only>
                                <apexchart
                                  type="bar"
                                  :options="ebarimtActivityTypesWithoutEbarimtChart.options"
                                  :series="ebarimtActivityTypesWithoutEbarimtChart.series"
                                />
                              </client-only>
                            </div>
                            <!-- Activity Type Summary Cards -->
                            <div class="activity-summary-cards mt-3">
                              <div class="row g-2">
                                <div v-for="(item, index) in activityTypesWithoutEbarimt.slice(0, 10)" :key="index" class="col-6">
                                  <div class="activity-card">
                                    <div class="activity-rank">{{ index + 1 }}</div>
                                    <div class="activity-info">
                                      <div class="activity-name">{{ item.op_type_name.length > 20 ? item.op_type_name.substring(0, 20) + '...' : item.op_type_name }}</div>
                                      <div class="activity-count">{{ formatNumber(item.total_count) }}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-center py-3">
                            <i class="las la-info-circle text-muted fs-3"></i>
                            <p class="small text-muted mb-0">Е-баримт гаргадгүй үйл ажиллагааны төрөл олдсонгүй</p>
                          </div>
                        </div>

                        <!-- Segment Distribution Chart -->
                        <div class="mb-4">
                          <div class="chart-section-header">
                            <h6 class="text-primary mb-3">
                              <i class="las la-chart-pie me-1"></i>
                              Е-баримт гаргадаг байгууллагын сегмент тархалт
                            </h6>
                            <div class="chart-summary">
                              <span class="badge bg-primary">{{ formatNumber(segmentDistribution.reduce((sum, item) => sum + item.total_count, 0)) }} нийт</span>
                            </div>
                          </div>
                          <div v-if="segmentDistribution.length > 0">
                            <div class="chart-container" style="height: 320px;">
                              <client-only>
                                <apexchart
                                  type="bar"
                                  :options="ebarimtSegmentDistributionChart.options"
                                  :series="ebarimtSegmentDistributionChart.series"
                                />
                              </client-only>
                            </div>
                            <!-- Segment Summary Cards -->
                            <div class="activity-summary-cards mt-3">
                              <div class="row g-2">
                                <div v-for="(item, index) in segmentDistribution.slice(0, 10)" :key="index" class="col-6">
                                  <div class="activity-card">
                                    <div class="activity-rank">{{ index + 1 }}</div>
                                    <div class="activity-info">
                                      <div class="activity-name">{{ item.segment.length > 20 ? item.segment.substring(0, 20) + '...' : item.segment }}</div>
                                      <div class="activity-count">{{ formatNumber(item.total_count) }} ({{ item.percentage.toFixed(1) }}%)</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-center py-3">
                            <i class="las la-info-circle text-muted fs-3"></i>
                            <p class="small text-muted mb-0">Сегмент тархалтын мэдээлэл олдсонгүй</p>
                          </div>
                        </div>

                        <!-- Top Merchant Regnos Chart -->
                        <div class="mb-4">
                          <div class="chart-section-header">
                            <h6 class="text-warning mb-3">
                              <i class="las la-chart-bar me-1"></i>
                              Хамгийн их е-баримт гаргадаг 10 регистрийн дугаар
                            </h6>
                            <div class="chart-summary">
                              <span class="badge bg-warning">{{ formatNumber(topMerchantRegnos.reduce((sum, item) => sum + item.total_count, 0)) }} нийт газар</span>
                            </div>
                          </div>
                          <div v-if="topMerchantRegnos.length > 0">
                            <div class="chart-container" style="height: 320px;">
                              <client-only>
                                <apexchart
                                  type="bar"
                                  :options="ebarimtTopMerchantRegnosChart.options"
                                  :series="ebarimtTopMerchantRegnosChart.series"
                                />
                              </client-only>
                            </div>
                            <!-- Merchant Summary Cards -->
                            <div class="activity-summary-cards mt-3">
                              <div class="row g-2">
                                <div v-for="(item, index) in topMerchantRegnos.slice(0, 10)" :key="index" class="col-6">
                                  <div class="activity-card">
                                    <div class="activity-rank">{{ index + 1 }}</div>
                                    <div class="activity-info">
                                      <div class="activity-name">{{ item.mrch_regno.length > 20 ? item.mrch_regno.substring(0, 20) + '...' : item.mrch_regno }}</div>
                                      <div class="activity-count">{{ formatNumber(item.total_count) }} газар</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="text-center py-3">
                            <i class="las la-info-circle text-muted fs-3"></i>
                            <p class="small text-muted mb-0">Регистрийн дугаарын мэдээлэл олдсонгүй</p>
                          </div>
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

interface LandDebtDistribution {
  branchId: string
  districtName: string
  debtAmount: number
  recordCount: number
}

// Interfaces for ebarimt data
interface EbarimtStatistics {
  totalOrganizations: number
  organizationsWithEbarimt: number
  organizationsWithoutEbarimt: number
  totalEbarimtRecords: number
  ebarimtPercentage: number
}

interface ActivityTypeData {
  op_type_name: string
  total_count: number
}

interface SegmentDistributionData {
  segment: string
  total_count: number
  percentage: number
}

interface MerchantRegnoData {
  mrch_regno: string
  total_count: number
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
const mapType = ref(""); // Current map type: 'land', 'real_estate', or 'ebarimt'
const payCenter = ref<any[] | null>(null);
const showLandSidebar = ref(false); // New state for sidebar visibility
const showEbarimtSidebar = ref(false); // New state for ebarimt sidebar visibility

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

// Land debt data
const landDebtTotal = ref(0);
const landDebtDistribution = ref<LandDebtDistribution[]>([]);

// E-barimt data states
const ebarimtDataLoading = ref(false);
const ebarimtStatistics = ref<EbarimtStatistics>({
  totalOrganizations: 0,
  organizationsWithEbarimt: 0,
  organizationsWithoutEbarimt: 0,
  totalEbarimtRecords: 0,
  ebarimtPercentage: 0
});

// Activity type data for charts
const activityTypes3Days = ref<ActivityTypeData[]>([]);
const activityTypes30Days = ref<ActivityTypeData[]>([]);
const activityTypesWithoutEbarimt = ref<ActivityTypeData[]>([]);

// Segment distribution data for e-barimt organizations
const segmentDistribution = ref<SegmentDistributionData[]>([]);

// Top merchant regno data for e-barimt organizations
const topMerchantRegnos = ref<MerchantRegnoData[]>([]);

// Chart colors for land data
const landChartColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3'
];

// Chart colors for e-barimt activity types
const ebarimtChartColors = [
  '#FF9F43', '#FECA57', '#FF6B6B', '#48DB71', '#0ABDE3', 
  '#5F27CD', '#00D2D3', '#54A0FF', '#FF9FF3', '#10AC84'
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

// Computed chart configuration for land debt by district
const landDebtDistributionChart = computed(() => ({
  series: [{
    name: 'Газрын өр',
    data: landDebtDistribution.value.map(item => item.debtAmount)
  }],
  options: {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: landDebtDistribution.value.map(item => item.districtName),
      labels: {
        style: {
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Өрийн дүн (₮)'
      },
      labels: {
        formatter: function (val: number) {
          return formatNumber(val)
        }
      }
    },
    fill: {
      colors: ['#FF6B6B']
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

// Computed chart configuration for e-barimt activity types by 3 days
const ebarimtActivityTypes3DaysChart = computed(() => ({
  series: [{
    name: 'Е-баримтын тоо',
    data: activityTypes3Days.value.map(item => item.total_count)
  }],
  options: {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '75%',
        distributed: true,
        borderRadius: 4,
        dataLabels: {
          position: 'center'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return formatNumber(val)
      },
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      offsetX: 0
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    xaxis: {
      categories: activityTypes3Days.value.map(item => 
        item.op_type_name.length > 25 ? item.op_type_name.substring(0, 25) + '...' : item.op_type_name
      ),
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: '500'
        },
        maxHeight: 60
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Үйл ажиллагааны төрөл',
        style: {
          fontSize: '12px',
          fontWeight: '600'
        }
      },
      labels: {
        style: {
          fontSize: '10px'
        }
      }
    },
    fill: {
      colors: ebarimtChartColors,
      opacity: 0.9,
      type: 'solid'
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (val: number) {
          return formatNumber(val) + ' е-баримт'
        }
      },
      x: {
        formatter: function (val: any, opts: any) {
          return activityTypes3Days.value[opts.dataPointIndex]?.op_type_name || val
        }
      }
    },
    grid: {
      show: false
    },
    legend: {
      show: false
    }
  }
}));

// Computed chart configuration for e-barimt activity types by 30 days
const ebarimtActivityTypes30DaysChart = computed(() => ({
  series: [{
    name: 'Е-баримтын тоо',
    data: activityTypes30Days.value.map(item => item.total_count)
  }],
  options: {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '75%',
        distributed: true,
        borderRadius: 4,
        dataLabels: {
          position: 'center'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return formatNumber(val)
      },
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      offsetX: 0
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    xaxis: {
      categories: activityTypes30Days.value.map(item => 
        item.op_type_name.length > 25 ? item.op_type_name.substring(0, 25) + '...' : item.op_type_name
      ),
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: '500'
        },
        maxHeight: 60
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Үйл ажиллагааны төрөл',
        style: {
          fontSize: '12px',
          fontWeight: '600'
        }
      },
      labels: {
        style: {
          fontSize: '10px'
        }
      }
    },
    fill: {
      colors: ebarimtChartColors,
      opacity: 0.9,
      type: 'solid'
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (val: number) {
          return formatNumber(val) + ' е-баримт'
        }
      },
      x: {
        formatter: function (val: any, opts: any) {
          return activityTypes30Days.value[opts.dataPointIndex]?.op_type_name || val
        }
      }
    },
    grid: {
      show: false
    },
    legend: {
      show: false
    }
  }
}));

// Computed chart configuration for activity types without e-barimt
const ebarimtActivityTypesWithoutEbarimtChart = computed(() => ({
  series: [{
    name: 'Байгууллагын тоо',
    data: activityTypesWithoutEbarimt.value.map(item => item.total_count)
  }],
  options: {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      animations: { 
        enabled: true, 
        easing: 'easeinout', 
        speed: 800, 
        animateGradually: { enabled: true, delay: 150 }, 
        dynamicAnimation: { enabled: true, speed: 350 } 
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '75%',
        distributed: true,
        borderRadius: 4,
        dataLabels: { position: 'center' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) { return formatNumber(val) },
      style: { fontSize: '11px', fontWeight: 'bold', colors: ['#fff'] },
      offsetX: 0
    },
    stroke: { show: true, width: 1, colors: ['transparent'] },
    xaxis: {
      categories: activityTypesWithoutEbarimt.value.map(item => 
        item.op_type_name.length > 25 ? item.op_type_name.substring(0, 25) + '...' : item.op_type_name
      ),
      labels: { style: { fontSize: '10px', fontWeight: '500' }, maxHeight: 60 },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: { text: 'Үйл ажиллагааны төрөл', style: { fontSize: '12px', fontWeight: '600' } },
      labels: { style: { fontSize: '10px' } }
    },
    fill: { colors: ebarimtChartColors, opacity: 0.9, type: 'solid' },
    tooltip: {
      enabled: true, 
      theme: 'dark', 
      style: { fontSize: '12px' },
      y: { formatter: function (val: number) { return formatNumber(val) + ' байгууллага' } },
      x: { formatter: function (val: any, opts: any) { 
        return activityTypesWithoutEbarimt.value[opts.dataPointIndex]?.op_type_name || val 
      }}
    },
    grid: { show: false },
    legend: { show: false }
  }
}));

// Computed chart configuration for segment distribution
const ebarimtSegmentDistributionChart = computed(() => ({
  series: [{
    name: 'Байгууллагын тоо',
    data: segmentDistribution.value.map(item => item.total_count)
  }],
  options: {
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false },
      animations: { 
        enabled: true, 
        easing: 'easeinout', 
        speed: 800, 
        animateGradually: { enabled: true, delay: 150 }, 
        dynamicAnimation: { enabled: true, speed: 350 } 
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        distributed: true,
        borderRadius: 4,
        dataLabels: { position: 'center' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) { 
        const item = segmentDistribution.value[opts.dataPointIndex];
        return formatNumber(val) + ' (' + item?.percentage.toFixed(1) + '%)' 
      },
      style: { fontSize: '10px', fontWeight: 'bold', colors: ['#fff'] },
      offsetX: 0
    },
    stroke: { show: true, width: 1, colors: ['transparent'] },
    xaxis: {
      categories: segmentDistribution.value.map(item => 
        item.segment.length > 30 ? item.segment.substring(0, 30) + '...' : item.segment
      ),
      labels: { style: { fontSize: '10px', fontWeight: '500' }, maxHeight: 60 },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: { text: 'Сегмент', style: { fontSize: '12px', fontWeight: '600' } },
      labels: { style: { fontSize: '10px' } }
    },
    fill: { colors: ebarimtChartColors, opacity: 0.9, type: 'solid' },
    tooltip: {
      enabled: true, 
      theme: 'dark', 
      style: { fontSize: '12px' },
      y: { formatter: function (val: number, opts: any) { 
        const item = segmentDistribution.value[opts.dataPointIndex];
        return formatNumber(val) + ' байгууллага (' + item?.percentage.toFixed(1) + '%)' 
      }},
      x: { formatter: function (val: any, opts: any) { 
        return segmentDistribution.value[opts.dataPointIndex]?.segment || val 
      }}
    },
    grid: { show: false },
    legend: { show: false }
  }
}));

// Computed chart configuration for top merchant regnos
const ebarimtTopMerchantRegnosChart = computed(() => ({
  series: [{
    name: 'Газрын тоо',
    data: topMerchantRegnos.value.map(item => item.total_count)
  }],
  options: {
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false },
      animations: { 
        enabled: true, 
        easing: 'easeinout', 
        speed: 800, 
        animateGradually: { enabled: true, delay: 150 }, 
        dynamicAnimation: { enabled: true, speed: 350 } 
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        distributed: true,
        borderRadius: 4,
        dataLabels: { position: 'center' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) { 
        return formatNumber(val) + ' газар'
      },
      style: { fontSize: '10px', fontWeight: 'bold', colors: ['#fff'] },
      offsetX: 0
    },
    stroke: { show: true, width: 1, colors: ['transparent'] },
    xaxis: {
      categories: topMerchantRegnos.value.map(item => 
        item.mrch_regno.length > 20 ? item.mrch_regno.substring(0, 20) + '...' : item.mrch_regno
      ),
      labels: { style: { fontSize: '10px', fontWeight: '500' }, maxHeight: 60 },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: { text: 'Регистрийн дугаар', style: { fontSize: '12px', fontWeight: '600' } },
      labels: { style: { fontSize: '10px' } }
    },
    fill: { colors: ebarimtChartColors, opacity: 0.9, type: 'solid' },
    tooltip: {
      enabled: true, 
      theme: 'dark', 
      style: { fontSize: '12px' },
      y: { formatter: function (val: number) { 
        return formatNumber(val) + ' газар'
      }},
      x: { formatter: function (val: any, opts: any) { 
        return topMerchantRegnos.value[opts.dataPointIndex]?.mrch_regno || val 
      }}
    },
    grid: { show: false },
    legend: { show: false }
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
  // If clicking the same type that's already active, toggle it off
  if (mapType.value === type) {
    mapType.value = "";
    showLandSidebar.value = false;
    showEbarimtSidebar.value = false;
    // Clear payCenter data when toggling off land mode to hide PAY_CENTER_LOCATION data
    if (type === 'land') {
      payCenter.value = null;
    }
    return;
  }

  // Set the new map type
  mapType.value = type;
  
  // Close other sidebars
  showLandSidebar.value = false;
  showEbarimtSidebar.value = false;

  // Handle specific map type logic
  if (type === 'land') {
    // Load land data and pay center data, then show sidebar
    await Promise.all([fetchLandData(), loadPayCenterData()]);
    showLandSidebar.value = true;
  } else if (type === 'ebarimt') {
    // Load ebarimt data and show sidebar
    await loadEbarimtStatistics();
  } else if (type === 'real_estate') {
    // For real estate, clear payCenter data
    payCenter.value = null;
  } else {
    // Reset to default - show organizations only
    payCenter.value = null;
  }
}

// E-barimt statistics function
async function loadEbarimtStatistics() {
  // Check if we have cached data first
  const cacheKey = 'ebarimt_statistics_cache';
  const cachedData = get(cacheKey);
  
  if (cachedData && !ebarimtDataLoading.value) {
    console.log('Using cached ebarimt statistics');
    ebarimtStatistics.value = cachedData;
    showEbarimtSidebar.value = true;
    return;
  }

  try {
    ebarimtDataLoading.value = true;
    console.log('Loading fresh ebarimt statistics...');
    
    // Load all statistics in parallel for better performance
    const [totalOrgsResponse, totalRecordsResponse, withEbarimtResponse, activityTypes3DaysResponse, activityTypes30DaysResponse, activityTypesWithoutEbarimtResponse, segmentDistributionResponse, topMerchantRegnosResponse] = await Promise.allSettled([
      useApi('/ebarimt-statistics/total-organizations'),
      useApi('/ebarimt-statistics/total-records'),
      useApi('/ebarimt-statistics/organizations-with-ebarimt'),
      useApi('/ebarimt-statistics/top-activity-types-3days'),
      useApi('/ebarimt-statistics/top-activity-types-30days'),
      useApi('/ebarimt-statistics/top-activity-types-without-ebarimt'),
      useApi('/ebarimt-statistics/segment-distribution'),
      useApi('/ebarimt-statistics/top-merchant-regnos')
    ]);
    
    // Extract data from responses
    const totalOrganizations = totalOrgsResponse.status === 'fulfilled' && totalOrgsResponse.value.success 
      ? (totalOrgsResponse.value.data as any).total : 0;
    
    const totalEbarimtRecords = totalRecordsResponse.status === 'fulfilled' && totalRecordsResponse.value.success 
      ? (totalRecordsResponse.value.data as any).total : 0;
    
    const organizationsWithEbarimt = withEbarimtResponse.status === 'fulfilled' && withEbarimtResponse.value.success 
      ? (withEbarimtResponse.value.data as any).count : 0;
    
    // Process activity type data
    const activityTypes3DaysData = activityTypes3DaysResponse.status === 'fulfilled' && activityTypes3DaysResponse.value.success 
      ? (activityTypes3DaysResponse.value.data as any) : [];
    
    const activityTypes30DaysData = activityTypes30DaysResponse.status === 'fulfilled' && activityTypes30DaysResponse.value.success 
      ? (activityTypes30DaysResponse.value.data as any) : [];
    
    const activityTypesWithoutEbarimtData = activityTypesWithoutEbarimtResponse.status === 'fulfilled' && activityTypesWithoutEbarimtResponse.value.success 
      ? (activityTypesWithoutEbarimtResponse.value.data as any) : [];
    
    const segmentDistributionData = segmentDistributionResponse.status === 'fulfilled' && segmentDistributionResponse.value.success 
      ? (segmentDistributionResponse.value.data as any) : [];
    
    const topMerchantRegnosData = topMerchantRegnosResponse.status === 'fulfilled' && topMerchantRegnosResponse.value.success 
      ? (topMerchantRegnosResponse.value.data as any) : [];
    
    // Calculate other values
    const organizationsWithoutEbarimt = totalOrganizations - organizationsWithEbarimt;
    const ebarimtPercentage = totalOrganizations > 0 ? (organizationsWithEbarimt / totalOrganizations) * 100 : 0;
    
    // Update statistics
    const newStatistics = {
      totalOrganizations,
      organizationsWithEbarimt,
      organizationsWithoutEbarimt,
      totalEbarimtRecords,
      ebarimtPercentage
    };
    
    ebarimtStatistics.value = newStatistics;
    
    // Update activity type data
    activityTypes3Days.value = activityTypes3DaysData;
    activityTypes30Days.value = activityTypes30DaysData;
    activityTypesWithoutEbarimt.value = activityTypesWithoutEbarimtData;
    
    // Update segment distribution data
    segmentDistribution.value = segmentDistributionData;
    
    // Update top merchant regnos data
    topMerchantRegnos.value = topMerchantRegnosData;
    
    // Cache the data for 5 minutes
    set(cacheKey, newStatistics, 300);
    
    showEbarimtSidebar.value = true;
    console.log('Ebarimt statistics loaded and cached:', ebarimtStatistics.value);
    
  } catch (error) {
    console.error('Error loading ebarimt statistics:', error);
    alert("Е-баримтын мэдээлэл авахад алдаа гарлаа!");
  } finally {
    ebarimtDataLoading.value = false;
  }
}

async function loadPayCenterData() {
  // Check if we have cached data first
  const cacheKey = 'pay_center_data_cache';
  const cachedData = get(cacheKey);
  
  if (cachedData && !payCenter.value) {
    console.log('Using cached pay center data');
    payCenter.value = cachedData;
    return;
  }

  try {
    console.log('Loading fresh pay center data...');
    const res = await useApi("/pay-center-locations?grouped=true");
    if (res.success && res.data) {
      payCenter.value = res.data as any; // This will be a grouped object now
      
      // Cache the data for 10 minutes
      set(cacheKey, payCenter.value, 600);
      
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

async function fetchLandDebtTotal() {
  try {
    const response = await useApi('/land/debt-total');
    if (response.success && response.data) {
      landDebtTotal.value = (response.data as any).total_debt || 0;
    }
  } catch (err) {
    console.error('Error fetching land debt total:', err);
  }
}

async function fetchLandDebtDistribution() {
  try {
    const response = await useApi('/land/debt-by-district');
    if (response.success && response.data) {
      const data = Array.isArray(response.data) ? response.data : [];
      landDebtDistribution.value = data.map((item: any) => ({
        branchId: item.branch_id,
        districtName: item.district_name,
        debtAmount: item.debt_amount,
        recordCount: item.record_count
      }));
    }
  } catch (err) {
    console.error('Error fetching land debt distribution:', err);
  }
}

async function fetchLandData() {
  // Check if we have cached data first
  const cacheKey = 'land_data_cache';
  const cachedData = get(cacheKey);
  
  if (cachedData && !landDataLoading.value) {
    console.log('Using cached land data');
    landStatistics.value = cachedData.statistics || landStatistics.value;
    landPayments.value = cachedData.payments || landPayments.value;
    landPaymentDistribution.value = cachedData.paymentDistribution || [];
    landDebtTotal.value = cachedData.debtTotal || 0;
    landDebtDistribution.value = cachedData.debtDistribution || [];
    return;
  }

  landDataLoading.value = true;
  try {
    console.log('Fetching fresh land data...');
    
    // Load all data in parallel for better performance
    const [statsResult, paymentsResult, paymentDistResult, debtTotalResult, debtDistResult] = await Promise.allSettled([
      fetchLandStatistics(),
      fetchLandPayments(),
      fetchLandPaymentDistribution(),
      fetchLandDebtTotal(),
      fetchLandDebtDistribution()
    ]);

    // Cache the successful results
    const cacheData = {
      statistics: landStatistics.value,
      payments: landPayments.value,
      paymentDistribution: landPaymentDistribution.value,
      debtTotal: landDebtTotal.value,
      debtDistribution: landDebtDistribution.value,
      timestamp: Date.now()
    };
    
    // Cache for 5 minutes
    set(cacheKey, cacheData, 300);
    
    console.log('Land data loaded and cached successfully');
  } catch (err) {
    console.error('Error fetching land data:', err);
  } finally {
    landDataLoading.value = false;
  }
}

// Fetch organizations and pay center data on page load
onMounted(async () => {
  // Load organizations
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

  // Pay center data will be loaded only when "Газар" button is clicked
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

/* E-barimt sidebar styles */
.ebarimt-sidebar {
  width: 0;
  max-width: 0;
  min-width: 0;
  margin-left: 0;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  transform: translateX(100%);
}

.ebarimt-sidebar.show {
  width: 400px;
  max-width: 400px;
  min-width: 350px;
  margin-left: 15px;
  opacity: 1;
  transform: translateX(0);
}

.ebarimt-sidebar .card {
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ebarimt-sidebar .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem;
}

.ebarimt-sidebar .card-body {
  background-color: #ffffff;
  min-height: 400px;
  padding: 1.5rem;
}

.ebarimt-scrollable-content {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.ebarimt-scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.ebarimt-scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.ebarimt-scrollable-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.ebarimt-scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Chart section header styles */
.chart-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-section-header h6 {
  margin-bottom: 0 !important;
  flex: 1;
}

.chart-summary {
  flex-shrink: 0;
}

/* Activity summary cards styles */
.activity-summary-cards {
  margin-top: 1rem;
}

.activity-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #adb5bd;
}

.activity-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #FF9F43, #FECA57);
}

.activity-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #FF9F43, #FECA57);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.activity-info {
  flex: 1;
  min-width: 0;
}

.activity-name {
  font-size: 11px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.25rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-count {
  font-size: 12px;
  font-weight: bold;
  color: #FF9F43;
}

/* Chart container improvements */
.chart-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .land-sidebar.show,
  .ebarimt-sidebar.show {
    width: 300px;
    min-width: 300px;
  }
}

@media (max-width: 992px) {
  .land-sidebar,
  .ebarimt-sidebar {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
    height: 100%;
  }
  
  .land-sidebar.show,
  .ebarimt-sidebar.show {
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
