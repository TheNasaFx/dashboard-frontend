<template>
  <div id="map" style="height: 600px; width: 100%; border-radius: 10px"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(async () => {
  // Fetch marker data from API (or use static array for demo)
  let markersData = [];
  try {
    const res = await fetch("/api/positions");
    const data = await res.json();
    if (Array.isArray(data)) {
      markersData = data;
    }
  } catch (e) {
    // fallback: static marker
    markersData = [
      {
        lat: 47.9188691,
        lng: 106.9175785,
        name: "Go.to market",
        address: "СБД 7-р хороо",
      },
    ];
  }

  // 1. Map үүсгэх
  const map = L.map("map").setView([47.9188691, 106.9175785], 13);

  // 2. Tile layer нэмэх
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // 3. MarkerClusterGroup үүсгэх
  const markers = L.markerClusterGroup();

  // 4. Маркеруудыг нэмэх
  markersData.forEach((marker) => {
    if (marker.lat && marker.lng) {
      const leafletMarker = L.marker([
        parseFloat(marker.lat),
        parseFloat(marker.lng),
      ]);
      leafletMarker.bindPopup(
        `<b>${marker.name}</b><br>${marker.address || ""}`
      );
      markers.addLayer(leafletMarker);
    }
  });

  // 5. MarkerCluster-г map дээр нэмэх
  map.addLayer(markers);
});
</script>
