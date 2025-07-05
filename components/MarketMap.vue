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
  // Custom icon-ууд (MapView.vue шиг)
  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  // Backend-ээс тухайн төвийн бүх байгууллагыг авна
  const res = await fetch(
    `http://localhost:8080/api/buildings/${props.centerId}/organizations`
  );
  let orgs = await res.json();

  // Байгууллага бүрийн mrch_regno-оор и-баримтын мэдээлэл авч нэгтгэх
  orgs = await Promise.all(
    orgs.map(async (org) => {
      if (org.mrch_regno) {
        try {
          const ebarimtRes = await fetch(`http://localhost:8080/api/ebarimt/${org.mrch_regno}`);
          const ebarimtJson = await ebarimtRes.json();
          org.count_receipt = ebarimtJson?.data?.count_receipt ?? 0;
        } catch (e) {
          org.count_receipt = 0;
        }
      } else {
        org.count_receipt = 0;
      }
      return org;
    })
  );

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
        // Popup-д дэлгэрэнгүй мэдээлэл харуулах
        let popupHtml = `
          <div style='min-width:220px;'>
            <div><b>Тасгийн нэр:</b> ${org.stor_name || '-'} </div>
            <div><b>Регистр:</b> ${org.mrch_regno || '-'} </div>
            <div><b>Давхар:</b> ${org.stor_floor || '-'} </div>
            <div><b>И-Баримт сүүлийн 72цагт:</b> <span style='color:${!org.count_receipt || org.count_receipt === 0 ? '#f04646' : '#19b86b'}'>${!org.count_receipt || org.count_receipt === 0 ? 'Үгүй' : 'Тийм'}</span></div>
            <div><b>Зөвшөөрлийн мэдээ:</b> 0</div>
            <div><b>Тайлан:</b> 0</div>
            <div><b>Төлөлт:</b> 0</div>
            <div><b>Өрийн үлдэгдэл:</b> 0</div>
            <div><b>Хөрөнгийн мэдээлэл:</b> `;
        if (org.pay_center_property) {
          if (org.pay_center_property.owner_regno && org.mrch_regno && org.pay_center_property.owner_regno.trim() === org.mrch_regno.trim()) {
            popupHtml += 'Хувийн эзэмшил';
          } else {
            popupHtml += 'Түрээсийн газар';
          }
          popupHtml += ` (${org.pay_center_property.property_size || '-'} м²)`;
        } else {
          popupHtml += '-';
        }
        popupHtml += `</div>
            <div><b>Туслан зөвлөх үйлчилгээ:</b> 0</div>
            <div><b>Зөрчлийн мэдээлэл:</b> 0</div>
          </div>
        `;
        // count_receipt > 0 бол ногоон, үгүй бол улаан icon
        const markerIcon = org.count_receipt && org.count_receipt > 0 ? greenIcon : redIcon;
        L.marker([lat, lng], { icon: markerIcon })
          .addTo(map.value)
          .bindPopup(popupHtml);
      }
    }
  });
});
</script>
