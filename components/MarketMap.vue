<template>
  <div
    id="market-map"
    style="width: 100%; height: 400px; border-radius: 10px"
  ></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

const props = defineProps({
  centerId: Number,
});

const map = ref(null);

onMounted(async () => {
  if (typeof window === "undefined") return;
  const [{ default: L }, _] = await Promise.all([
    import("leaflet"),
    import("leaflet/dist/leaflet.css"),
  ]);
  // Backend-ээс тухайн төвийн бүх байгууллагыг авна
  const res = await fetch(
    `http://localhost:8080/api/buildings/${props.centerId}/organizations`
  );
  const orgs = await res.json();
  console.log("orgs:", orgs); // debug

  if (!Array.isArray(orgs)) {
    console.error("API array буцаагаагүй:", orgs);
    return;
  }
  const first = orgs.find((o) => o.lat && o.lng);
  const center = first
    ? [parseFloat(first.lat), parseFloat(first.lng)]
    : [47.9188691, 106.9175785];

  // map дахин үүсгэгдэхэд хуучин map-ийг устгана
  if (map.value && map.value._leaflet_id) {
    map.value.remove();
  }

  map.value = L.map("market-map").setView(center, 17);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map.value);

  orgs.forEach((org) => {
    if (org.lat && org.lng) {
      const lat = parseFloat(org.lat);
      const lng = parseFloat(org.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        L.marker([lat, lng])
          .addTo(map.value)
          .bindPopup(org.stor_name || org.mar_name || "");
      }
    }
  });
});
</script>
