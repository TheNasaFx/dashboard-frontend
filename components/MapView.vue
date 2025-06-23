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
  const url =
    "http://localhost:8080/api/centers" +
    (params.toString() ? `?${params.toString()}` : "");

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
  markersData.forEach((marker) => {
    const lat = parseFloat(marker.lat);
    const lng = parseFloat(marker.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      const leafletMarker = L.marker([lat, lng]);
      const popupHtml = `
        <div style='width:240px'>
          <div style='text-align:center;'>
            <img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
            <div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${
              marker.name
            }</div>
          </div>
          <div style='font-size:13px;margin-bottom:8px;'>${
            marker.address || ""
          }</div>
          <a href='/entity?id=${
            marker.id
          }' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a>
        </div>
      `;
      leafletMarker.bindPopup(popupHtml);
      markersLayer.value.addLayer(leafletMarker);
    }
  });
  if (map.value) {
    map.value.addLayer(markersLayer.value);
  }
}

onMounted(async () => {
  map.value = L.map("map").setView([47.9188691, 106.9175785], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map.value);
  markersLayer.value = L.markerClusterGroup();
  map.value.addLayer(markersLayer.value);
  fetchAndRenderMarkers();

  // KML layer loading using dynamic import
  const omnivore = (await import("@mapbox/leaflet-omnivore")).default;
  const kmlLayer = omnivore
    .kml("/duureg.kml")
    .on("ready", function () {
      map.value.fitBounds(kmlLayer.getBounds());
    })
    .on("click", function (e: any) {
      const layer = e.layer;
      const name = layer.feature?.properties?.name;
      const description = layer.feature?.properties?.description;
      let content = "";
      if (name) content += `<strong>${name}</strong><br/>`;
      if (description) content += `${description}`;
      layer.bindPopup(content).openPopup();
    });
  kmlLayer.addTo(map.value);
});

watch(
  () => [props.district, props.khoroo, props.category],
  () => {
    fetchAndRenderMarkers();
  }
);
</script>
