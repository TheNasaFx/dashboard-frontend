<template>
  <div id="map" style="height: 700px; width: 100%; border-radius: 10px; position: relative; z-index: 1;"></div>
</template>

<style>
/* Marker Cluster сайжруулсан тохиргоо - давхар дугуй устгах */
.marker-cluster-small {
  background-color: rgba(110, 204, 57, 0.9);
  border: none !important;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.marker-cluster-small div {
  background-color: rgba(110, 204, 57, 0.9) !important;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 36px;
  width: 36px;
  height: 36px;
  border: none !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.marker-cluster-medium {
  background-color: rgba(240, 194, 12, 0.9);
  border: none !important;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.marker-cluster-medium div {
  background-color: rgba(240, 194, 12, 0.9) !important;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 36px;
  width: 36px;
  height: 36px;
  border: none !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.marker-cluster-large {
  background-color: rgba(241, 128, 23, 0.9);
  border: none !important;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.marker-cluster-large div {
  background-color: rgba(241, 128, 23, 0.9) !important;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 36px;
  width: 36px;
  height: 36px;
  border: none !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

/* Standard cluster marker styles */
.standard-cluster-marker {
  transition: all 0.3s ease;
}

.standard-cluster-marker:hover {
  transform: scale(1.1);
}

/* District cluster marker styles */
.district-cluster-marker {
  transition: all 0.3s ease;
}

.district-cluster-marker:hover {
  transform: scale(1.15);
}

/* Давхар дугуй устгах */
.marker-cluster {
  background-clip: padding-box !important;
  border-radius: 20px !important;
  border: none !important;
  background-color: transparent !important;
  cursor: pointer !important;
}

.marker-cluster:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.marker-cluster div {
  position: relative;
  top: 0px !important;
  left: 0px !important;
  margin: 0 !important;
  padding: 0 !important;
}

.marker-cluster span {
  line-height: 36px !important;
  display: block;
  font-size: 12px;
}

/* Spiderfy animation сайжруулах */
.marker-cluster-spiderfy {
  z-index: 1000 !important;
}

.leaflet-marker-icon.marker-cluster-spiderfy {
  margin-left: -12px !important;
  margin-top: -12px !important;
}

/* Cluster click animation */
.marker-cluster-clicked {
  animation: clusterPulse 0.3s ease-out;
}

@keyframes clusterPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>

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
  payCenter?: any;
  mapType?: string;
  selectedAddress?: string;
  selectedDistrictName?: string;
}>();

const map = ref<any>(null);
const markersLayer = ref<any>(null);
const polygonLayer = ref<any>(null); // Polygon-уудад зориулсан тусдаа layer
const kmlLayer = ref<any>(null);
let L: any = null;
let markerClusterGroup: any = null;
let redIcon: any = null;
let greenIcon: any = null;
let blueIcon: any = null;
let yellowIcon: any = null;

// Debounce timer for zoom events
let zoomDebounceTimer: NodeJS.Timeout | null = null;

// District boundaries loaded from KML for custom clustering
let districtPolygons: { [key: string]: any } = {};
let isDistrictDataLoaded = false;

// District names mapping (matching KML data exactly)
const DISTRICTS = {
  'Багануур': { lat: 47.8583, lng: 108.2333 },
  'Багахангай': { lat: 47.3667, lng: 106.6833 },
  'Баянгол': { lat: 47.9000, lng: 106.9000 },
  'Баянзүрх': { lat: 47.9167, lng: 106.9833 },
  'Налайх': { lat: 47.6833, lng: 107.4000 },
  'Сонгинохайрхан': { lat: 47.8667, lng: 106.7167 },
  'Сүхбаатар': { lat: 47.9167, lng: 106.9167 },
  'Хан Уул': { lat: 47.8000, lng: 106.9667 }, // Note: space in name
  'Чингэлтэй': { lat: 47.9500, lng: 106.9333 }
};

// Function to load district boundaries from KML
async function loadDistrictBoundaries() {
  if (isDistrictDataLoaded) return;
  
  try {
    const response = await fetch('/duureg.kml');
    const kmlText = await response.text();
    
    // Parse KML and extract district polygons
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
    const placemarks = kmlDoc.querySelectorAll('Placemark');
    
    placemarks.forEach(placemark => {
      const nameElement = placemark.querySelector('name');
      const coordinatesElement = placemark.querySelector('coordinates');
      
      if (nameElement && coordinatesElement) {
        const districtName = nameElement.textContent?.trim();
        const coordinates = coordinatesElement.textContent?.trim();
        
        if (districtName && coordinates) {
          // Parse coordinates and create polygon bounds
          const coordLines = coordinates.split('\n').filter(line => line.trim());
          const polygonCoords: [number, number][] = [];
          
          for (const line of coordLines) {
            const coords = line.trim().split(',');
            if (coords.length >= 2) {
              const lng = parseFloat(coords[0]);
              const lat = parseFloat(coords[1]);
              if (!isNaN(lat) && !isNaN(lng)) {
                polygonCoords.push([lat, lng]);
              }
            }
          }
          
          if (polygonCoords.length > 2) {
            // Create Leaflet polygon for point-in-polygon checking
            const polygon = L.polygon(polygonCoords);
            districtPolygons[districtName] = {
              polygon: polygon,
              bounds: polygon.getBounds(),
              center: polygon.getBounds().getCenter(),
              coords: polygonCoords
            };
          }
        }
      }
    });
    
    isDistrictDataLoaded = true;
    console.log('District boundaries loaded:', Object.keys(districtPolygons));
  } catch (error) {
    console.error('Error loading district boundaries:', error);
  }
}

// Function to determine which district a point belongs to
function getDistrictForPoint(lat: number, lng: number): string | null {
  for (const [districtName, data] of Object.entries(districtPolygons)) {
    if (isPointInPolygon(lat, lng, data.coords)) {
      return districtName;
    }
  }
  return null;
}

// Ray casting algorithm for point-in-polygon detection
function isPointInPolygon(lat: number, lng: number, polygon: [number, number][]): boolean {
  let inside = false;
  let j = polygon.length - 1;

  for (let i = 0; i < polygon.length; i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];

    if (((lngI > lng) !== (lngJ > lng)) && 
        (lat < (latJ - latI) * (lng - lngI) / (lngJ - lngI) + latI)) {
      inside = !inside;
    }
    j = i;
  }

  return inside;
}

// Function to create district-based clusters
function createDistrictClusters(markers: any[]): any[] {
  if (!isDistrictDataLoaded || Object.keys(districtPolygons).length === 0) {
    console.log('District data not loaded, using default clustering');
    return markers;
  }

  // Check current zoom level to decide clustering behavior
  const currentZoom = map.value ? map.value.getZoom() : 8;
  const ZOOM_THRESHOLD = 12; // Higher threshold - only show individual markers at very high zoom
  
  if (currentZoom >= ZOOM_THRESHOLD) {
    console.log(`Zoom level ${currentZoom} >= ${ZOOM_THRESHOLD}, showing individual markers with standard clustering`);
    
    // At high zoom, use standard MarkerClusterGroup for nearby markers
    const standardClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40, // Smaller radius for high zoom
      disableClusteringAtZoom: 19, // Disable clustering at max zoom
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      spiderfyDistanceMultiplier: 1.5,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="background-color: rgba(34, 197, 94, 0.9); border-radius: 20px; color: white; font-weight: bold; text-align: center; line-height: 30px; width: 30px; height: 30px; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><span>${count}</span></div>`,
          className: 'standard-cluster-marker',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });
      }
    });
    
    // Add all markers to standard cluster group
    markers.forEach(marker => {
      standardClusterGroup.addLayer(marker);
    });
    
    return [standardClusterGroup]; // Return as array containing the cluster group
  }

  console.log(`Zoom level ${currentZoom} < ${ZOOM_THRESHOLD}, applying district clustering`);

  // Group markers by district
  const districtGroups: { [key: string]: any[] } = {};
  const ungroupedMarkers: any[] = [];

  markers.forEach(marker => {
    const latLng = marker.getLatLng();
    const district = getDistrictForPoint(latLng.lat, latLng.lng);
    
    if (district) {
      if (!districtGroups[district]) {
        districtGroups[district] = [];
      }
      districtGroups[district].push(marker);
    } else {
      ungroupedMarkers.push(marker);
    }
  });

  // Create cluster markers for each district
  const clusterMarkers: any[] = [];

  Object.entries(districtGroups).forEach(([districtName, districtMarkers]) => {
    if (districtMarkers.length > 1) {
      // Create a cluster marker for this district
      const districtData = districtPolygons[districtName];
      const clusterCenter = districtData.center;
      
      const clusterIcon = L.divIcon({
        html: `<div style="background-color: rgba(34, 197, 94, 0.9); border-radius: 20px; color: white; font-weight: bold; text-align: center; line-height: 36px; width: 36px; height: 36px; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: all 0.3s ease; cursor: pointer;"><span>${districtMarkers.length}</span></div>`,
        className: 'district-cluster-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const clusterMarker = L.marker([clusterCenter.lat, clusterCenter.lng], { 
        icon: clusterIcon 
      });

      // Create popup content for district cluster
      const popupContent = `
        <div style="width: 240px; font-family: 'Segoe UI', sans-serif;">
          <div style="font-weight: bold; font-size: 18px; margin: 8px 0 4px 0; color: #22c55e;">
            ${districtName} дүүрэг
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            Нийт газар: ${districtMarkers.length} ширхэг
          </div>
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
            Дэлгэрэнгүй харахын тулд дарна уу
          </div>
        </div>
      `;

      clusterMarker.bindPopup(popupContent);

      // When cluster is clicked, zoom to district with smooth transition
      clusterMarker.on('click', function() {
        if (map.value && districtData.bounds) {
          // Smooth zoom to the district center with appropriate zoom level
          const targetZoom = Math.min(17, Math.max(14, map.value.getZoom() + 3));
          map.value.flyTo(districtData.center, targetZoom, {
            duration: 1.0, // 1 second smooth animation
            easeLinearity: 0.25
          });
          
          console.log(`Flying to district ${districtName} at zoom level ${targetZoom}`);
        }
      });

      clusterMarkers.push(clusterMarker);
    } else if (districtMarkers.length === 1) {
      // Single marker, add as-is
      clusterMarkers.push(districtMarkers[0]);
    }
  });

  // Add ungrouped markers
  clusterMarkers.push(...ungroupedMarkers);

  console.log(`Created ${Object.keys(districtGroups).length} district clusters`);
  
  // Update KML layer popup counts
  updateDistrictCounts(districtGroups);
  
  return clusterMarkers;
}

// Function to update district counts in KML layer popups
function updateDistrictCounts(districtGroups: { [key: string]: any[] }) {
  if (kmlLayer.value) {
    kmlLayer.value.eachLayer(function(layer: any) {
      if (layer.feature && layer.feature.properties) {
        let districtName = layer.feature.properties.name || 
                          layer.feature.properties.n || 
                          layer.feature.properties.soum_name;
        
        if (districtName && districtGroups[districtName]) {
          const count = districtGroups[districtName].length;
          const countElement = document.querySelector(`.district-count-${districtName}`);
          if (countElement) {
            countElement.textContent = `Газар: ${count} ширхэг`;
          }
        }
      }
    });
  }
}

// Function to apply district filter to KML layer
async function applyDistrictFilter() {
  if (!map.value) return;
  
  console.log('Applying district filter...', 'district:', props.district);
  
  // Remove existing KML layer if it exists
  if (kmlLayer.value) {
    map.value.removeLayer(kmlLayer.value);
    kmlLayer.value = null;
  }
  
  try {
    // Import omnivore dynamically
    const omnivoreImport = await import("@mapbox/leaflet-omnivore");
    const omnivore = omnivoreImport.default || omnivoreImport;
    
    // Load KML file
    const response = await fetch('/duureg.kml');
    const kmlText = await response.text();
    
    // Parse KML manually
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
    
    // Create a new KML string with only selected district or all districts
    let filteredKML = '';
    
    if (!props.selectedDistrictName || props.selectedDistrictName === '' || props.selectedDistrictName === 'Дүүрэг' || props.selectedDistrictName === 'Бүгд') {
      // Show all districts - use original KML
      filteredKML = kmlText;
    } else {
      // Filter for specific district
      const placemarks = kmlDoc.querySelectorAll('Placemark');
      const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
  <Document id="soumbnd">
    <name>sum_hil2.kml</name>
    <Snippet maxLines="2">
    </Snippet>
    <Style id="PolyStyle00">
      <LineStyle>
        <color>ff000000</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>00f0f0f0</color>
        <outline>1</outline>
      </PolyStyle>
      <LabelStyle>
        <color>00000000</color>
        <scale>0</scale>
      </LabelStyle>
    </Style>
    <Folder id="FeatureLayer0">
      <name>soumbnd</name>
      <Snippet maxLines="2">
      </Snippet>`;
      
      const kmlFooter = `
    </Folder>
  </Document>
</kml>`;

      let selectedPlacemarks = '';
      
      placemarks.forEach(placemark => {
        const nameElement = placemark.querySelector('name');
        if (nameElement) {
          const districtName = nameElement.textContent?.trim();
          console.log('Found district in KML:', districtName, 'Looking for:', props.selectedDistrictName);
          
          // Match district names exactly
          if (districtName === props.selectedDistrictName) {
            selectedPlacemarks += new XMLSerializer().serializeToString(placemark);
            console.log('Match found! Adding district to filtered KML:', districtName);
          }
        }
      });
      
      if (selectedPlacemarks) {
        filteredKML = kmlHeader + selectedPlacemarks + kmlFooter;
      } else {
        console.log('No matching district found, showing all districts');
        filteredKML = kmlText; // Fallback to show all if no match
      }
    }
    
    // Create a blob from the filtered KML and load it
    const blob = new Blob([filteredKML], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    
    // District colors mapping for visual distinction
    const districtColors = {
      'Багануур': { color: '#FF6B6B', fillColor: '#FF6B6B' },      // Red
      'Багахангай': { color: '#4ECDC4', fillColor: '#4ECDC4' },     // Teal
      'Баянгол': { color: '#45B7D1', fillColor: '#45B7D1' },       // Blue
      'Баянзүрх': { color: '#96CEB4', fillColor: '#96CEB4' },      // Light Green
      'Налайх': { color: '#FECA57', fillColor: '#FECA57' },        // Yellow
      'Сонгинохайрхан': { color: '#FF9FF3', fillColor: '#FF9FF3' }, // Pink
      'Сүхбаатар': { color: '#54A0FF', fillColor: '#54A0FF' },     // Light Blue
      'Хан-Уул': { color: '#5F27CD', fillColor: '#5F27CD' },       // Purple
      'Чингэлтэй': { color: '#00D2D3', fillColor: '#00D2D3' }      // Cyan
    };

    // Use omnivore to parse the filtered KML
    kmlLayer.value = omnivore.kml(url)
      .on('ready', function() {
        console.log('Filtered KML layer loaded successfully');
        
        // Style each district with different colors
        this.eachLayer(function(layer: any) {
          if (layer.setStyle && layer.feature && layer.feature.properties && layer.feature.properties.name) {
            const districtName = layer.feature.properties.name.trim();
            console.log('Styling district:', districtName);
            
            // Get color for this district, fallback to default orange
            const districtColor = districtColors[districtName] || { color: '#ff7800', fillColor: '#ff7800' };
            
            layer.setStyle({
              color: districtColor.color,
              weight: 2,
              opacity: 0.8,
              fillColor: districtColor.fillColor,
              fillOpacity: 0.3
            });
            
            // Add hover effect
            layer.on('mouseover', function(e: any) {
              e.target.setStyle({
                weight: 3,
                opacity: 1,
                fillOpacity: 0.5
              });
            });
            
            layer.on('mouseout', function(e: any) {
              e.target.setStyle({
                color: districtColor.color,
                weight: 2,
                opacity: 0.8,
                fillColor: districtColor.fillColor,
                fillOpacity: 0.3
              });
            });
          } else {
            // Fallback for layers without proper feature properties
            layer.setStyle({
              color: '#ff7800',
              weight: 2,
              opacity: 0.8,
              fillColor: '#ff7800',
              fillOpacity: 0.3
            });
          }
        });
        
        // Fit bounds to the filtered content
        if (map.value && this.getBounds().isValid()) {
          map.value.fitBounds(this.getBounds(), { padding: [20, 20] });
        }
        
        // Clean up the blob URL
        URL.revokeObjectURL(url);
      })
      .on('error', function(e: any) {
        console.error('Error loading filtered KML:', e);
        URL.revokeObjectURL(url);
      })
      .addTo(map.value);
      
  } catch (error) {
    console.error('Error applying district filter:', error);
  }
}

// Function to re-render markers based on zoom level
function reRenderMarkersOnZoom() {
  if (!map.value || !markersLayer.value) return;
  
  const currentZoom = map.value.getZoom();
  const ZOOM_THRESHOLD = 16; // Match the threshold in createDistrictClusters
  
  // Get stored individual markers
  const storedMarkers = map.value._individualMarkers || [];
  if (storedMarkers.length === 0) return;
  
  console.log(`Re-rendering ${storedMarkers.length} markers based on zoom level ${currentZoom}`);
  
  // KML layer should always be visible unless in land mode
  if (kmlLayer.value && props.mapType !== 'land') {
    if (!map.value.hasLayer(kmlLayer.value)) {
      console.log('Adding KML layer back to map');
      map.value.addLayer(kmlLayer.value);
    }
  }
  
  // Clear current markers with fade effect
  markersLayer.value.clearLayers();
  
  // Apply clustering based on current zoom
  const clusteredMarkers = createDistrictClusters(storedMarkers);
  
  // Add clustered markers to the map with smooth transition
  setTimeout(() => {
    clusteredMarkers.forEach(marker => {
      markersLayer.value.addLayer(marker);
    });
  }, 50); // Small delay for smooth transition
  
  // Update district counts only when clustered
  if (currentZoom < ZOOM_THRESHOLD) {
    const districtGroups: { [key: string]: any[] } = {};
    storedMarkers.forEach(marker => {
      const latLng = marker.getLatLng();
      const district = getDistrictForPoint(latLng.lat, latLng.lng);
      if (district) {
        if (!districtGroups[district]) {
          districtGroups[district] = [];
        }
        districtGroups[district].push(marker);
      }
    });
    
    updateDistrictCounts(districtGroups);
  }
}

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

  // Load district boundaries for custom clustering
  await loadDistrictBoundaries();

  console.log('=== MAP DEBUG START ===');
  console.log('organizations:', props.organizations);
  console.log('organizations length:', props.organizations?.length);
  console.log('searchLand:', props.searchLand);
  console.log('mapType:', props.mapType);
  
  // Sample first organization
  if (props.organizations && props.organizations.length > 0) {
    console.log('First organization sample:', props.organizations[0]);
    console.log('First org lat:', props.organizations[0].lat);
    console.log('First org lng:', props.organizations[0].lng);
  }
  console.log('=== MAP DEBUG END ===');

  // Clear existing markers and polygons before adding new ones
  if (markersLayer.value) {
    console.log('Clearing existing markers...');
    try { markersLayer.value.clearLayers(); } catch (e) {
      console.error('Error clearing markers:', e);
    }
  }
  
  if (polygonLayer.value) {
    console.log('Clearing existing polygons...');
    try { polygonLayer.value.clearLayers(); } catch (e) {
      console.error('Error clearing polygons:', e);
    }
  }
  
  // Create polygon layer for land mode
  if (!polygonLayer.value) {
    polygonLayer.value = L.layerGroup();
    console.log('Created polygon layer');
  }
  
  // Use simple layer group for custom district-based clustering
  // Бид дүүрэг тус бүрээр кластер хийх тул energy layerGroup ашиглана
  markersLayer.value = L.layerGroup();
  
  console.log('Created simple layerGroup for district clustering');
  
  // Store individual markers for clustering later
  const individualMarkers: any[] = [];  if (props.mapType === 'land') {
    console.log('Created markerClusterGroup for land mode with clustering');
  } else {
    console.log('Created markerClusterGroup for other modes with clustering');
  }
  
     // 1. Байгууллагаар хайсан бол organizations pin-үүдийг харуулна (filter by selectedAddress if provided)
   // Зөвхөн е-баримт mode биш үед organization marker-уудыг харуулна (ГАЗАР mode-д ч харуулна)
   if (props.mapType !== 'ebarimt' && props.organizations && Array.isArray(props.organizations) && props.organizations.length > 0) {
    console.log('Processing organizations section...');
    console.log('Current mapType:', props.mapType);
    console.log('Organizations count:', props.organizations.length);
    console.log('Selected address filter:', props.selectedAddress);
    
    // Special debug for land mode
    if (props.mapType === 'land') {
      console.log('🟦 ГАЗАР MODE - Organization маркеруудыг цэнхэр өнгөөр харуулна');
    } else {
      console.log('🔴 ҮНДСЭН MODE - Organization маркеруудыг улаан өнгөөр харуулна');
    }
    
    // Filter organizations by selectedAddress if provided
    let filteredOrganizations = props.organizations;
    if (props.selectedAddress && props.selectedAddress !== '') {
      filteredOrganizations = props.organizations.filter(org => {
        if (!org.address) return false;
        return org.address === props.selectedAddress;
      });
      console.log(`Filtered organizations count: ${filteredOrganizations.length} (matching address: ${props.selectedAddress})`);
    }
    
    console.log('Starting organization marker creation loop...');
    
    // Create all markers simultaneously without individual API calls
    for (const org of filteredOrganizations) {
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
        
        // Choose icon based on map type
        let markerIcon = redIcon; // Default red for normal mode
        if (props.mapType === 'land') {
          markerIcon = redIcon; // default for land mode to differentiate
        }
        
        const leafletMarker = L.marker([lat, lng], { icon: markerIcon });
        leafletMarker.bindPopup(initialPopupHtml);
        
        // Store marker data for district clustering
        leafletMarker.markerData = {
          orgId: org.id,
          orgName: org.name,
          lat: lat,
          lng: lng
        };
        
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
        
        // Add to individual markers array for district clustering
        individualMarkers.push(leafletMarker);
        console.log(`✅ Marker нэмэгдлээ: ${org.name} [${lat}, ${lng}] - ${props.mapType === 'land' ? 'ЦЭНХЭР' : 'УЛААН'}`);
      }
    }
    
    // Apply district-based clustering to organization markers
    if (isDistrictDataLoaded && Object.keys(districtPolygons).length > 0 && individualMarkers.length > 0) {
      console.log('Applying district-based clustering...');
      console.log(`Total markers to cluster: ${individualMarkers.length}`);
      
      // Store individual markers on map object for zoom-based re-rendering
      if (map.value) {
        map.value._individualMarkers = individualMarkers;
      }
      
      // Create district clusters
      const clusteredMarkers = createDistrictClusters(individualMarkers);
      console.log(`Clustered into: ${clusteredMarkers.length} markers/clusters`);
      
      // Add clustered markers to the map
      clusteredMarkers.forEach(marker => {
        markersLayer.value.addLayer(marker);
      });
      
      console.log('✅ District-based clustering applied');
    } else {
      // If district data not loaded, add individual markers normally
      console.log('District data not loaded, adding individual markers...');
      
      // Store individual markers on map object even when not clustering
      if (map.value) {
        map.value._individualMarkers = individualMarkers;
      }
      
      individualMarkers.forEach(marker => {
        markersLayer.value.addLayer(marker);
      });
    }
    
    const markersCount = markersLayer.value.getLayers ? markersLayer.value.getLayers().length : 0;
    console.log(`✅ Organization markers created: ${markersCount} ширхэг (mapType: ${props.mapType}) - District clustering: ${isDistrictDataLoaded ? 'ON' : 'OFF'}`);
  }
  
  // 2. Е-баримт button дээр дарахад е-баримтын өнгөтэй marker-ууд харуулах
  if (props.mapType === 'ebarimt') {
    console.log('Processing ebarimt mode...');
    await fetchEbarimtColorData();
    return; // Е-баримт mode-д organization marker-уудыг харуулахгүй
  }
  
         // 3. Газар button дээр дарахад pay center location-оос polygon-ууд харуулах
   if (props.mapType === 'land' && props.payCenter && typeof props.payCenter === 'object' && props.payCenter !== null && Object.keys(props.payCenter).length > 0) {
    console.log('=== LAND MODE PROCESSING START ===');
    console.log('Processing land mode - pay center locations...');
    console.log('Pay center groups:', Object.keys(props.payCenter));
    console.log('Pay center data structure:', props.payCenter);
    
    // Generate different colors for different PAY_CENTER_IDs
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    
    // Process each PAY_CENTER_ID group separately
    Object.entries(props.payCenter).forEach(([payCenterID, locations], groupIndex) => {
      if (!Array.isArray(locations) || locations.length === 0) return;
      
      console.log(`Processing PAY_CENTER_ID ${payCenterID} with ${locations.length} locations`);
      
      // Extract valid coordinates for this group
      const validCoordinates: [number, number][] = [];
      
      for (const payLoc of locations) {
        // LNG, LAT coordinates parsing
        let lat, lng;
        
        // Handle different formats from the database
        if (payLoc.LAT && payLoc.LAT.Float64 !== undefined) {
          lat = payLoc.LAT.Float64;
        } else if (typeof payLoc.LAT === 'number') {
          lat = payLoc.LAT;
        } else if (typeof payLoc.LAT === 'string') {
          lat = parseFloat(payLoc.LAT);
        }
        
        if (payLoc.LNG && payLoc.LNG.Float64 !== undefined) {
          lng = payLoc.LNG.Float64;
        } else if (typeof payLoc.LNG === 'number') {
          lng = payLoc.LNG;
        } else if (typeof payLoc.LNG === 'string') {
          lng = parseFloat(payLoc.LNG);
        }
        
        // Only use coordinates if valid
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          validCoordinates.push([lat, lng]);
        }
      }
      
      if (validCoordinates.length === 0) {
        console.log(`No valid coordinates for PAY_CENTER_ID ${payCenterID}`);
        return;
      }
      
      // Choose color for this group
      const groupColor = colors[groupIndex % colors.length];
      
      // Create polygon if we have at least 3 points
      if (validCoordinates.length >= 3) {
        console.log(`Creating polygon for PAY_CENTER_ID ${payCenterID} with ${validCoordinates.length} points`);
        
        // Sort coordinates to create a proper polygon shape
        // Calculate centroid and sort by angle from centroid for better polygon shape
        const centroidLat = validCoordinates.reduce((sum, coord) => sum + coord[0], 0) / validCoordinates.length;
        const centroidLng = validCoordinates.reduce((sum, coord) => sum + coord[1], 0) / validCoordinates.length;
        
        validCoordinates.sort((a, b) => {
          const angleA = Math.atan2(a[0] - centroidLat, a[1] - centroidLng);
          const angleB = Math.atan2(b[0] - centroidLat, b[1] - centroidLng);
          return angleA - angleB;
        });
        
        const polygon = L.polygon(validCoordinates, {
          color: groupColor,
          fillColor: groupColor,
          fillOpacity: 0.3,
          weight: 2
        }).bindPopup(`
          <div style="width:240px; font-family: 'Segoe UI', sans-serif;">
            <div style="font-weight:bold; font-size:18px; margin:8px 0 4px 0; color:${groupColor};">Газрын талбай ${payCenterID}</div>
            <div style="font-size:13px; margin-bottom:4px;">PAY_CENTER_ID: ${payCenterID}</div>
          </div>
        `);
        
        polygonLayer.value.addLayer(polygon);
        
      } else if (validCoordinates.length > 0) {
        // If less than 3 points, show as individual markers
        console.log(`Not enough points for polygon for PAY_CENTER_ID ${payCenterID}, showing as markers...`);
        validCoordinates.forEach((coord, index) => {
          const marker = L.circleMarker(coord, {
            radius: 6,
            fillColor: groupColor,
            color: groupColor,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).bindPopup(`
            <div style="width:240px; font-family: 'Segoe UI', sans-serif;">
              <div style="font-weight:bold; font-size:18px; margin:8px 0 4px 0; color:${groupColor};">Газрын цэг ${payCenterID}</div>
              <div style="font-size:13px;">PAY_CENTER_ID: ${payCenterID}</div>
              <div style="font-size:13px;">Координат: ${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}</div>
              <div style="font-size:13px; color:#0066cc;">Polygon-д хүрэлцэхгүй цэг</div>
            </div>
          `);
          
          polygonLayer.value.addLayer(marker);
        });
      }
    });
    
    console.log(`Pay center polygons/markers created for land mode`);
    console.log('=== LAND MODE PROCESSING END ===');
  }
  
     // 4. Газар mode-д organization marker-уудыг харуулахгүй - зөвхөн polygon-уудыг харуулна
   // Анхны pin point-уудыг хэвээр үлдээх тул энэ хэсгийг устгасан
  
    // 5. Газрын хайлт (searchLand)
  if (props.searchLand && Array.isArray(props.searchLand) && props.searchLand.length > 0) {
    // Газрын хүрээ (pay_center_location-оос polygon/polyline)
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
        const polygon = L.polygon(polygonCoords, { color: 'green', fillOpacity: 0.2 });
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
   
     // 6. Fallback: if no organizations and not in ebarimt/land mode, show default centers
  if (props.mapType !== 'ebarimt' && props.mapType !== 'land' && (!props.organizations || props.organizations.length === 0)) {
    console.log('No organizations data, showing default centers...');
    
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

    // Маркеруудыг шинэчлэх - fallback markers ч clustering хийх
    if (markersLayer.value) {
      try {
        markersLayer.value.clearLayers();
      } catch (e) {}
    }
    // Fallback хэсэгт ч markerClusterGroup ашиглана
    markersLayer.value = L.markerClusterGroup({
      maxClusterRadius: 60,
      disableClusteringAtZoom: 18,
      spiderfyOnMaxZoom: true, // Spider эффект идэвхтэй
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true, // Click дээр zoom эсвэл spiderfy
      spiderfyDistanceMultiplier: 2, // Spider задралтын зай
      removeOutsideVisibleBounds: true,
      animate: true, // Animation идэвхтэй болгох
      animateAddingMarkers: false,
      chunkedLoading: true,
      chunkDelay: 50,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        let className = 'marker-cluster-small';
        
        if (count < 10) {
          className = 'marker-cluster-small';
        } else if (count < 100) {
          className = 'marker-cluster-medium';
        } else {
          className = 'marker-cluster-large';
        }
        
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: L.point(40, 40),
          iconAnchor: [20, 20]
        });
      }
    });
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
  }
  
  // Add markers and polygon layers to map
  if (map.value) {
    console.log('Adding markers layer to map...');
    console.log('Markers layer type:', markersLayer.value.constructor.name);
    console.log('Markers layer has layers:', markersLayer.value.getLayers ? markersLayer.value.getLayers().length : 'N/A');
    map.value.addLayer(markersLayer.value);
    console.log('Markers layer added to map successfully');
    
    // Add polygon layer for land mode
    if (props.mapType === 'land' && polygonLayer.value) {
      console.log('Adding polygon layer to map...');
      console.log('Polygon layer has layers:', polygonLayer.value.getLayers ? polygonLayer.value.getLayers().length : 'N/A');
      map.value.addLayer(polygonLayer.value);
      console.log('Polygon layer added to map successfully');
    }
    
    // Center on first valid organization or pay center
    if (props.mapType !== 'ebarimt') {
      const validOrg = props.organizations?.find(org => {
        const lat = parseFloat(org.lat);
        const lng = parseFloat(org.lng);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      });
      
      if (validOrg) {
        const centerLat = parseFloat(validOrg.lat);
        const centerLng = parseFloat(validOrg.lng);
        console.log(`🎯 Map центрийг organization руу [${centerLat}, ${centerLng}] зааж байна`);
        map.value.setView([centerLat, centerLng], 15);
      }
    }
    
    console.log('All markers processing completed');
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

// Function to fetch ebarimt color data for all pay centers
async function fetchEbarimtColorData() {
  try {
    console.log('Fetching ebarimt color data for map markers...');
    const response = await fetch('http://localhost:8080/api/v1/pay-center-locations?with_ebarimt_colors=true');
    const result = await response.json();
    
    if (result.success && result.data) {
      console.log('Ebarimt color data loaded:', Object.keys(result.data).length, 'locations');
      updateMarkersWithEbarimtColors(result.data);
    } else {
      console.error('Failed to fetch ebarimt color data:', result);
    }
  } catch (error) {
    console.error('Error fetching ebarimt color data:', error);
  }
}

onMounted(async () => {
  console.log('=== MapView onMounted START ===');
  if (typeof window === "undefined") {
    console.log('Window is undefined, skipping map initialization');
    return;
  }
  
  try {
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
    yellowIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
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
    polygonLayer.value = L.layerGroup(); // Initialize polygon layer
    map.value.addLayer(markersLayer.value);
    map.value.addLayer(polygonLayer.value);
    console.log('Markers and polygon layers added to map');
    
    // Add zoom event listener for dynamic clustering with debounce
    map.value.on('zoomend', function() {
      const currentZoom = map.value.getZoom();
      
      // Clear previous timer
      if (zoomDebounceTimer) {
        clearTimeout(zoomDebounceTimer);
      }
      
      // Set new timer with shorter debounce delay for smoother experience
      zoomDebounceTimer = setTimeout(() => {
        console.log(`Executing zoom-based re-render at zoom ${currentZoom}`);
        reRenderMarkersOnZoom();
        zoomDebounceTimer = null;
      }, 100); // Reduced to 100ms for smoother experience
    });
    console.log('Zoom event listener added with smooth debounce');
    
    // Wait for the next tick to ensure map is fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Calling fetchAndRenderMarkers...');
    await fetchAndRenderMarkers();
    console.log('fetchAndRenderMarkers completed');
    
         // Force a second render after a short delay to catch any late-loading data
     setTimeout(async () => {
       console.log('Secondary marker render check...');
       if ((props.organizations?.length ?? 0) > 0 || (props.searchLand?.length ?? 0) > 0) {
         console.log('Re-rendering markers for late-loaded data');
         await fetchAndRenderMarkers();
       }
     }, 500);
  } catch (error) {
    console.error('Error in map initialization:', error);
  }

  // KML layer loading using dynamic import
  try {
    console.log('Loading KML layer...');
    console.log('Checking KML file path: /duureg.kml');
    
    const omnivoreImport = await import("@mapbox/leaflet-omnivore");
    console.log('Omnivore import:', omnivoreImport);
    
    const omnivore = omnivoreImport.default || omnivoreImport;
    console.log('Omnivore object:', omnivore);
    
    if (!omnivore || !omnivore.kml) {
      throw new Error('Omnivore KML function not available');
    }
    
         // Define colors for each district
     const districtColors: { [key: string]: string } = {
       'Багануур': '#FF6B6B',      // Red
       'Багахангай': '#4ECDC4',    // Teal
       'Баянгол': '#45B7D1',       // Blue
       'Баянзүрх': '#ffa500',      // Green
       'Налайх': '#0000ff',        // Yellow
       'Сонгинохайрхан': '#00ff00', // Plum
       'Сүхбаатар': '#98D8C8',     // Mint
       'Хан Уул': '#ff0000',       // Light Yellow (note the space)
       'Чингэлтэй': '#BB8FCE'      // Light Purple
     };
    
         kmlLayer.value = omnivore
       .kml("/duureg.kml")
       .on("ready", function () {
         console.log('KML layer ready, bounds:', kmlLayer.value.getBounds());
         console.log('District polygons loaded for clustering:', Object.keys(districtPolygons));
         
                  // Style each district with different colors
          this.eachLayer(function(layer: any) {
            if (layer.feature && layer.feature.properties) {
              // Get district name from KML properties
              let districtName = null;
              
              // Try different property names that might contain the district name
              if (layer.feature.properties.name) {
                districtName = layer.feature.properties.name;
              } else if (layer.feature.properties.n) {
                districtName = layer.feature.properties.n;
              } else if (layer.feature.properties.soum_name) {
                districtName = layer.feature.properties.soum_name;
              }
              
              console.log('Processing district:', districtName);
              console.log('Layer properties:', layer.feature.properties);
              console.log('Available district colors:', Object.keys(districtColors));
               
              const color = districtColors[districtName || ''] || '#808080'; // Default gray
              console.log('Assigned color for', districtName, ':', color);
              
              // Apply style to the layer
              if (layer.setStyle) {
                layer.setStyle({
                  color: color,
                  weight: 3,
                  opacity: 0.8,
                  fillColor: color,
                  fillOpacity: 0.3
                });
              }
              
              // Enhanced popup with district info - cluster count will be updated after clustering
              let clusterCount = 0;
              
              // Enhanced popup with district info and cluster count
              const popupContent = `
                <div style="text-align: center;">
                  <h4 style="margin: 5px 0; color: ${color};">${districtName || 'Тодорхойгүй'}</h4>
                  <div style="font-size: 12px; color: #666;">
                    Улаанбаатар хотын дүүрэг
                  </div>
                  <div style="font-size: 14px; margin-top: 8px; font-weight: bold;">
                    🏢 <span class="district-count-${districtName}">Газар: ${clusterCount} ширхэг</span>
                  </div>
                </div>
              `;
              
              layer.bindPopup(popupContent);
            }
          });
         
         // Fit bounds after styling and apply district filter
         applyDistrictFilter();
         console.log('District styling completed');
       })
       .on("error", function(e: any) {
         console.error('KML layer error:', e);
       })
       .on("click", function (e: any) {
         // Click handler is now managed by individual layer popups
         e.layer.openPopup();
       });
       
     console.log('Adding KML layer to map...');
     kmlLayer.value.addTo(map.value);
     console.log('KML layer added successfully');
  } catch (e) {
    console.error("KML layer load error", e);
    console.error("Error details:", e.message, e.stack);
  }
  
  // Watch for payCenter changes to update markers with ebarimt colors
  watch(() => props.payCenter, (newPayCenter) => {
    if (newPayCenter && Object.keys(newPayCenter).length > 0) {
      console.log('PayCenter data updated, updating markers with ebarimt colors...');
      updateMarkersWithEbarimtColors(newPayCenter);
    }
  }, { deep: true });

  // Watch for payCenter changes specifically for land mode
  watch(() => props.payCenter, async (newPayCenter) => {
    if (props.mapType === 'land' && newPayCenter && Object.keys(newPayCenter).length > 0) {
      console.log('PayCenter data updated for land mode, re-rendering markers...');
      if (map.value && L) {
        await fetchAndRenderMarkers();
      }
    }
  }, { deep: true });



  console.log('=== MapView onMounted END ===');
});

watch(
  () => [props.district, props.khoroo, props.category, props.searchLand, props.organizations, props.payCenter, props.mapType, props.selectedAddress, props.selectedDistrictName],
  async (newValues, oldValues) => {
    console.log('=== MapView watch triggered ===');
    console.log('New values:', newValues);
    console.log('Organizations changed:', newValues[4] !== oldValues?.[4]);
    console.log('Organizations length:', newValues[4]?.length);
    console.log('PayCenter changed:', newValues[5] !== oldValues?.[5]);
    console.log('PayCenter length:', newValues[5]?.length);
    console.log('MapType changed:', newValues[6] !== oldValues?.[6]);
    console.log('Current mapType:', newValues[6]);
    console.log('SelectedDistrictName changed:', newValues[8] !== oldValues?.[8]);
    console.log('Current selectedDistrictName:', newValues[8]);
    
    // Handle district filter change for KML layer
    if (newValues[8] !== oldValues?.[8]) {
      console.log('District filter changed, updating KML layer...');
      await applyDistrictFilter();
    }
    
    // Handle KML layer visibility based on mapType
    if (kmlLayer.value && map.value) {
      if (newValues[6] === 'land') {
        // Hide KML layer when in land mode
        console.log('Hiding KML layer (land mode)');
        if (map.value.hasLayer(kmlLayer.value)) {
          map.value.removeLayer(kmlLayer.value);
        }
      } else {
        // Show KML layer when not in land mode (including empty string)
        console.log('Showing KML layer (normal mode)');
        if (!map.value.hasLayer(kmlLayer.value)) {
          map.value.addLayer(kmlLayer.value);
        }
      }
    }
    
    // Handle polygon layer visibility - only show in land mode
    if (polygonLayer.value && map.value) {
      if (newValues[6] === 'land') {
        // Show polygon layer in land mode
        console.log('Showing polygon layer (land mode)');
        if (!map.value.hasLayer(polygonLayer.value)) {
          map.value.addLayer(polygonLayer.value);
        }
      } else {
        // Hide polygon layer in other modes
        console.log('Hiding polygon layer (non-land mode)');
        if (map.value.hasLayer(polygonLayer.value)) {
          map.value.removeLayer(polygonLayer.value);
        }
      }
    }
    
    // For land mode, wait a bit for payCenter data to load if it's not available yet
    if (newValues[6] === 'land' && (!newValues[5] || Object.keys(newValues[5] || {}).length === 0)) {
      console.log('Land mode selected but payCenter data not ready yet, waiting...');
      // Wait for payCenter data to be loaded
      let attempts = 0;
      const maxAttempts = 10;
      while (attempts < maxAttempts && (!props.payCenter || Object.keys(props.payCenter || {}).length === 0)) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
        console.log(`Waiting for payCenter data... attempt ${attempts}/${maxAttempts}`);
      }
    }
    
    // Apply district filter when district prop changes
    if (kmlLayer.value && map.value && (newValues[0] !== oldValues?.[0])) {
      console.log('District filter changed, applying new filter...');
      applyDistrictFilter();
    }
    
    // Ensure map is ready before rendering markers
    if (map.value && L) {
      await fetchAndRenderMarkers();
    } else {
      console.log('Map or Leaflet not ready yet, skipping markers render');
    }
  },
  { deep: true }
);

// Function to update markers with ebarimt colors
function updateMarkersWithEbarimtColors(payCenterData: any) {
  if (!map.value || !markersLayer.value) return;
  
  console.log('Updating markers with ebarimt colors...', payCenterData);
  
  // Clear existing markers
  markersLayer.value.clearLayers();
  
  // Reset to simple layer group for ebarimt mode
  markersLayer.value = L.layerGroup();
  
  let markersCreated = 0;
  
  // Process each pay center location
  for (const [payCenterId, locationData] of Object.entries(payCenterData)) {
    const data = locationData as any;
    
    console.log('Processing pay center:', payCenterId, data);
    
    if (!data.lng || !data.lat || isNaN(parseFloat(data.lng)) || isNaN(parseFloat(data.lat))) {
      console.log('Invalid coordinates for:', payCenterId);
      continue;
    }
    
    const lat = parseFloat(data.lat);
    const lng = parseFloat(data.lng);
    
    // Determine marker color based on ebarimt percentage
    let markerIcon;
    let colorName;
    
    if (data.color === 'green') {
      markerIcon = greenIcon;
      colorName = 'Ногоон (100% е-баримт)';
    } else if (data.color === 'yellow') {
      markerIcon = yellowIcon;
      colorName = 'Шар (50-99% е-баримт)';
    } else {
      markerIcon = redIcon;
      colorName = 'Улаан (<50% е-баримт)';
    }
    
    // Create popup content
    const popupHtml = `<div style='width:280px'>
      <img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
      <div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${data.name || 'Барилга'}</div>
      <div style='font-size:13px;'>ID: ${data.pay_center_id || ''}</div>
      <div style='font-size:13px;'>Хаяг: ${data.address || '-'}</div>
      <div style='font-size:13px;'>Нийт байгууллага: ${data.total_organizations || 0}</div>
      <div style='font-size:13px;'>Е-баримт гаргадаг: ${data.organizations_with_ebarimt || 0}</div>
      <div style='font-size:13px;'>Е-баримтын хувь: ${(data.ebarimt_percentage || 0).toFixed(1)}%</div>
      <div style='font-size:13px; color: ${data.color === 'green' ? '#28a745' : data.color === 'yellow' ? '#ffc107' : '#dc3545'};'>
        Өнгө: ${colorName}
      </div>
      <div style='margin-top:8px;'><a href='/entity?id=${data.pay_center_id}' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a></div>
    </div>`;
    
    // Create marker
    const leafletMarker = L.marker([lat, lng], { icon: markerIcon });
    leafletMarker.bindPopup(popupHtml);
    
    markersLayer.value.addLayer(leafletMarker);
    markersCreated++;
    console.log(`Created ebarimt marker: ${data.name} at [${lat}, ${lng}] - ${colorName}`);
  }
  
  // Ensure markers layer is added to map
  if (map.value && !map.value.hasLayer(markersLayer.value)) {
    map.value.addLayer(markersLayer.value);
  }
  
  console.log(`✅ Updated markers with ebarimt colors: ${markersCreated} markers created`);
}
</script>
