<template>
  <div>
    <div
      id="market-map"
      style="width: 100%; height: 400px; border-radius: 10px"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCache } from "../composables/useCache";
import { useApi } from "../composables/useApi";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

const { get, set } = useCache();

const props = defineProps({
  centerId: Number
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
  
  const [{ default: L }, _, { default: markerClusterGroup }] = await Promise.all([
    import("leaflet"),
    import("leaflet/dist/leaflet.css"),
    import("leaflet.markercluster")
  ]);
  
  // Import marker cluster CSS
  await import("leaflet.markercluster/dist/MarkerCluster.css");
  await import("leaflet.markercluster/dist/MarkerCluster.Default.css");
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

  // Create separate cluster groups for green and red markers
  const greenClusterGroup = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      const childCount = cluster.getChildCount();
      let c = ' marker-cluster-green';
      if (childCount < 10) {
        c += ' marker-cluster-small';
      } else if (childCount < 100) {
        c += ' marker-cluster-medium';
      } else {
        c += ' marker-cluster-large';
      }
      
      return new L.DivIcon({
        html: '<div><span>' + childCount + '</span></div>',
        className: 'marker-cluster' + c,
        iconSize: new L.Point(40, 40)
      });
    },
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 50,
    disableClusteringAtZoom: 18
  });

  const redClusterGroup = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      const childCount = cluster.getChildCount();
      let c = ' marker-cluster-red';
      if (childCount < 10) {
        c += ' marker-cluster-small';
      } else if (childCount < 100) {
        c += ' marker-cluster-medium';
      } else {
        c += ' marker-cluster-large';
      }
      
      return new L.DivIcon({
        html: '<div><span>' + childCount + '</span></div>',
        className: 'marker-cluster' + c,
        iconSize: new L.Point(40, 40)
      });
    },
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 50,
    disableClusteringAtZoom: 18
  });

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
          .bindPopup(popupHtml);
        
        // Add marker to appropriate cluster group based on color
        if (org.has_ebarimt) {
          greenClusterGroup.addLayer(marker);
          marker._myClusterGroup = greenClusterGroup;
        } else {
          redClusterGroup.addLayer(marker);
          marker._myClusterGroup = redClusterGroup;
        }
        
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
            
            // Check if marker needs to change cluster group
            const newHasEbarimt = org.has_ebarimt;
            const oldClusterGroup = marker._myClusterGroup;
            const newClusterGroup = newHasEbarimt ? greenClusterGroup : redClusterGroup;
            
            // Only change cluster group if needed
            if (oldClusterGroup !== newClusterGroup) {
              // Remove from old cluster group
              if (oldClusterGroup) {
                oldClusterGroup.removeLayer(marker);
              }
              
              // Add to new cluster group
              newClusterGroup.addLayer(marker);
              marker._myClusterGroup = newClusterGroup;
            }
            
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
  
  // Add cluster groups to map
  map.value.addLayer(greenClusterGroup);
  map.value.addLayer(redClusterGroup);
  
  console.log(`Total markers added: ${markerCount}`);
});
</script>

<style scoped>
.ebarimt-stats {
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ebarimt-stats .card {
  border: none;
  box-shadow: none;
}

.ebarimt-stats .card-title {
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
}

.ebarimt-stats .fs-16 {
  font-size: 1.2rem !important;
}

.ebarimt-stats .fs-11 {
  font-size: 0.75rem !important;
}

.ebarimt-stats .border {
  border-color: #dee2e6 !important;
}

.ebarimt-stats .text-primary {
  color: #007bff !important;
}

.ebarimt-stats .text-success {
  color: #28a745 !important;
}

.ebarimt-stats .text-muted {
  color: #6c757d !important;
}
</style>

<style>
/* Global styles for marker clusters - need to be global to affect Leaflet */
.marker-cluster-green {
  background-color: rgba(40, 167, 69, 0.6);
}

.marker-cluster-green div {
  background-color: rgba(40, 167, 69, 0.8);
  border-radius: 20px;
}

.marker-cluster-green div span {
  color: white;
  font-weight: bold;
  line-height: 40px;
}

.marker-cluster-red {
  background-color: rgba(220, 53, 69, 0.6);
}

.marker-cluster-red div {
  background-color: rgba(220, 53, 69, 0.8);
  border-radius: 20px;
}

.marker-cluster-red div span {
  color: white;
  font-weight: bold;
  line-height: 40px;
}

.marker-cluster-small {
  width: 40px;
  height: 40px;
}

.marker-cluster-small div {
  width: 30px;
  height: 30px;
  margin: 5px;
}

.marker-cluster-small div span {
  line-height: 30px;
  font-size: 12px;
}

.marker-cluster-medium {
  width: 50px;
  height: 50px;
}

.marker-cluster-medium div {
  width: 40px;
  height: 40px;
  margin: 5px;
}

.marker-cluster-medium div span {
  line-height: 40px;
  font-size: 14px;
}

.marker-cluster-large {
  width: 60px;
  height: 60px;
}

.marker-cluster-large div {
  width: 50px;
  height: 50px;
  margin: 5px;
}

.marker-cluster-large div span {
  line-height: 50px;
  font-size: 16px;
}
</style>
