<template>
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
                  <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                  <li class="breadcrumb-item">
                    <a href="#">Татвар төлөгчид</a>
                  </li>
                  <li class="breadcrumb-item active">Газрын зураг</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-12 col-lg-12">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-wrap gap-2">
                  <!-- District Filter -->
                  <button
                    type="button"
                    class="btn btn-outline-primary dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Дүүрэг: {{ selectedDistrict || "Бүгд" }}
                    <i class="las la-angle-down ms-1"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = null"
                        >Бүгд</a
                      >
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Баянгол'"
                        >Баянгол</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Баянзүрх'"
                        >Баянзүрх</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Чингэлтэй'"
                        >Чингэлтэй</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Сүхбаатар'"
                        >Сүхбаатар</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Сонгинохайрхан'"
                        >Сонгинохайрхан</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Хан-Уул'"
                        >Хан-Уул</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Багахангай'"
                        >Багахангай</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Налайх'"
                        >Налайх</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedDistrict = 'Багануур'"
                        >Багануур</a
                      >
                    </li>
                  </ul>

                  <!-- Khoroo Filter -->
                  <button
                    type="button"
                    class="btn btn-outline-warning dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Хороо: {{ selectedKhoroo || "Бүгд" }}
                    <i class="las la-angle-down ms-1"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = null"
                        >Бүгд</a
                      >
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '1'"
                        >1-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '2'"
                        >2-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '3'"
                        >3-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '4'"
                        >4-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '5'"
                        >5-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '6'"
                        >6-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '7'"
                        >7-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '8'"
                        >8-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '9'"
                        >9-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '10'"
                        >10-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '11'"
                        >11-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '12'"
                        >12-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '13'"
                        >13-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '14'"
                        >14-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '15'"
                        >15-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '16'"
                        >16-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '17'"
                        >17-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '18'"
                        >18-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '19'"
                        >19-р хороо</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedKhoroo = '20'"
                        >20-р хороо</a
                      >
                    </li>
                  </ul>

                  <!-- Activity Type Filter -->
                  <button
                    type="button"
                    class="btn btn-outline-dark dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Ү/а чиглэл: {{ selectedActivityType || "Бүгд" }}
                    <i class="las la-angle-down ms-1"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedActivityType = null"
                        >Бүгд</a
                      >
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedActivityType = 'Худалдаа'"
                        >Худалдаа</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedActivityType = 'Хүнс'"
                        >Хүнс</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedActivityType = 'Санхүү'"
                        >Санхүү</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedActivityType = 'Тээвэр'"
                        >Тээвэр</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedActivityType = 'Эрүүл мэнд'"
                        >Эрүүл мэнд</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedActivityType = 'Боловсрол'"
                        >Боловсрол</a
                      >
                    </li>
                  </ul>

                  <!-- Type Filter -->
                  <button
                    type="button"
                    class="btn btn-outline-light dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Төрөл: {{ selectedType || "Бүгд" }}
                    <i class="las la-angle-down ms-1"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedType = null"
                        >Бүгд</a
                      >
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedType = 'Хувь хүн'"
                        >Хувь хүн</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="selectedType = 'Хуулийн этгээд'"
                        >Хуулийн этгээд</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-12 col-lg-12">
            <div class="card">
              <div class="card-body pt-0">
                <!-- Map Container -->
                <div id="map" style="height: 800px; border-radius: 10px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { definePageMeta } from "nuxt/app";
import { ref, onMounted, watchEffect } from "vue";
import { $fetch } from "ofetch";
// Import Leaflet and MarkerCluster dynamically to ensure client-side rendering
let L = null;
let L_markerCluster = null;

definePageMeta({
  middleware: ["auth"],
});

const map = ref(null); // Reactive reference for the map instance
const markers = ref(null); // Reactive reference for the marker cluster group

// Reactive variables for filter selections
const selectedDistrict = ref(null);
const selectedKhoroo = ref(null);
const selectedActivityType = ref(null);
const selectedType = ref(null);

const fetchMapPositions = async (filters = {}) => {
  // Construct query parameters from filters object
  const queryParams = new URLSearchParams();
  if (filters.district) queryParams.append("district", filters.district);
  if (filters.khoroo) queryParams.append("khoroo", filters.khoroo);
  if (filters.activityType)
    queryParams.append("activityType", filters.activityType);
  if (filters.type) queryParams.append("type", filters.type);

  try {
    const url = `/api/map/positions?${queryParams.toString()}`;
    const positionsData = await $fetch(url);

    // Process positionsData and add markers to the map
    if (
      map.value &&
      markers.value &&
      positionsData &&
      Array.isArray(positionsData)
    ) {
      // Clear existing markers
      markers.value.clearLayers();

      positionsData.forEach((position) => {
        if (position.lat && position.lng) {
          // TODO: Implement custom icon logic based on position.category or other data
          // Example custom icon (you might need to define icons similar to map.php or use assets)
          const customIcon = L.icon({
            iconUrl: position.image || "/assets/images/pins/default.png", // Assuming position data includes image path
            iconSize: [30, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -30],
          });

          const marker = L.marker(
            [parseFloat(position.lat), parseFloat(position.lng)],
            {
              icon: customIcon,
            }
          );

          // Add popup with position details
          // Adjust popup content based on available data (name, address, etc.)
          let popupContent = `<b>${position.name || "No Name"}</b>`;
          if (position.address) popupContent += `<br>${position.address}`; // Use 'address' from API if available
          // TODO: Add image to popup if available in position.image
          if (position.image)
            popupContent += `<br><img src="${position.image}" alt="${
              position.name || "Location Image"
            }" style="max-width: 150px;">`;

          marker.bindPopup(popupContent);

          markers.value.addLayer(marker); // Add marker to cluster group
        }
      });

      // Optionally adjust map view to fit markers if needed
      // if (markers.value.getLayers().length > 0) {
      //   map.value.fitBounds(markers.value.getBounds());
      // }
    }
  } catch (error) {
    console.error("Error fetching map positions:", error);
    // TODO: Display an error message
  }
};

onMounted(async () => {
  // Dynamically import Leaflet and MarkerCluster on the client side
  if (process.client) {
    L = await import("leaflet").then((m) => m.default);
    L_markerCluster = await import("leaflet.markercluster").then(
      (m) => m.default
    );

    // Initialize the map
    // Set initial view (adjust coordinates and zoom as needed)
    map.value = L.map("map").setView([47.9188691, 106.9175785], 13); // Example initial view

    // Add base tile layers (Google and Satellite)
    const googleStreets = L.tileLayer(
      "https://www.google.com/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
      { attribution: "© Google" }
    );
    const googleSat = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "© Esri" }
    ).addTo(map.value); // Add Satellite by default

    const baseLayers = {
      Google: googleStreets,
      Satelite: googleSat,
    };

    // Add layer control
    L.control.layers(baseLayers).addTo(map.value);

    // Initialize marker cluster group
    markers.value = L_markerCluster();
    map.value.addLayer(markers.value); // Add cluster group to map

    // TODO: Implement draw_khoroo or similar polygon drawing logic if needed (requires geojson data)

    // Initial data fetch is now handled by watchEffect
    // fetchMapPositions();
  }
});

// Watch for filter changes and update the map
watchEffect(() => {
  const filters = {
    district: selectedDistrict.value,
    khoroo: selectedKhoroo.value,
    activityType: selectedActivityType.value,
    type: selectedType.value,
  };
  // Only fetch if Leaflet and map are initialized
  if (L && map.value) {
    fetchMapPositions(filters);
  }
});

// TODO: Implement custom icon logic based on original PHP/JS if needed
</script>

<style scoped>
/* Add any component-specific styles here */
/* Original style for map div */
#map {
  height: 800px;
  border-radius: 10px;
}
</style>
