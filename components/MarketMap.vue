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

// Pin point click хийхэд дэлгэрэнгүй мэдээлэл дуудах функц
async function loadDetailedOrganizationData(org) {
  if (!org.mrch_regno) return org;
  
  console.log(`Loading detailed data for organization: ${org.mrch_regno}`);
  
  // Show loading state
  const originalData = { ...org };
  
  try {
    // Parallel fetch all detailed data
    const [ebarimtRes, reportRes, paymentRes, debtRes] = await Promise.all([
      // И-баримтын мэдээлэл 
      useApi(`/ebarimt/${org.mrch_regno}`),
      // Тайлангийн мэдээлэл
      useApi(`/tub-report-data?tin=${org.mrch_regno}`),
      // Төлөлтийн мэдээлэл 
      useApi(`/payments/${org.mrch_regno}`),
      // Өрийн мэдээлэл
      useApi(`/account-general-years?regno=${org.mrch_regno}&tab=debt`)
    ]);

    // Process е-баримт data
    if (ebarimtRes.success && ebarimtRes.data) {
      const ebarimtData = ebarimtRes.data;
      org.count_receipt = ebarimtData.count_receipt ?? 0;
      org.cnt_3 = ebarimtData.cnt_3 ?? 0;
      org.cnt_30 = ebarimtData.cnt_30 ?? 0;
      // Cache the data
      set(`ebarimt_${org.mrch_regno}`, ebarimtData);
    }

    // Process report data
    if (reportRes.success && reportRes.data) {
      const reportData = reportRes.data;
      if (Array.isArray(reportData) && reportData.length > 0) {
        org.report_count = reportData.length;
        const latestReport = reportData.reduce((latest, current) => {
          if (!latest.submitted_date) return current;
          if (!current.submitted_date) return latest;
          return new Date(current.submitted_date) > new Date(latest.submitted_date) ? current : latest;
        });
        org.latest_report_date = latestReport.submitted_date || '';
      }
      set(`report_${org.mrch_regno}`, reportData);
    }

    // Process payment data
    if (paymentRes.success && paymentRes.data) {
      const paymentData = paymentRes.data;
      if (Array.isArray(paymentData) && paymentData.length > 0) {
        const totalPayment = paymentData.reduce((total, payment) => {
          return total + (parseFloat(payment.amount) || 0);
        }, 0);
        org.payment_amount = totalPayment;
      }
      set(`payment_${org.mrch_regno}`, paymentData);
    }

    // Process debt data
    if (debtRes.success && debtRes.data) {
      const debtData = debtRes.data;
      if (Array.isArray(debtData) && debtData.length > 0) {
        const totalDebt = debtData.reduce((total, record) => {
          return total + (parseFloat(record.C2_DEBIT) || 0);
        }, 0);
        org.debt_amount = totalDebt;
      }
      set(`debt_${org.mrch_regno}`, debtData);
    }

    // Determine color based on е-баримт data
    org.all_barimt_ok = org.count_receipt > 0;
    
    console.log(`Detailed data loaded for ${org.mrch_regno}:`, {
      count_receipt: org.count_receipt,
      report_count: org.report_count,
      payment_amount: org.payment_amount,
      debt_amount: org.debt_amount
    });

    return org;
  } catch (error) {
    console.error(`Error loading detailed data for ${org.mrch_regno}:`, error);
    return originalData; // Return original data if error
  }
}

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



  // Байгууллага бүрийн үндсэн мэдээлэл харуулах (API дуудалтгүйгээр)
  orgs = orgs.map((org) => ({
    ...org,
    // Initialize with default values - detailed data will be loaded on click
    count_receipt: 0,
    cnt_3: 0,
    cnt_30: 0,
    report_count: 0,
    latest_report_date: '',
    payment_amount: 0,
    debt_amount: 0,
    all_barimt_ok: false // Default color
  }));

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
        const marker = L.marker([lat, lng], { icon: markerIcon })
          .addTo(map.value)
          .bindPopup(popupHtml);
        
        // Click event listener нэмэх - дэлгэрэнгүй мэдээлэл дуудах
        marker.on('click', async () => {
          console.log(`Marker clicked for ${org.stor_name}, loading detailed data...`);
          
          // Show loading popup first
          const loadingPopup = `
            <div style='min-width:280px; text-align:center; padding:20px;'>
              <div style='margin-bottom:10px;'>
                <h6 style='margin:0; color:#495057;'>${org.stor_name || 'Мэдээлэл татаж байна...'}</h6>
              </div>
              <div style='color:#6c757d;'>
                <i>📊 Дэлгэрэнгүй мэдээлэл татаж байна...</i>
              </div>
            </div>
          `;
          marker.setPopupContent(loadingPopup);
          
          try {
            // Load detailed data
            const updatedOrg = await loadDetailedOrganizationData(org);
            
            // Update the org object
            Object.assign(org, updatedOrg);
            
            // Update marker icon based on new data
            const newIcon = org.count_receipt && org.count_receipt > 0 ? greenIcon : redIcon;
            marker.setIcon(newIcon);
            
            // Update popup with detailed data
            const detailedPopupHtml = `
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
                
                <div style='margin-top:8px; padding-top:6px; border-top:1px solid #dee2e6; text-align:center;'>
                  <small style='color:#28a745;'>✅ Мэдээлэл шинэчлэгдлээ</small>
                </div>
              </div>
            `;
            marker.setPopupContent(detailedPopupHtml);
            
          } catch (error) {
            console.error('Error loading detailed data:', error);
            const errorPopup = `
              <div style='min-width:280px; text-align:center; padding:20px;'>
                <div style='margin-bottom:10px;'>
                  <h6 style='margin:0; color:#dc3545;'>${org.stor_name || 'Алдаа гарлаа'}</h6>
                </div>
                <div style='color:#dc3545;'>
                  <i>❌ Мэдээлэл татахад алдаа гарлаа</i>
                </div>
              </div>
            `;
            marker.setPopupContent(errorPopup);
          }
        });
        
        markerCount++;
        console.log(`Added marker ${markerCount} for ${org.stor_name} at [${lat}, ${lng}]`);
      }
    }
  });
  
  console.log(`Total markers added: ${markerCount}`);
});
</script>
