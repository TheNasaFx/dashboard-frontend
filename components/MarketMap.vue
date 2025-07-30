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
    // Only fetch ebarimt data - remove other API calls
    const ebarimtRes = await useApi(`/ebarimt/${org.mrch_regno}`);

    // Process е-баримт data
    if (ebarimtRes.success && ebarimtRes.data) {
      const ebarimtData = ebarimtRes.data;
      org.count_receipt = ebarimtData.count_receipt ?? 0;
      org.cnt_3 = ebarimtData.cnt_3 ?? 0;
      org.cnt_30 = ebarimtData.cnt_30 ?? 0;
      // Cache the data
      set(`ebarimt_${org.mrch_regno}`, ebarimtData);
    }

    // Determine color based on е-баримт data (3 or 30 days)
    org.has_ebarimt = (org.cnt_3 > 0) || (org.cnt_30 > 0);
    
    console.log(`Ebarimt data loaded for ${org.mrch_regno}:`, {
      cnt_3: org.cnt_3,
      cnt_30: org.cnt_30,
      has_ebarimt: org.has_ebarimt
    });

    return org;
  } catch (error) {
    console.error(`Error loading ebarimt data for ${org.mrch_regno}:`, error);
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
    cnt_3: 0,
    cnt_30: 0,
    has_ebarimt: false // Default color - will be updated based on ebarimt data
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

  // Load ebarimt data for all organizations in parallel
  console.log("Loading ebarimt data for all organizations...");
  const ebarimtPromises = orgs.map(async (org) => {
    if (!org.mrch_regno) return org;
    
    try {
      const ebarimtRes = await useApi(`/ebarimt/${org.mrch_regno}`);
      if (ebarimtRes.success && ebarimtRes.data) {
        const ebarimtData = ebarimtRes.data;
        org.cnt_3 = ebarimtData.cnt_3 ?? 0;
        org.cnt_30 = ebarimtData.cnt_30 ?? 0;
        org.has_ebarimt = (org.cnt_3 > 0) || (org.cnt_30 > 0);
        // Cache the data
        set(`ebarimt_${org.mrch_regno}`, ebarimtData);
      }
    } catch (error) {
      console.error(`Error loading ebarimt data for ${org.mrch_regno}:`, error);
    }
    return org;
  });

  // Wait for all ebarimt data to load
  await Promise.all(ebarimtPromises);
  console.log("All ebarimt data loaded:", orgs);

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
    console.log("Processing org:", org.stor_name, "lat:", org.lat, "lng:", org.lng, "has_ebarimt:", org.has_ebarimt);
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
              ${!org.cnt_3 || org.cnt_3 === 0 ? 
                '<span style="color:#dc3545;">0</span>' : 
                `<span style="color:#28a745;">${org.cnt_3}</span>`
              }
            </div>
            
            <div style='margin-bottom:6px;'><b>И-Баримт сүүлийн 30 хоногт:</b> 
              ${!org.cnt_30 || org.cnt_30 === 0 ? 
                '<span style="color:#dc3545;">0</span>' : 
                `<span style="color:#28a745;">${org.cnt_30}</span>`
              }
            </div>
            
            <div style='margin-top:10px; padding-top:8px; border-top:1px solid #dee2e6; text-align:center;'>
              <small style='color:#6c757d;'>🏢 Үйл ажиллагааны чиглэл: ${org.op_type_name || 'Тодорхойгүй'}</small>
            </div>
          </div>
        `;
        // has_ebarimt бол ногоон, үгүй бол улаан icon
        const markerIcon = org.has_ebarimt ? greenIcon : redIcon;
        const marker = L.marker([lat, lng], { icon: markerIcon })
          .addTo(map.value)
          .bindPopup(popupHtml);
        
        // Click event listener нэмэх - е-баримтын мэдээлэл дуудах (refresh only)
        marker.on('click', async () => {
          console.log(`Marker clicked for ${org.stor_name}, refreshing ebarimt data...`);
          
          // Show loading popup first
          const loadingPopup = `
            <div style='min-width:280px; text-align:center; padding:20px;'>
              <div style='margin-bottom:10px;'>
                <h6 style='margin:0; color:#495057;'>${org.stor_name || 'Е-баримтын мэдээлэл шинэчилж байна...'}</h6>
              </div>
              <div style='color:#6c757d;'>
                <i>📊 Е-баримтын мэдээлэл шинэчилж байна...</i>
              </div>
            </div>
          `;
          marker.setPopupContent(loadingPopup);
          
          try {
            // Refresh ebarimt data
            const updatedOrg = await loadDetailedOrganizationData(org);
            
            // Update the org object
            Object.assign(org, updatedOrg);
            
            // Update marker icon based on new data
            const newIcon = org.has_ebarimt ? greenIcon : redIcon;
            marker.setIcon(newIcon);
            
            // Update popup with refreshed data
            const detailedPopupHtml = `
              <div style='min-width:280px; max-width:350px; font-size:13px;'>
                <div style='background:#f8f9fa; padding:8px; border-radius:5px; margin-bottom:10px; text-align:center;'>
                  <h6 style='margin:0; color:#495057; font-weight:bold;'>${org.stor_name || 'Тасгийн нэр байхгүй'}</h6>
                  <small style='color:#6c757d;'>Давхар: ${org.stor_floor || '-'}</small>
                </div>
                
                <div style='margin-bottom:6px;'><b>Бүртгэл:</b> <span style='color:#0066cc;'>${org.mrch_regno || '-'}</span></div>
                
                <div style='margin-bottom:6px;'><b>Нэгж талбарын дугаар:</b> <span style='color:#6c757d;'>${org.parcel_id || '-'}</span></div>
                
                <div style='margin-bottom:6px;'><b>И-Баримт сүүлийн 3 хоногт:</b> 
                  ${!org.cnt_3 || org.cnt_3 === 0 ? 
                    '<span style="color:#dc3545;">0</span>' : 
                    `<span style="color:#28a745;">${org.cnt_3}</span>`
                  }
                </div>
                
                <div style='margin-bottom:6px;'><b>И-Баримт сүүлийн 30 хоногт:</b> 
                  ${!org.cnt_30 || org.cnt_30 === 0 ? 
                    '<span style="color:#dc3545;">0</span>' : 
                    `<span style="color:#28a745;">${org.cnt_30}</span>`
                  }
                </div>
                
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
            console.error('Error refreshing ebarimt data:', error);
            const errorPopup = `
              <div style='min-width:280px; text-align:center; padding:20px;'>
                <div style='margin-bottom:10px;'>
                  <h6 style='margin:0; color:#dc3545;'>${org.stor_name || 'Алдаа гарлаа'}</h6>
                </div>
                <div style='color:#dc3545;'>
                  <i>❌ Е-баримтын мэдээлэл шинэчлэхэд алдаа гарлаа</i>
                </div>
              </div>
            `;
            marker.setPopupContent(errorPopup);
          }
        });
        
        markerCount++;
        console.log(`Added marker ${markerCount} for ${org.stor_name} at [${lat}, ${lng}] with color: ${org.has_ebarimt ? 'green' : 'red'}`);
      }
    }
  });
  
  console.log(`Total markers added: ${markerCount}`);
});
</script>
