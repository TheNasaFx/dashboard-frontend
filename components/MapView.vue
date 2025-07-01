<template>
  <div id="map" style="height: 700px; width: 100%; border-radius: 10px"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useAttrs } from "vue";
// import L from "leaflet";
// import "leaflet.markercluster";

interface MarkerData {
  id: number;
  lat: string;
  lng: string;
  name: string;
  address: string;
  all_barimt_ok: boolean;
}

const props = defineProps<{
  district: string;
  khoroo: string;
  category: string;
}>();

const map = ref<any>(null);
const markersLayer = ref<any>(null);
let L: any = null;
let markerClusterGroup: any = null;

// Улаан болон ногоон icon-ыг тодорхойлох
let redIcon: any = null;
let greenIcon: any = null;

async function fetchAndRenderMarkers() {
  if (!L) return;
  // API query string үүсгэх
  const params = new URLSearchParams();
  if (props.district) params.append("district", props.district);
  if (props.khoroo) params.append("khoroo", props.khoroo);
  const url =
    "http://localhost:8080/api/v1/centers" +
    (params.toString() ? `?${params.toString()}` : "");

  let markersData: MarkerData[] = [];
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data.data)) {
      markersData = data.data as MarkerData[];
    }
  } catch (e) {
    markersData = [];
  }

  // Маркеруудыг шинэчлэх
  if (markersLayer.value) {
    try {
      markersLayer.value.clearLayers();
    } catch (e) {}
  }
  markersLayer.value = markerClusterGroup();
  markersData.forEach((marker: MarkerData) => {
    const lat = parseFloat(marker.lat);
    const lng = parseFloat(marker.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      // all_barimt_ok утгаар өнгө сонгоно
      let icon = marker.all_barimt_ok ? greenIcon : redIcon;
      const leafletMarker = L.marker([lat, lng], { icon });
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
          <div style='display:flex;align-items:center;gap:6px;'>
            <a href='/entity?id=${
              marker.id
            }' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a>
            <span style='font-size:12px;color:#888;'>(2025/06/21 нд шинчлэгдсэн)</span>
          </div>
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
  if (typeof window === "undefined") return;
  const leaflet = await import("leaflet");
  L = leaflet.default;
  await import("leaflet.markercluster");
  markerClusterGroup = () => L.markerClusterGroup();

  redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // map дахин үүсгэгдэхэд хуучин map-ийг устгана
  if (map.value && map.value._leaflet_id) {
    map.value.remove();
  }

  map.value = L.map("map").setView([47.9188691, 106.9175785], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map.value);
  markersLayer.value = markerClusterGroup();
  map.value.addLayer(markersLayer.value);
  await fetchAndRenderMarkers();

  // KML layer loading using dynamic import
  try {
    const omnivoreImport = await import("@mapbox/leaflet-omnivore");
    const omnivore = omnivoreImport.default || omnivoreImport;
    const kmlLayer = omnivore
      .kml("/duureg.kml")
      // .on("ready", function () {
      //   map.value.fitBounds(kmlLayer.getBounds());
      // })
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
  } catch (e) {
    console.error("KML layer load error", e);
  }
});

watch(
  () => [props.district, props.khoroo, props.category],
  () => {
    fetchAndRenderMarkers();
  }
);
</script>
