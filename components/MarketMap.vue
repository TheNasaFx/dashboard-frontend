<template>
  <div
    id="market-map"
    style="width: 100%; height: 400px; border-radius: 10px"
  ></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCache } from "../composables/useCache";
import { useApi } from "../composables/useApi";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

const { get, set } = useCache();

const props = defineProps({
  centerId: Number,
});

const map = ref(null);

onMounted(async () => {
  console.log("MarketMap mounted with centerId:", props.centerId);
  if (typeof window === "undefined") return;
  
  if (!props.centerId) {
    console.error("centerId is not provided to MarketMap component");
    return;
  }
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
  console.log("Fetching organizations for centerId:", props.centerId);
  const res = await useApi(`/buildings/${props.centerId}/organizations`);
  console.log("API response:", res);
  
  let orgs = [];
  if (res.success && res.data) {
    // API response-ийн бүтцийг шалгах
    if (Array.isArray(res.data)) {
      orgs = res.data;
      console.log("Using res.data directly (array)");
    } else if (res.data.data && Array.isArray(res.data.data)) {
      orgs = res.data.data;
      console.log("Using res.data.data (nested array)");
    } else {
      orgs = [];
      console.log("No valid data structure found");
    }
  } else {
    orgs = [];
    console.log("API call failed or no data");
  }



  // Байгууллага бүрийн дэлгэрэнгүй мэдээлэл авч нэгтгэх (шинэ шаардлагын дагуу)
  orgs = await Promise.all(
    orgs.map(async (org) => {
      if (org.mrch_regno) {
        try {
          // И-баримтын мэдээлэл (V_E_TUB_PAY_MARKET_EBARIMT-аас MRCH_REGNO-ээр CNT_3, CNT_30)
          const ebarimtCacheKey = `ebarimt_${org.mrch_regno}`;
          let ebarimtData = get(ebarimtCacheKey);
          
          if (ebarimtData) {
            org.count_receipt = ebarimtData.count_receipt ?? 0;
            org.cnt_3 = ebarimtData.cnt_3 ?? 0;
            org.cnt_30 = ebarimtData.cnt_30 ?? 0;
          } else {
            const ebarimtRes = await useApi(`/ebarimt/${org.mrch_regno}`);
            if (ebarimtRes.success && ebarimtRes.data) {
              ebarimtData = ebarimtRes.data;
              org.count_receipt = ebarimtData.count_receipt ?? 0;
              org.cnt_3 = ebarimtData.cnt_3 ?? 0;
              org.cnt_30 = ebarimtData.cnt_30 ?? 0;
              set(ebarimtCacheKey, ebarimtData);
            } else {
              org.count_receipt = 0;
              org.cnt_3 = 0;
              org.cnt_30 = 0;
            }
          }
        } catch (e) {
          org.count_receipt = 0;
          org.cnt_3 = 0;
          org.cnt_30 = 0;
        }

        try {
          // Тайлангийн мэдээлэл (V_E_TUB_REPORT_DATA-аас TIN-ээр SUBMITTED_DATE)
          const reportCacheKey = `report_${org.mrch_regno}`;
          let reportData = get(reportCacheKey);
          
          if (reportData) {
            if (Array.isArray(reportData) && reportData.length > 0) {
              // Тайлангийн тоог тоолох
              org.report_count = reportData.length;
              const latestReport = reportData.reduce((latest, current) => {
                if (!latest.submitted_date) return current;
                if (!current.submitted_date) return latest;
                return new Date(current.submitted_date) > new Date(latest.submitted_date) ? current : latest;
              });
              org.report_submitted_date = latestReport.submitted_date || '-';
            } else {
              org.report_count = 0;
              org.report_submitted_date = '-';
            }
          } else {
            const reportRes = await useApi(`/tub-report-data?tin=${org.mrch_regno}`);
            if (reportRes.success && reportRes.data) {
              reportData = reportRes.data;
              set(reportCacheKey, reportData);
              
              if (Array.isArray(reportData) && reportData.length > 0) {
                // Тайлангийн тоог тоолох
                org.report_count = reportData.length;
                const latestReport = reportData.reduce((latest, current) => {
                  if (!latest.submitted_date) return current;
                  if (!current.submitted_date) return latest;
                  return new Date(current.submitted_date) > new Date(latest.submitted_date) ? current : latest;
                });
                org.report_submitted_date = latestReport.submitted_date || '-';
              } else {
                org.report_count = 0;
                org.report_submitted_date = '-';
              }
            } else {
              org.report_count = 0;
              org.report_submitted_date = '-';
            }
          }
        } catch (e) {
          org.report_count = 0;
          org.report_submitted_date = '-';
        }

        try {
          // Төлөлтийн мэдээлэл (V_E_TUB_PAYMENTS-аас PIN-ээр AMOUNT нийлбэр)
          const paymentCacheKey = `payment_${org.mrch_regno}`;
          let paymentData = get(paymentCacheKey);
          
          if (paymentData) {
            if (Array.isArray(paymentData) && paymentData.length > 0) {
              // Нийт төлөлтийн дүнг тооцоолох
              const totalPayment = paymentData.reduce((total, payment) => {
                const amount = payment.amount || 0;
                return total + parseFloat(amount);
              }, 0);
              org.payment_amount = totalPayment;
            } else {
              org.payment_amount = 0;
            }
          } else {
            const paymentRes = await useApi(`/payments/${org.mrch_regno}`);
            if (paymentRes.success && paymentRes.data) {
              paymentData = paymentRes.data;
              set(paymentCacheKey, paymentData);
              
              if (Array.isArray(paymentData) && paymentData.length > 0) {
                // Нийт төлөлтийн дүнг тооцоолох
                const totalPayment = paymentData.reduce((total, payment) => {
                  const amount = payment.amount || 0;
                  return total + parseFloat(amount);
                }, 0);
                org.payment_amount = totalPayment;
              } else {
                org.payment_amount = 0;
              }
            } else {
              org.payment_amount = 0;
            }
          }
        } catch (e) {
          org.payment_amount = 0;
        }

        try {
          // Өрийн үлдэгдэл (V_ACCOUNT_GENERAL_YEAR-аас PIN-ээр C2_DEBIT нийлбэр)
          const debtCacheKey = `debt_${org.mrch_regno}`;
          let debtData = get(debtCacheKey);
          
          if (debtData) {
            if (Array.isArray(debtData) && debtData.length > 0) {
              // Нийт өрийн дүнг тооцоолох
              const totalDebt = debtData.reduce((total, record) => {
                const c2Debit = record.C2_DEBIT || 0;
                return total + parseFloat(c2Debit);
              }, 0);
              org.debt_amount = totalDebt;
            } else {
              org.debt_amount = 0;
            }
          } else {
            const debtRes = await useApi(`/account-general-years?regno=${org.mrch_regno}&tab=debt`);
            if (debtRes.success && debtRes.data) {
              debtData = debtRes.data;
              set(debtCacheKey, debtData);
              
              if (Array.isArray(debtData) && debtData.length > 0) {
                // Нийт өрийн дүнг тооцоолох
                const totalDebt = debtData.reduce((total, record) => {
                  const c2Debit = record.C2_DEBIT || 0;
                  return total + parseFloat(c2Debit);
                }, 0);
                org.debt_amount = totalDebt;
              } else {
                org.debt_amount = 0;
              }
            } else {
              org.debt_amount = 0;
            }
          }
        } catch (e) {
          org.debt_amount = 0;
        }
      } else {
        org.count_receipt = 0;
        org.cnt_3 = 0;
        org.cnt_30 = 0;
        org.report_count = 0;
        org.report_submitted_date = '-';
        org.payment_amount = 0;
        org.debt_amount = 0;
      }

      return org;
    })
  );

  console.log("orgs:", orgs); // debug
  console.log("orgs length:", orgs ? orgs.length : 0);
  console.log("orgs is array:", Array.isArray(orgs));

  if (!Array.isArray(orgs)) {
    console.error("API array буцаагаагүй:", orgs);
    return;
  }
  
  if (orgs.length === 0) {
    console.warn("Байгууллагын жагсаалт хоосон байна");
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

  console.log("Adding markers to map...");
  let markerCount = 0;

  orgs.forEach((org) => {
    console.log("Processing org:", org.stor_name, "lat:", org.lat, "lng:", org.lng);
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
            
            <div style='margin-bottom:6px;'><b>Нэгж талбарын дугаар:</b> <span style='color:#6c757d;'>${org.parcel_id || '-'}</span></div>
            
            <div style='margin-bottom:6px;'><b>И-Баримт сүүлийн 3 хоногт:</b> 
              ${!org.count_receipt || org.count_receipt === 0 ? 
                '<span style="color:#dc3545;">0</span>' : 
                `<span style="color:#28a745;">${org.count_receipt}</span>`
              }
            </div>
            
            <div style='margin-bottom:6px;'><b>И-Баримт сүүлийн 30 хоногт:</b> 
              ${!org.cnt_30 || org.cnt_30 === 0 ? 
                '<span style="color:#dc3545;">0</span>' : 
                `<span style="color:#28a745;">${org.cnt_30}</span>`
              }
            </div>
            
            <div style='margin-bottom:6px;'><b>Зөвшөөрлийн мэдээ:</b> <span style='color:#6c757d;'>0</span></div>
            
            <div style='margin-bottom:6px;'><b>Тайлан:</b> <span style='color:#17a2b8;'>${org.report_count || 0}</span></div>
            
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
        markerCount++;
        console.log(`Added marker ${markerCount} for ${org.stor_name} at [${lat}, ${lng}]`);
      }
    }
  });
  
  console.log(`Total markers added: ${markerCount}`);
});
</script>
