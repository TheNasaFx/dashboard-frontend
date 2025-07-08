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



  // Байгууллага бүрийн дэлгэрэнгүй мэдээлэл авч нэгтгэх (шинэ шаардлагын дагуу)
  orgs = await Promise.all(
    orgs.map(async (org) => {
      if (org.mrch_regno) {
        try {
          // И-баримтын мэдээлэл (PAY_MARKET_BARIMT-аас PIN-ээр COUNT_RECEIPT)
          const ebarimtRes = await fetch(`http://localhost:8080/api/ebarimt/${org.mrch_regno}`);
          const ebarimtJson = await ebarimtRes.json();
          org.count_receipt = ebarimtJson?.data?.count_receipt ?? 0;
        } catch (e) {
          org.count_receipt = 0;
        }

        try {
          // Тайлангийн мэдээлэл (V_E_TUB_REPORT_DATA-аас TIN-ээр SUBMITTED_DATE)
          const reportRes = await fetch(`http://localhost:8080/api/v1/tub-report-data?tin=${org.mrch_regno}`);
          const reportJson = await reportRes.json();
          const reportData = reportJson.data;
          if (Array.isArray(reportData) && reportData.length > 0) {
            const latestReport = reportData.reduce((latest, current) => {
              if (!latest.submitted_date) return current;
              if (!current.submitted_date) return latest;
              return new Date(current.submitted_date) > new Date(latest.submitted_date) ? current : latest;
            });
            org.report_submitted_date = latestReport.submitted_date || '-';
          } else {
            org.report_submitted_date = '-';
          }
        } catch (e) {
          org.report_submitted_date = '-';
        }

        try {
          // Төлөлтийн мэдээлэл (V_E_TUB_PAYMENTS-аас PIN-ээр AMOUNT нийлбэр)
          const paymentRes = await fetch(`http://localhost:8080/api/v1/payments/${org.mrch_regno}`);
          const paymentJson = await paymentRes.json();
          if (paymentJson.success && paymentJson.data && paymentJson.data.total_amount) {
            org.payment_amount = paymentJson.data.total_amount;
          } else {
            org.payment_amount = 0;
          }
        } catch (e) {
          org.payment_amount = 0;
        }

        try {
          // Өрийн үлдэгдэл (V_ACCOUNT_GENERAL_YEAR-аас PIN-ээр C2_DEBIT нийлбэр)
          const debtRes = await fetch(`http://localhost:8080/api/v1/account-general-years?regno=${org.mrch_regno}&tab=debt`);
          const debtJson = await debtRes.json();
          if (Array.isArray(debtJson) && debtJson.length > 0) {
            const totalDebt = debtJson.reduce((total, record) => {
              const c2Debit = record.C2_DEBIT || 0;
              return total + parseFloat(c2Debit);
            }, 0);
            org.debt_amount = totalDebt;
          } else {
            org.debt_amount = 0;
          }
        } catch (e) {
          org.debt_amount = 0;
        }
      } else {
        org.count_receipt = 0;
        org.report_submitted_date = '-';
        org.payment_amount = 0;
        org.debt_amount = 0;
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
        // Popup-д дэлгэрэнгүй мэдээлэл харуулах (Entity хуудас дээрх хүснэгт шиг)
        function formatNumber(num) {
          if (num === null || num === undefined || isNaN(num)) return '0';
          return Number(num).toLocaleString('en-US');
        }
        
        let popupHtml = `
          <div style='min-width:280px; max-width:350px; font-size:13px;'>
            <div style='background:#f8f9fa; padding:8px; border-radius:5px; margin-bottom:10px; text-align:center;'>
              <h6 style='margin:0; color:#495057; font-weight:bold;'>${org.stor_name || 'Тасгийн нэр байхгүй'}</h6>
              <small style='color:#6c757d;'>Давхар: ${org.stor_floor || '-'}</small>
            </div>
            
            <div style='margin-bottom:6px;'><b>Бүртгэл:</b> <span style='color:#0066cc;'>${org.mrch_regno || '-'}</span></div>
            
            <div style='margin-bottom:6px;'><b>И-Баримт сүүлийн 72цагт:</b> 
              ${!org.count_receipt || org.count_receipt === 0 ? 
                '<span style="color:#dc3545;">И-баримт гаргадаггүй</span>' : 
                `<span style="color:#28a745;">${org.count_receipt}</span>`
              }
            </div>
            
            <div style='margin-bottom:6px;'><b>Зөвшөөрлийн мэдээ:</b> <span style='color:#6c757d;'>0</span></div>
            
            <div style='margin-bottom:6px;'><b>Тайлан:</b> <span style='color:#17a2b8;'>${org.report_submitted_date || '-'}</span></div>
            
            <div style='margin-bottom:6px;'><b>Төлөлт:</b> <span style='color:#28a745; font-weight:bold;'>${formatNumber(org.payment_amount)}₮</span></div>
            
            <div style='margin-bottom:6px;'><b>Өрийн үлдэгдэл:</b> <span style='color:#dc3545; font-weight:bold;'>${formatNumber(org.debt_amount)}₮</span></div>
            
            <div style='margin-bottom:6px;'><b>Туслан зөвлөх үйлчилгээ:</b> <span style='color:#6c757d;'>0</span></div>
            
            <div style='margin-bottom:6px;'><b>Зөрчлийн мэдээлэл:</b> <span style='color:#6c757d;'>0</span></div>
            
            <div style='margin-top:10px; padding-top:8px; border-top:1px solid #dee2e6; text-align:center;'>
              <small style='color:#6c757d;'>🏢 Үйл ажиллагааны чиглэл: ${org.op_type_name || 'Тодорхойгүй'}</small>
            </div>
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
