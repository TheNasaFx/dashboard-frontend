<template>
  <div id="map" style="height: 700px; width: 100%; border-radius: 10px"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useAttrs } from "vue";
import L from "leaflet";
import "leaflet.markercluster";

const props = defineProps<{
  district: string;
  khoroo: string;
  category: string;
}>();

const map = ref<any>(null);
const markersLayer = ref<any>(null);

async function fetchAndRenderMarkers() {
  // API query string үүсгэх
  const params = new URLSearchParams();
  if (props.district) params.append("district", props.district);
  if (props.khoroo) params.append("khoroo", props.khoroo);
  if (props.category) params.append("category", props.category);
  const url =
    "/api/positions" + (params.toString() ? `?${params.toString()}` : "");

  let markersData = [];
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) {
      markersData = data;
    }
  } catch (e) {
    markersData = [];
  }

  // Маркеруудыг шинэчлэх
  if (markersLayer.value) {
    markersLayer.value.clearLayers();
  }
  markersLayer.value = L.markerClusterGroup();
  markersData.forEach((marker: any) => {
    if (marker.lat && marker.lng) {
      const leafletMarker = L.marker([
        parseFloat(marker.lat),
        parseFloat(marker.lng),
      ]);
      leafletMarker.bindPopup(
        `<b>${marker.name}</b><br>${marker.address || ""}`
      );
      markersLayer.value.addLayer(leafletMarker);
    }
  });
  if (map.value) {
    map.value.addLayer(markersLayer.value);
  }
}

onMounted(() => {
  map.value = L.map("map").setView([47.9188691, 106.9175785], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map.value);
  markersLayer.value = L.markerClusterGroup();
  map.value.addLayer(markersLayer.value);
  fetchAndRenderMarkers();
});

watch(
  () => [props.district, props.khoroo, props.category],
  () => {
    fetchAndRenderMarkers();
  }
);
</script>
