<template>
  <div id="map" style="height: 700px; width: 100%; border-radius: 10px; position: relative; z-index: 1;"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useAttrs } from "vue";
// import L from "leaflet";
// import "leaflet.markercluster";

interface LandData {
  COORD_Y?: any;
  COORD_X?: any;
  NAME?: any;
  PIN?: any;
  [key: string]: any;
}

const props = defineProps<{
  district?: string;
  khoroo?: string;
  category?: string;
  organizations?: any[] | null;
  searchLand?: LandData[];
}>();

const map = ref<any>(null);
const markersLayer = ref<any>(null);
let L: any = null;
let markerClusterGroup: any = null;
let redIcon: any = null;
let greenIcon: any = null;
let blueIcon: any = null;

// Simple cache for map data
const mapDataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // Reduced to 2 minutes for better responsiveness

// Function to clear cache
function clearMapDataCache() {
  mapDataCache.clear();
}

// Function to clear expired cache entries
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, value] of mapDataCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      mapDataCache.delete(key);
    }
  }
}

async function fetchMapDataCached(payCenterId: string) {
  const cacheKey = `map_data_${payCenterId}`;
  const now = Date.now();
  
  // Clean expired cache periodically
  if (Math.random() < 0.1) { // 10% chance to clean
    cleanExpiredCache();
  }
  
  // Check cache first
  if (mapDataCache.has(cacheKey)) {
    const cached = mapDataCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    // Remove expired cache
    mapDataCache.delete(cacheKey);
  }
  
  try {
    const response = await fetch(`http://localhost:8080/api/v1/map-data?pay_center_id=${payCenterId}`);
    const result = await response.json();
    
    // Cache the result
    mapDataCache.set(cacheKey, {
      data: result,
      timestamp: now
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching map data:', error);
    return {
      success: false,
      data: { owner_count: 0, activity_operators: 0, area: 0, tenants: 0 }
    };
  }
}

async function fetchPayCenterLocationsByRegno(regno: string) {
  if (!regno) return [];
  try {
    const res = await fetch(`http://localhost:8080/api/v1/pay-center-locations?regno=${regno}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
  } catch (e) {}
  return [];
}

async function fetchAndRenderMarkers() {
  console.log('=== fetchAndRenderMarkers START ===');
  if (!L) {
    console.error('Leaflet (L) is not loaded!');
    return;
  }
  console.log('Leaflet is loaded, proceeding...');

  console.log('=== MAP DEBUG START ===');
  console.log('organizations:', props.organizations);
  console.log('organizations length:', props.organizations?.length);
  console.log('searchLand:', props.searchLand);
  
  // Sample first organization
  if (props.organizations && props.organizations.length > 0) {
    console.log('First organization sample:', props.organizations[0]);
    console.log('First org lat:', props.organizations[0].lat);
    console.log('First org lng:', props.organizations[0].lng);
  }
  console.log('=== MAP DEBUG END ===');

  // 1. Байгууллагаар хайсан бол organizations pin-үүдийг харуулна
  if (props.organizations && Array.isArray(props.organizations) && props.organizations.length > 0) {
    console.log('Processing organizations section...');
    console.log('Organizations count:', props.organizations.length);
    
    if (markersLayer.value) {
      console.log('Clearing existing markers...');
      try { markersLayer.value.clearLayers(); } catch (e) {
        console.error('Error clearing markers:', e);
      }
    }
    
    console.log('Creating new marker cluster group...');
    markersLayer.value = L.markerClusterGroup();
    
    console.log('Starting marker creation loop...');
    let markersCreated = 0;
    
    // Create all markers simultaneously without individual API calls
    for (const org of props.organizations) {
      // Lat/lng parsing
      let lat, lng;
      
      if (typeof org.lat === 'string') {
        lat = parseFloat(org.lat);
      } else if (typeof org.lat === 'number') {
        lat = org.lat;
      } else {
        continue;
      }
      
      if (typeof org.lng === 'string') {
        lng = parseFloat(org.lng);
      } else if (typeof org.lng === 'number') {
        lng = org.lng;
      } else {
        continue;
      }
      
      // Only create marker if coordinates are valid
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        // Initial popup-д ачаалж байна гэсэн мэдээлэл харуулах
        let initialPopupHtml = `<div style='width:240px'>
          <img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
          <div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${org.name || 'Байгууллага'}</div>
          <div style='font-size:13px;'>ID: ${org.id || ''}</div>
          <div style='font-size:13px;'>Нэгж талбарын дугаар: ${org.parcel_id || '-'}</div>
          <div style='font-size:13px;'>Давхар: ${org.build_floor || '-'}</div>
          <div style='font-size:13px; text-center; color: #666;'><i>Мэдээлэл ачаалж байна...</i></div>
          <div style='margin-top:8px;'><a href='/entity?id=${org.id}' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a></div>
        </div>`;
        
        const leafletMarker = L.marker([lat, lng], { icon: redIcon });
        leafletMarker.bindPopup(initialPopupHtml);
        
        // Popup ээр дарах үед map data ачаалах
        leafletMarker.on('click', async function() {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/map-data?pay_center_id=${org.id}`);
            const result = await response.json();
            
            let mapData = {
              owner_count: 0,
              activity_operators: 0,
              area: 0,
              tenants: 0
            };
            
            if (result.success && result.data) {
              mapData = result.data;
            }
            
            // Updated popup контент
            const updatedPopupHtml = `<div style='width:240px'>
              <img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
              <div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${org.name || 'Байгууллага'}</div>
              <div style='font-size:13px;'>ID: ${org.id || ''}</div>
              <div style='font-size:13px;'>Нэгж талбарын дугаар: ${org.parcel_id || '-'}</div>
              <div style='font-size:13px;'>Давхар: ${org.build_floor || '-'}</div>
              <div style='font-size:13px;'>Түрээслэгч: ${mapData.tenants || 0} ш</div>
              <div style='font-size:13px;'>Эзэмшигч: ${mapData.owner_count || 0}</div>
              <div style='font-size:13px;'>Талбай: ${(mapData.area || 0).toLocaleString()} мкв</div>
              <div style='font-size:13px;'>Үйл ажиллагаа эрхлэгч: ${mapData.activity_operators || 0}</div>
              <div style='margin-top:8px;'><a href='/entity?id=${org.id}' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a></div>
            </div>`;
            
            // Popup контентийг шинэчлэх
            this.setPopupContent(updatedPopupHtml);
          } catch (error) {
            console.error('Error loading map data:', error);
            const errorPopupHtml = `<div style='width:240px'>
              <img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
              <div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${org.name || 'Байгууллага'}</div>
              <div style='font-size:13px;'>ID: ${org.id || ''}</div>
              <div style='font-size:13px;'>Нэгж талбарын дугаар: ${org.parcel_id || '-'}</div>
              <div style='font-size:13px;'>Давхар: ${org.build_floor || '-'}</div>
              <div style='font-size:13px; color: red;'>Мэдээлэл ачаалахад алдаа гарлаа</div>
              <div style='margin-top:8px;'><a href='/entity?id=${org.id}' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a></div>
            </div>`;
            this.setPopupContent(errorPopupHtml);
          }
        });
        
        markersLayer.value.addLayer(leafletMarker);
        markersCreated++;
      }
    }
    
    console.log(`Total markers created: ${markersCreated}`);
    
    // Add markers to map
    if (map.value && markersCreated > 0) {
      console.log('Adding markers layer to map...');
      map.value.addLayer(markersLayer.value);
      console.log('Markers layer added to map successfully');
      
      // Center on first valid organization
      const validOrg = props.organizations.find(org => {
        const lat = parseFloat(org.lat);
        const lng = parseFloat(org.lng);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      });
      
      if (validOrg) {
        const centerLat = parseFloat(validOrg.lat);
        const centerLng = parseFloat(validOrg.lng);
        console.log(`Setting map view to [${centerLat}, ${centerLng}]`);
        map.value.setView([centerLat, centerLng], 15);
      }
    }
    
    console.log('Organizations processing completed, returning...');
    return;
  }

  // 2. Газрын хайлт (searchLand)
  if (props.searchLand && Array.isArray(props.searchLand) && props.searchLand.length > 0) {
    if (markersLayer.value) {
      try { markersLayer.value.clearLayers(); } catch (e) {}
    }
    markersLayer.value = L.layerGroup(); // Use simple LayerGroup instead of markerClusterGroup
    // 1. Газрын pin-үүд
    for (const land of props.searchLand) {
      const lat = parseFloat(land.COORD_Y?.String || land.COORD_Y);
      const lng = parseFloat(land.COORD_X?.String || land.COORD_X);
      if (!isNaN(lat) && !isNaN(lng)) {
        const icon = greenIcon;
        const name = land.NAME?.String || land.NAME || 'Газрын нэр';
        let popupHtml = `<div style='width:240px'>
          <img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
          <div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${name}</div>
          <div style='font-size:13px;'>ID: ${land.ID || ''}</div>
          <div style='font-size:13px;'>Нэгж талбарын дугаар: ${land.PARCEL_ID || '-'}</div>
          <div style='font-size:13px;'>Эзэмшигч: 14</div>
          <div style='font-size:13px;'>Үйл ажиллагаа эрхлэгч: 137</div>
          <div style='font-size:13px;'>Талбай: 5,922.92 мкв</div>
          <div style='font-size:13px;'>Түрээслэгч: 95ш</div>
          <div style='margin-top:8px;'><a href='/entity?id=${land.ID}' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a></div>
        </div>`;
        const leafletMarker = L.marker([lat, lng], { icon });
        leafletMarker.bindPopup(popupHtml);
        leafletMarker.on('mouseover', function (e) { this.openPopup(); });
        leafletMarker.on('mouseout', function (e) { this.closePopup(); });
        markersLayer.value.addLayer(leafletMarker);
      }
    }
    // 2. Газрын хүрээ (pay_center_location-оос polygon/polyline)
    const regno = props.searchLand[0]?.PIN?.String || props.searchLand[0]?.PIN;
    if (regno) {
      const payLocs = await fetchPayCenterLocationsByRegno(regno);
      // Polygon зурна
      const polygonCoords = payLocs
        .map(loc => {
          const lat = parseFloat(loc.LAT?.Float64 || loc.LAT);
          const lng = parseFloat(loc.LNG?.Float64 || loc.LNG);
          if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
          return null;
        })
        .filter(Boolean);
      if (polygonCoords.length > 2 && map.value) {
        const polygon = L.polygon(polygonCoords, { color: 'blue', fillOpacity: 0.2 });
        polygon.addTo(map.value);
        polygon.bindPopup('Газрын хил (pay_center_location)');
      }
    }
    if (map.value && props.searchLand[0]) {
      const lat = parseFloat(props.searchLand[0].COORD_Y?.String || props.searchLand[0].COORD_Y);
      const lng = parseFloat(props.searchLand[0].COORD_X?.String || props.searchLand[0].COORD_X);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.value.setView([lat, lng], 15);
      }
      map.value.addLayer(markersLayer.value);
    }
    return;
  }

  // API query string үүсгэх
  const params = new URLSearchParams();
  if (props.district) params.append("district", props.district);
  if (props.khoroo) params.append("khoroo", props.khoroo);
  const url =
    "http://localhost:8080/api/v1/centers" +
    (params.toString() ? `?${params.toString()}` : "");

  let markersData: LandData[] = [];
  try {
    console.log('Fetching centers from URL:', url);
    const res = await fetch(url);
    const data = await res.json();
    console.log('Centers API response:', data);
    if (Array.isArray(data.data)) {
      markersData = data.data as LandData[];
    }
    console.log('markersData length:', markersData.length);
  } catch (e) {
    console.error('Error fetching centers:', e);
    markersData = [];
  }

  // Маркеруудыг шинэчлэх
  if (markersLayer.value) {
    try {
      markersLayer.value.clearLayers();
    } catch (e) {}
  }
  markersLayer.value = L.layerGroup(); // Use simple LayerGroup instead of markerClusterGroup
  markersData.forEach((marker: LandData) => {
    const lat = parseFloat(marker.COORD_Y?.String || marker.COORD_Y);
    const lng = parseFloat(marker.COORD_X?.String || marker.COORD_X);
    if (!isNaN(lat) && !isNaN(lng)) {
      // all_barimt_ok утгаар өнгө сонгоно
      let icon = greenIcon;
      const leafletMarker = L.marker([lat, lng], { icon });
      const popupHtml = `
        <div style='width:240px'>
          <img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
          <div style='text-align:center;'>
            <div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${
              marker.NAME?.String || marker.NAME || 'Газрын нэр'
            }</div>
          </div>
          <div style='font-size:13px;'>ID: ${marker.ID || ''}</div>
          <div style='font-size:13px;'>Нэгж талбарын дугаар: ${marker.PARCEL_ID || '-'}</div>
          <div style='font-size:13px;margin-bottom:8px;'>${
            marker.COORD_Y?.String || marker.COORD_Y || ""
          }</div>
          <div style='display:flex;align-items:center;gap:6px;'>
            <a href='/entity?id=${
              marker.ID
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

// Global cache for organization and map data (survives page navigation)
const globalOrgCache = new Map<string, { data: any; timestamp: number }>();
const globalMapDataCache = new Map<string, { data: any; timestamp: number }>();
const GLOBAL_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for global cache

// Function to check if cached data is still valid
function isGlobalCacheValid(cacheKey: string, cacheMap: Map<string, { data: any; timestamp: number }>) {
  if (cacheMap.has(cacheKey)) {
    const cached = cacheMap.get(cacheKey)!;
    return Date.now() - cached.timestamp < GLOBAL_CACHE_DURATION;
  }
  return false;
}

// Function to get cached data
function getGlobalCachedData(cacheKey: string, cacheMap: Map<string, { data: any; timestamp: number }>) {
  if (isGlobalCacheValid(cacheKey, cacheMap)) {
    return cacheMap.get(cacheKey)!.data;
  }
  return null;
}

// Function to set cache data
function setGlobalCacheData(cacheKey: string, data: any, cacheMap: Map<string, { data: any; timestamp: number }>) {
  cacheMap.set(cacheKey, {
    data: data,
    timestamp: Date.now()
  });
}

onMounted(async () => {
  console.log('=== MapView onMounted START ===');
  if (typeof window === "undefined") {
    console.log('Window is undefined, skipping map initialization');
    return;
  }
  
  console.log('Importing Leaflet...');
  const leaflet = await import("leaflet");
  L = leaflet.default;
  console.log('Leaflet imported successfully:', !!L);
  
  console.log('Importing markerClusterGroup...');
  await import("leaflet.markercluster");
  markerClusterGroup = () => L.markerClusterGroup();
  console.log('markerClusterGroup initialized');

  console.log('Creating custom icons...');
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
  blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  console.log('Icons created successfully');

  // map дахин үүсгэгдэхэд хуучин map-ийг устгана
  if (map.value && map.value._leaflet_id) {
    console.log('Removing existing map');
    map.value.remove();
  }

  console.log('Creating new map...');
  map.value = L.map("map").setView([47.9188691, 106.9175785], 12);
  console.log('Map created successfully');
  
  console.log('Adding tile layer...');
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map.value);
  console.log('Tile layer added');
  
  markersLayer.value = L.layerGroup(); // Use simple LayerGroup instead of markerClusterGroup
  map.value.addLayer(markersLayer.value);
  console.log('Markers layer added to map');
  
  console.log('Calling fetchAndRenderMarkers...');
  await fetchAndRenderMarkers();
  console.log('fetchAndRenderMarkers completed');

  // KML layer loading using dynamic import
  try {
    console.log('Loading KML layer...');
    const omnivoreImport = await import("@mapbox/leaflet-omnivore");
    const omnivore = omnivoreImport.default || omnivoreImport;
    const kmlLayer = omnivore
      //.kml("/duureg.kml")
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
    console.log('KML layer loaded successfully');
  } catch (e) {
    console.error("KML layer load error", e);
  }
  
  console.log('=== MapView onMounted END ===');
});

watch(
  () => [props.district, props.khoroo, props.category, props.searchLand, props.organizations],
  (newValues, oldValues) => {
    console.log('=== MapView watch triggered ===');
    console.log('New values:', newValues);
    console.log('Organizations changed:', newValues[4] !== oldValues?.[4]);
    console.log('Organizations length:', newValues[4]?.length);
    fetchAndRenderMarkers();
  }
);
</script>
