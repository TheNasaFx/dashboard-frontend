<template>
  <div id="map" style="height: 700px; width: 100%; border-radius: 10px"></div>
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
  district: string;
  khoroo: string;
  category: string;
  searchLand?: LandData[];
  organizations?: any[] | null;
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
  if (!L) return;

  console.log('organizations:', props.organizations);
  console.log('searchLand:', props.searchLand);

  // 1. Байгууллагаар хайсан бол organizations pin-үүдийг харуулна
  if (props.organizations && Array.isArray(props.organizations) && props.organizations.length > 0) {
    if (markersLayer.value) {
      try { markersLayer.value.clearLayers(); } catch (e) {}
    }
    markersLayer.value = markerClusterGroup();
    
    // Бүх байгууллагын ID-уудыг цуглуулаад batch API дуудах
    const orgIds = props.organizations.map(org => org.id).filter(id => id);
    let mapDataResults: any = {};
    
    if (orgIds.length > 0) {
      // Check global cache first
      const batchCacheKey = `batch_${orgIds.sort().join(',')}`;
      const cachedBatchData = getGlobalCachedData(batchCacheKey, globalMapDataCache);
      
      if (cachedBatchData) {
        mapDataResults = cachedBatchData;
      } else {
        try {
          const batchResponse = await fetch(`http://localhost:8080/api/v1/map-data-batch?pay_center_ids=${orgIds.join(',')}`);
          const batchData = await batchResponse.json();
          if (batchData.success && batchData.data) {
            mapDataResults = batchData.data;
            // Cache the batch result globally
            setGlobalCacheData(batchCacheKey, mapDataResults, globalMapDataCache);
          }
        } catch (error) {
          console.error('Error fetching batch map data:', error);
        }
      }
    }

    // Popup бүрт динамик мэдээлэл ашиглах
    for (const org of props.organizations) {
      const lat = parseFloat(org.lat);
      const lng = parseFloat(org.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        let ownerCount = 0;
        let activityOperators = 0;
        let area = 0;
        let tenants = 0;

        // Batch result-аас мэдээлэл авах
        const orgMapData = mapDataResults[org.id?.toString()];
        if (orgMapData && orgMapData.success && orgMapData.data) {
          ownerCount = orgMapData.data.owner_count || 0;
          activityOperators = orgMapData.data.activity_operators || 0;
          area = orgMapData.data.area || 0;
          tenants = orgMapData.data.tenants || 0;
        }

        // Popup-д харуулах
        let popupHtml = `<div style='width:240px'>
          <img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
          <div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${org.name || org.stor_name || 'Байгууллага'}</div>
          <div style='font-size:13px;'>ID: ${org.id || ''}</div>
          <div style='font-size:13px;'>Эзэмшигч: ${ownerCount}</div>
          <div style='font-size:13px;'>Үйл ажиллагаа эрхлэгч: ${activityOperators}</div>
          <div style='font-size:13px;'>Талбай: ${area.toLocaleString()} мкв</div>
          <div style='font-size:13px;'>Түрээслэгч: ${tenants}ш</div>
          <div style='margin-top:8px;'><a href='/entity?id=${org.id}' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a></div>
        </div>`;
        const leafletMarker = L.marker([lat, lng], { icon: redIcon });
        leafletMarker.bindPopup(popupHtml);
        markersLayer.value.addLayer(leafletMarker);
      }
    }
    if (map.value && props.organizations[0]) {
      const lat = parseFloat(props.organizations[0].lat);
      const lng = parseFloat(props.organizations[0].lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.value.setView([lat, lng], 15);
      }
      map.value.addLayer(markersLayer.value);
    }
    return;
  }

  // 2. Газрын хайлт (searchLand)
  if (props.searchLand && Array.isArray(props.searchLand) && props.searchLand.length > 0) {
    if (markersLayer.value) {
      try { markersLayer.value.clearLayers(); } catch (e) {}
    }
    markersLayer.value = markerClusterGroup();
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
  markersLayer.value = markerClusterGroup();
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
  } catch (e) {
    console.error("KML layer load error", e);
  }
});

watch(
  () => [props.district, props.khoroo, props.category, props.searchLand, props.organizations],
  () => {
    fetchAndRenderMarkers();
  }
);
</script>
