<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { definePageMeta } from "#app";

// Import Chart.js and vue-chartjs components
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  RadialLinearScale, // Import RadialLinearScale for PolarArea
  RadarElement, // Import RadarElement
} from "chart.js";
import { Line, Doughnut, Bar, PolarArea, Pie, Radar } from "vue-chartjs"; // Import Pie chart component and Radar chart component

// Import vue-easy-lightbox component and CSS
import VueEasyLightbox from "vue-easy-lightbox";
import "vue-easy-lightbox/external-css/vue-easy-lightbox.css"; // Adjust path if needed

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  RadialLinearScale, // Register RadialLinearScale
  RadarElement // Register RadarElement
);

const route = useRoute();
const entityId = route.params.id; // Get entity ID from route parameters

// Define reactive state for entity data and chart data/options
const entity = ref({}); // Placeholder for entity data from API

// Reactive state for lightbox
const visibleRef = ref(false);
const imgsRef = ref([]); // Use an array for multiple images if needed

// Placeholder data and options for the Line chart
const lineChartData = ref({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [40, 20, 12, 39, 10, 40, 39],
    },
  ],
});

const lineChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Placeholder data and options for the Doughnut chart
const doughnutChartData = ref({
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 4,
    },
  ],
});

const doughnutChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Placeholder data and options for the Bar chart
const barChartData = ref({
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
});

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

// Placeholder data and options for the Polar Area chart
const polarAreaChartData = ref({
  labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
  datasets: [
    {
      label: "My dataset",
      data: [11, 16, 7, 3, 14],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(75, 192, 192)",
        "rgb(255, 205, 86)",
        "rgb(201, 203, 207)",
        "rgb(54, 162, 235)",
      ],
    },
  ],
});

const polarAreaChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Placeholder data and options for the Pie chart
const pieChartData = ref({
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
      hoverOffset: 4,
    },
  ],
});

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

// Placeholder data and options for the Radar chart
const radarChartData = ref({
  labels: [
    "Eating",
    "Drinking",
    "Sleeping",
    "Designing",
    "Coding",
    "Cycling",
    "Running",
  ],
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 90, 81, 56, 55, 40],
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132)",
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
    {
      label: "My Second Dataset",
      data: [28, 48, 40, 19, 96, 27, 100],
      fill: true,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgb(54, 162, 235)",
      pointBackgroundColor: "rgb(54, 162, 235)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(54, 162, 235)",
    },
  ],
});

const radarChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderWidth: 3,
    },
  },
  scales: {
    r: {
      angleLines: {
        display: false,
      },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
});

// Functions for lightbox control
function show(imgSrc) {
  imgsRef.value = [imgSrc]; // Set image(s) for the lightbox
  visibleRef.value = true;
}

function hide() {
  visibleRef.value = false;
  imgsRef.value = []; // Clear images when hidden
}

// Fetch entity data from API endpoint (e.g., /api/entities/:id)
const fetchEntityData = async () => {
  try {
    const entityData = await $fetch(`/api/entities/${entityId}`);
    entity.value = entityData; // Assuming API returns entity object

    // Update chart data based on fetched entityData structure
    // Assuming entityData contains properties like lineChartData, doughnutChartData, etc.
    if (entityData.lineChartData) {
      lineChartData.value = entityData.lineChartData;
    }
    if (entityData.doughnutChartData) {
      doughnutChartData.value = entityData.doughnutChartData;
    }
    if (entityData.barChartData) {
      barChartData.value = entityData.barChartData;
    }
    if (entityData.polarAreaChartData) {
      polarAreaChartData.value = entityData.polarAreaChartData;
    }
    if (entityData.pieChartData) {
      pieChartData.value = entityData.pieChartData;
    }
    if (entityData.radarChartData) {
      radarChartData.value = entityData.radarChartData;
    }
  } catch (error) {
    console.error("Error fetching entity data:", error);
    // TODO: Display an error message to the user
  }
};

// Fetch data when component is mounted
onMounted(() => {
  if (!entityId) {
    console.error(
      "Entity ID is not provided in route parameters. Redirecting..."
    );
    // Redirect to entities list if ID is missing
    navigateTo("/entities"); // Use Nuxt's navigateTo for navigation
  } else {
    fetchEntityData();
  }
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="page-wrapper">
    <!-- Page Content-->
    <div class="page-content">
      <div class="container-fluid">
        <!-- Page Title and Breadcrumb -->
        <div class="row">
          <div class="col-sm-12">
            <div
              class="page-title-box d-md-flex justify-content-md-between align-items-center"
            >
              <!-- Display entity name dynamically -->
              <h4 class="page-title">
                {{ entity.name || "Байгууллагын нэр" }}
              </h4>
              <div class="">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                  <!--end nav-item-->
                  <!-- Update link if needed -->
                  <li class="breadcrumb-item">
                    <NuxtLink to="/entities">Татвар төлөгч</NuxtLink>
                  </li>
                  <!--end nav-item-->
                  <li class="breadcrumb-item active">Дэлгэрэнгүй</li>
                </ol>
              </div>
            </div>
            <!--end page-title-box-->
          </div>
          <!--end col-->
        </div>
        <!--end row-->

        <!-- Entity Details and Image -->
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-8">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <!-- Display dynamic entity image and make it clickable for lightbox -->
                  <img
                    :src="entity.image || '/uploads/default-entity.jpeg'"
                    <!--
                    Assuming
                    entity
                    data
                    includes
                    image
                    path
                    --
                  />
                  alt="Entity Image" class="rounded-circle thumb-xl"
                  @click="show(entity.image || '/uploads/default-entity.jpeg')"
                  style="cursor: pointer;" />
                  <div class="flex-grow-1 ms-3">
                    <!-- Display dynamic entity name and type -->
                    <h4 class="mb-1">{{ entity.name || "--" }}</h4>
                    <p class="text-muted mb-1">{{ entity.type || "--" }}</p>
                    <!-- Display dynamic entity status or other info -->
                    <!-- Assuming status comes as a string, you might need to map it to a badge class -->
                    <span
                      :class="[
                        'badge',
                        entity.status === 'active'
                          ? 'bg-success'
                          : 'bg-secondary',
                      ]"
                      >{{ entity.status || "--" }}</span
                    >
                  </div>
                </div>
                <div class="mt-3">
                  <!-- Display dynamic entity details (phone, email, address, etc.) -->
                  <p class="text-muted font-13">
                    <span class="badge badge-soft-dark me-2">Утас :</span>
                    {{ entity.phone || "--" }}
                  </p>
                  <p class="text-muted font-13">
                    <span class="badge badge-soft-dark me-2">Имэйл :</span>
                    {{ entity.email || "--" }}
                  </p>
                  <p class="text-muted font-13">
                    <span class="badge badge-soft-dark me-2">Хаяг :</span>
                    {{ entity.address || "--" }}
                  </p>
                  <!-- TODO: Add more details based on entity data -->
                  <p class="text-muted font-13 mb-0">
                    <span class="badge badge-soft-dark me-2">Тайлбар :</span>
                    {{ entity.description || "--" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- Entity Image (Floor Plan) -->
          <div class="col-md-6 col-lg-4">
            <!-- Update image source dynamically and make it clickable for lightbox -->
            <a
              href="#"
              @click.prevent="
                show(entity.floorPlanImage || '/uploads/default-floorplan.jpg')
              "
            >
              <img
                :src="entity.floorPlanImage || '/uploads/default-floorplan.jpg'"
                alt="Floor Plan Image"
                class="w-100"
                style="cursor: pointer"
              />
            </a>
          </div>
        </div>

        <!-- Charts -->
        <div class="row justify-content-center mt-2">
          <!-- Implement charts using Chart.js and dynamic data -->
          <div class="col-md-6 col-lg-8">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Татвар бүрдүүлэлт</h4>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <!-- Replace canvas with Line chart component -->
                <Line
                  id="lineChart"
                  :data="lineChartData"
                  :options="lineChartOptions"
                />
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
          <div class="col-md-6 col-lg-4">
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
              <!--end card-header-->
              <div class="card-body pt-0">
                <!-- Replace canvas with Doughnut chart component -->
                <Doughnut
                  id="doughnut"
                  :data="doughnutChartData"
                  :options="doughnutChartOptions"
                />
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
        </div>
        <!--end row-->

        <div class="row justify-content-center">
          <!-- Implement charts using Chart.js and dynamic data -->
          <div class="col-md-6 col-lg-8">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Татварын орлого</h4>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <!-- Replace canvas with Bar chart component -->
                <Bar id="bar" :data="barChartData" :options="barChartOptions" />
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
          <div class="col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Ebarimt гаргах</h4>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <!-- Replace canvas with PolarArea chart component -->
                <PolarArea
                  id="polarArea"
                  :data="polarAreaChartData"
                  :options="polarAreaChartOptions"
                />
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
        </div>
        <!--end row-->

        <div class="row justify-content-center">
          <!-- Implement charts using Chart.js and dynamic data -->
          <div class="col-md-6 col-lg-6">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Хуулийн этгээдийн төрөл</h4>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <!-- Replace canvas with Pie chart component -->
                <Pie id="pie" :data="pieChartData" :options="pieChartOptions" />
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
          <div class="col-md-6 col-lg-6">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Зөвлөгөө өгөх явц</h4>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </div>
              <!--end card-header-->
              <div class="card-body pt-0">
                <!-- Replace canvas with Radar chart component -->
                <Radar
                  id="radar"
                  :data="radarChartData"
                  :options="radarChartOptions"
                />
              </div>
              <!--end card-body-->
            </div>
            <!--end card-->
          </div>
          <!--end col-->
        </div>
        <!--end row-->
      </div>
      <!-- container-fluid -->
    </div>
    <!-- End Page Content-->

    <!-- TODO: Add footer component if it's not part of a layout -->
  </div>
  <!-- end page-wrapper -->

  <!-- Image Lightbox -->
  <VueEasyLightbox
    :visible="visibleRef"
    :imgs="imgsRef"
    @hide="hide"
  ></VueEasyLightbox>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
