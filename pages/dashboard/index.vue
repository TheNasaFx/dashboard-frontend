<template>
  <div class="page-wrapper">
    <!-- Page Content-->
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div
              class="page-title-box d-md-flex justify-content-md-between align-items-center"
            >
              <h4 class="page-title">Хянах самбар</h4>
              <div class="">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                  <!--end nav-item-->
                  <li class="breadcrumb-item active">Хянах самбар</li>
                </ol>
              </div>
            </div>
            <!--end page-title-box-->
          </div>
          <!--end col-->
        </div>
        <!--end row-->
        <div class="row justify-content-center">
          <div class="col-md-12 col-lg-6">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Бүртгэл</h4>
                  </div>
                  <!--end col-->
                  <div class="col-auto">
                    <div class="dropdown">
                      <a
                        href="#"
                        class="btn bt btn-light dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="icofont-calendar fs-5 me-1"></i> Энэ сар<i
                          class="las la-angle-down ms-1"
                        ></i
                      ></a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Энэ жил</a>
                        <a class="dropdown-item" href="#">Бүгд</a>
                      </div>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <!-- Apex Charts placeholder -->
                <apexchart
                  type="bar"
                  height="350"
                  :options="reportsChartOptions"
                  :series="reportsChartSeries"
                ></apexchart>
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
          <div class="col-md-6 col-lg-3">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Татвар бүрдүүлэлт</h4>
                  </div>
                  <!--end col-->
                  <div class="col-auto">
                    <div class="dropdown">
                      <a
                        href="#"
                        class="btn bt btn-light dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="icofont-calendar fs-5 me-1"></i> Энэ сар<i
                          class="las la-angle-down ms-1"
                        ></i
                      ></a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Энэ жил</a>
                        <a class="dropdown-item" href="#">Бүгд</a>
                      </div>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <!-- Apex Charts placeholder -->
                <apexchart
                  type="bar"
                  height="350"
                  :options="cashflowChartOptions"
                  :series="cashflowChartSeries"
                ></apexchart>
                <div class="row">
                  <div class="col-4">
                    <div class="text-center">
                      <p class="text-muted text-uppercase mb-0 fw-medium fs-13">
                        Бүртгэл
                      </p>
                      <!-- Display dynamic data -->
                      <h5 class="mt-1 mb-0 fw-medium">
                        {{ stats.registrationPercentage || "--" }}
                      </h5>
                    </div>
                  </div>
                  <!--end col-->
                  <div class="col-4">
                    <div class="text-center">
                      <p class="text-muted text-uppercase mb-0 fw-medium fs-13">
                        Тодорхойгүй
                      </p>
                      <!-- Display dynamic data -->
                      <h5 class="mt-1 mb-0 fw-medium">
                        {{ stats.uncertainPercentage || "--" }}
                      </h5>
                    </div>
                  </div>
                  <!--end col-->
                  <div class="col-4">
                    <div class="text-center">
                      <p class="text-muted text-uppercase mb-0 fw-medium fs-13">
                        Бусад
                      </p>
                      <!-- Display dynamic data -->
                      <h5 class="mt-1 mb-0 fw-medium">
                        {{ stats.otherPercentage || "--" }}
                      </h5>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
                <div class="text-center mx-auto">
                  <!-- Assuming rabit.png is in public/assets/images/extra -->
                  <img
                    src="/assets/images/extra/rabit.png"
                    alt=""
                    class="d-inline-block"
                    height="105"
                  />
                </div>
                <div class="card-bg position-relative z-0">
                  <div class="p-3 bg-primary-subtle rounded position-relative">
                    <div class="d-flex align-items-center">
                      <div
                        class="flex-shrink-0 bg-primary-subtle text-primary thumb-lg rounded-circle"
                      >
                        <i class="iconoir-bright-star fs-3"></i>
                      </div>
                      <div class="flex-grow-1 ms-2">
                        <!-- TODO: Display dynamic data -->
                        <h6 class="my-0 fw-normal text-dark fs-13 mb-0">
                          Яг одоо бүртгэл хийгдэж байгаа
                          <a
                            href="#"
                            class="text-primary fw-medium mb-0 text-decoration-underline"
                            >хэн явж байна?</a
                          >
                        </h6>
                      </div>
                      <!--end media-body-->
                    </div>
                  </div>
                </div>
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
          <div class="col-md-6 col-lg-3">
            <div class="card bg-corner-img">
              <div class="card-body">
                <div class="row d-flex justify-content-center">
                  <div class="col-9">
                    <p class="text-muted text-uppercase mb-0 fw-normal fs-13">
                      E баримт гаргадаг
                    </p>
                    <!-- Display dynamic data -->
                    <h4 class="mt-1 mb-0 fw-medium">
                      {{ stats.eInvoiceCount || "--" }}
                    </h4>
                  </div>
                  <!--end col-->
                  <div class="col-3 align-self-center">
                    <div
                      class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto"
                    >
                      <i
                        class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"
                      ></i>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-body-->
            </div>
            <div class="card bg-corner-img">
              <div class="card-body">
                <div class="row d-flex justify-content-center">
                  <div class="col-9">
                    <p class="text-muted text-uppercase mb-0 fw-normal fs-13">
                      Тайлан тушаасан
                    </p>
                    <!-- Display dynamic data -->
                    <h4 class="mt-1 mb-0 fw-medium">
                      {{ stats.reportsSubmitted || "--" }}
                    </h4>
                  </div>
                  <!--end col-->
                  <div class="col-3 align-self-center">
                    <div
                      class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto"
                    >
                      <i
                        class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"
                      ></i>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-body-->
            </div>
            <div class="card bg-corner-img">
              <div class="card-body">
                <div class="row d-flex justify-content-center">
                  <div class="col-9">
                    <p class="text-muted text-uppercase mb-0 fw-normal fs-13">
                      Татварын өртэй
                    </p>
                    <!-- Display dynamic data -->
                    <h4 class="mt-1 mb-0 fw-medium">
                      {{ stats.taxDebtCount || "--" }}
                    </h4>
                  </div>
                  <!--end col-->
                  <div class="col-3 align-self-center">
                    <div
                      class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto"
                    >
                      <i
                        class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"
                      ></i>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-body-->
            </div>
            <div class="card bg-corner-img">
              <div class="card-body">
                <div class="row d-flex justify-content-center">
                  <div class="col-9">
                    <p class="text-muted text-uppercase mb-0 fw-normal fs-13">
                      НӨАТ төлөгч
                    </p>
                    <!-- Display dynamic data -->
                    <h4 class="mt-1 mb-0 fw-medium">
                      {{ stats.vatPayerCount || "--" }}
                    </h4>
                  </div>
                  <!--end col-->
                  <div class="col-3 align-self-center">
                    <div
                      class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto"
                    >
                      <i
                        class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"
                      ></i>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-body-->
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-3 order-2 order-lg-1">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Үйл ажиллагааны чиглэл</h4>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <div class="card-body pt-0">
                <!-- Apex Charts placeholder -->
                <div id="balance" class="apex-charts"></div>
                <!-- Display dynamic data -->
                <div class="bg-light py-3 px-2 mb-0 mt-3 text-center rounded">
                  <h6 class="mb-0">
                    <i class="icofont-calendar fs-5 me-1"></i>
                    {{ stats.totalTaxpayers || "--" }} татвар төлөгчид
                  </h6>
                </div>
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
          <div class="col-md-12 col-lg-6 order-1 order-lg-2">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Сүүлийн бүртгэл</h4>
                  </div>
                  <!--end col-->
                  <div class="col-auto">
                    <div class="dropdown">
                      <a
                        href="#"
                        class="btn bt btn-light dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="icofont-calendar fs-5 me-1"></i> Энэ сар<i
                          class="las la-angle-down ms-1"
                        ></i
                      ></a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Энэ жил</a>
                        <a class="dropdown-item" href="#">Бүгд</a>
                      </div>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <div class="table-responsive">
                  <table class="table mb-0">
                    <thead class="table-light">
                      <tr>
                        <th class="border-top-0">Татвар төлөгч</th>
                        <th class="border-top-0">Бүртгэл</th>
                        <th class="border-top-0">Ибаримт</th>
                        <th class="border-top-0">Тайлан</th>
                        <th class="border-top-0">Үйлдэл</th>
                      </tr>
                      <!--end tr-->
                    </thead>
                    <tbody>
                      <!-- Loop through recentRegistrations data -->
                      <tr
                        v-for="record in recentRegistrations"
                        :key="record.id"
                      >
                        <td>{{ record.taxpayerName }}</td>
                        <td>{{ record.registrationDate }}</td>
                        <td>{{ record.invoiceNumber }}</td>
                        <td>{{ record.reportNumber }}</td>
                        <td>
                          <!-- TODO: Add actual links/actions -->
                          <a href="#">Харах</a>
                          <a href="#">Засах</a>
                        </td>
                      </tr>
                      <!-- Placeholder row if no data -->
                      <tr v-if="recentRegistrations.length === 0">
                        <td colspan="5" class="text-center">
                          Өгөгдөл олдсонгүй.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--end table-responsive-->
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
          <div class="col-md-6 col-lg-3 order-3 order-lg-3">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Байцаагчид</h4>
                  </div>
                  <!--end col-->
                  <div class="col-auto">
                    <div class="dropdown">
                      <a href="#" class="btn bt btn-light">
                        <i class="icofont-contact-add fs-5 me-1"></i> бүгд
                      </a>
                    </div>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <div class="table-responsive">
                  <table class="table mb-0">
                    <tbody>
                      <!-- Loop through inspectors data -->
                      <tr v-for="inspector in inspectors" :key="inspector.id">
                        <td class="px-0">
                          <div class="d-flex align-items-center">
                            <!-- TODO: Update image source if needed -->
                            <img
                              :src="
                                inspector.avatar ||
                                '/assets/images/users/default-avatar.jpg'
                              "
                              height="36"
                              class="me-2 align-self-center rounded"
                              :alt="inspector.name"
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">{{ inspector.name }}</h6>
                              <a
                                href="#"
                                class="font-12 text-muted text-decoration-underline"
                                >#{{ inspector.id }}</a
                              >
                            </div>
                          </div>
                          <!--end media-->
                        </td>
                        <!-- Display dynamic data -->
                        <td class="px-0 text-end">
                          <span
                            class="text-primary ps-2 align-self-center text-end fw-medium"
                            >{{ inspector.count || "--" }}</span
                          >
                        </td>
                        <td class="px-0 text-end">
                          <!-- TODO: Add actual links/actions -->
                          <a href="#" class="text-body"
                            ><i class="las la-sync-alt"></i
                          ></a>
                        </td>
                      </tr>
                      <!-- Placeholder row if no data -->
                      <tr v-if="inspectors.length === 0">
                        <td colspan="3" class="text-center">
                          Байцаагчид олдсонгүй.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--end /div-->
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
        </div>
        <!--end row-->

        <!-- TODO: Investigate data fetching logic for recent registrations and inspectors in original PHP files or JS files -->
      </div>
      <!-- container-fluid -->
    </div>
    <!-- End Page Content-->

    <!-- TODO: Add footer component if it's not part of a layout -->
    <!-- <? require_once('views/footer.php'); ?> -->
  </div>
  <!-- end page-wrapper -->
</template>

<script setup>
import { definePageMeta } from "nuxt/app";
import { ref, onMounted, watchEffect } from "vue";
import { $fetch } from "ofetch";
import VueApexCharts from "vue3-apexcharts";

definePageMeta({
  middleware: ["auth"],
});

// Define reactive state for dashboard data
const stats = ref({}); // Placeholder for statistics
const recentRegistrations = ref([]); // Placeholder for recent registrations table data
const inspectors = ref([]); // Placeholder for inspectors data

// Reactive variables for chart data and options
const reportsChartSeries = ref([]); // Data for Reports chart
const reportsChartOptions = ref({
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: [], // Dynamic categories
  },
  yaxis: {
    title: {
      text: "Count",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " reports";
      },
    },
  },
});

const cashflowChartSeries = ref([]); // Data for Cashflow chart
const cashflowChartOptions = ref({
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: [], // Dynamic categories
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },
});

const balanceChartSeries = ref([]); // Data for Activities chart (e.g., counts)
const balanceChartOptions = ref({
  chart: {
    type: "donut",
    height: 350,
  },
  labels: [], // Dynamic labels
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
});

// Fetch dashboard data from API endpoints
const fetchDashboardData = async () => {
  try {
    // Fetch stats data
    const statsData = await $fetch("/api/dashboard/stats");
    if (statsData) {
      stats.value = statsData;
    }

    // Fetch recent registrations data
    const recentData = await $fetch("/api/dashboard/latest-records");
    recentRegistrations.value = recentData;

    // Fetch inspectors data
    const inspectorsData = await $fetch("/api/dashboard/inspectors");
    inspectors.value = inspectorsData;

    // Fetch reports chart data
    const reportsRawData = await $fetch("/api/dashboard/reports-data");
    if (reportsRawData) {
      // Assuming reportsRawData is an array like [{ month: 'YYYY-MM', count: N }]
      reportsChartSeries.value = [
        { name: "Reports", data: reportsRawData.map((item) => item.count) },
      ];
      reportsChartOptions.value = {
        ...reportsChartOptions.value,
        xaxis: { categories: reportsRawData.map((item) => item.month) },
      };
    }

    // Fetch cashflow chart data
    const cashflowRawData = await $fetch("/api/dashboard/cashflow-data");
    if (cashflowRawData) {
      // TODO: Process cashflowRawData to match multiple series if needed
      // For the placeholder, assuming single series data structure like [{ month: 'YYYY-MM', total_amount: N }]
      cashflowChartSeries.value = [
        {
          name: "Total Amount",
          data: cashflowRawData.map((item) => item.total_amount),
        },
      ];
      cashflowChartOptions.value = {
        ...cashflowChartOptions.value,
        xaxis: { categories: cashflowRawData.map((item) => item.month) },
      };
    }

    // Fetch activities chart data
    const activitiesRawData = await $fetch("/api/dashboard/activities-data");
    if (activitiesRawData) {
      // Assuming activitiesRawData is an array like [{ label: 'Activity', count: N }]
      balanceChartSeries.value = activitiesRawData.map((item) => item.count);
      balanceChartOptions.value = {
        ...balanceChartOptions.value,
        labels: activitiesRawData.map((item) => item.label),
      };
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // TODO: Display an error message to the user
  }
};

// Initialize ApexCharts and fetch data when component is mounted
onMounted(() => {
  // ApexCharts initialization is implicitly handled by the component mounting
  fetchDashboardData();
});

// Optional: Watch for data changes and update charts if necessary
// watchEffect(() => {
//   // Logic to update charts when data changes
// });
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
