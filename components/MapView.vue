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

/* Ebarimt cluster specific styles */
.ebarimt-cluster-marker {
  transition: all 0.3s ease;
  cursor: pointer;
}

.ebarimt-cluster-marker:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.ebarimt-cluster-city {
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
}

.ebarimt-cluster-district {
  filter: drop-shadow(0 3px 8px rgba(0,0,0,0.4));
}

.ebarimt-cluster-area {
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
}

/* Smooth transitions for marker clustering */
.leaflet-marker-icon {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.leaflet-marker-icon.leaflet-interactive {
  cursor: pointer;
}

/* Enhanced cluster popup styles */
.leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.leaflet-popup-tip {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Enhanced standard cluster styles */
.enhanced-cluster-marker {
  transition: all 0.3s ease;
  cursor: pointer;
}

.enhanced-cluster-marker:hover {
  transform: scale(1.08);
  transition: transform 0.2s ease;
}

.standard-cluster-city {
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4));
}

.standard-cluster-district {
  filter: drop-shadow(0 3px 8px rgba(168, 85, 247, 0.4));
}

.standard-cluster-area {
  filter: drop-shadow(0 2px 6px rgba(34, 197, 94, 0.3));
}

/* Improved marker cluster animations */
.marker-cluster-small:hover,
.marker-cluster-medium:hover,
.marker-cluster-large:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Loading animation for clusters */
@keyframes clusterAppear {
  0% { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  100% { 
    opacity: 1; 
    transform: scale(1); 
  }
}

.leaflet-marker-icon {
  animation: clusterAppear 0.3s ease-out;
}

/* Pulse animation for active clusters */
@keyframes clusterPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.marker-cluster-clicked {
  animation: clusterPulse 0.3s ease-out;
}

/* Enhanced hover effects */
.leaflet-marker-icon:hover {
  filter: brightness(1.1);
  z-index: 1000 !important;
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
  selectedKhorooName?: string;
}>();

const map = ref<any>(null);
const markersLayer = ref<any>(null);
const polygonLayer = ref<any>(null); // Polygon-уудад зориулсан тусдаа layer
const kmlLayer = ref<any>(null);

// Ebarimt marker statistics
const ebarimtStats = ref({
  redMarkers: 0,
  yellowMarkers: 0,
  greenMarkers: 0,
  totalMarkers: 0
});

let L: any = null;
let markerClusterGroup: any = null;
let redIcon: any = null;
let greenIcon: any = null;
let blueIcon: any = null;
let yellowIcon: any = null;

// Debounce timer for zoom events
let zoomDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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

// Function to determine district name from khoroo name
// Enhanced function to determine district from khoroo name based on actual KML structure
async function getDistrictForKhorooName(khorooName: string): Promise<string> {
  console.log('🔍 getDistrictForKhorooName called with:', khorooName);
  
  try {
    // Load KML file and parse the structure to find the correct district
    const response = await fetch('/duureg.kml');
    const kmlText = await response.text();
    
    // Parse KML string to find which district section this khoroo belongs to
    const lines = kmlText.split('\n');
    let currentDistrict = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line contains a district comment
      const districtMatch = line.match(/<!-- (.*?) дүүрэгийн хороонууд/);
      if (districtMatch) {
        currentDistrict = districtMatch[1];
        // Handle special cases for district name variations
        if (currentDistrict === 'Хануул') {
          currentDistrict = 'Хан Уул';
        }
        console.log('� Found district section:', currentDistrict);
        continue;
      }
      
      // Check if we found our target khoroo in this district section
      if (currentDistrict && line.includes(`<name>${khorooName}</name>`)) {
        console.log(`✅ Found khoroo "${khorooName}" in district "${currentDistrict}"`);
        return currentDistrict;
      }
    }
    
    console.log(`❌ Could not find district for khoroo in KML: ${khorooName}`);
    
    // Fallback to static mapping if KML parsing fails
    return getDistrictForKhorooNameStatic(khorooName);
    
  } catch (error) {
    console.error('❌ Error parsing KML for district mapping:', error);
    // Fallback to static mapping
    return getDistrictForKhorooNameStatic(khorooName);
  }
}

// Static fallback mapping function
function getDistrictForKhorooNameStatic(khorooName: string): string {
  console.log('🔄 Using static fallback mapping for:', khorooName);
  
  // Direct mapping based on known khoroo-district relationships
  const khorooDistrictMap: { [key: string]: string } = {
    // Хан Уул дүүрэг (1-4-р хороо)
    '1-р хороо': 'Хан Уул',
    '2-р хороо': 'Хан Уул', 
    '3-р хороо': 'Хан Уул',
    '4-р хороо': 'Хан Уул',
    
    // Чингэлтэй дүүрэг (5-19-р хороо)
    '5-р хороо': 'Чингэлтэй',
    '6-р хороо': 'Чингэлтэй',
    '7-р хороо': 'Чингэлтэй',
    '8-р хороо': 'Чингэлтэй',
    '9-р хороо': 'Чингэлтэй',
    '10-р хороо': 'Чингэлтэй',
    '11-р хороо': 'Чингэлтэй',
    '12-р хороо': 'Чингэлтэй',
    '13-р хороо': 'Чингэлтэй',
    '14-р хороо': 'Чингэлтэй',
    '15-р хороо': 'Чингэлтэй',
    '16-р хороо': 'Чингэлтэй',
    '17-р хороо': 'Чингэлтэй',
    '18-р хороо': 'Чингэлтэй',
    '19-р хороо': 'Чингэлтэй',
    
    // Сүхбаатар дүүрэг (20-23-р хороо)
    '20-р хороо': 'Сүхбаатар',
    '21-р хороо': 'Сүхбаатар',
    '22-р хороо': 'Сүхбаатар',
    '23-р хороо': 'Сүхбаатар',
    
    // Баянзүрх дүүрэг (24-28-р хороо)
    '24-р хороо': 'Баянзүрх',
    '25-р хороо': 'Баянзүрх',
    '26-р хороо': 'Баянзүрх',
    '27-р хороо': 'Баянзүрх',
    '28-р хороо': 'Баянзүрх',
    
    // Баянгол дүүрэг (29-32-р хороо)
    '29-р хороо': 'Баянгол',
    '30-р хороо': 'Баянгол',
    '31-р хороо': 'Баянгол',
    '32-р хороо': 'Баянгол',
    
    // Сонгинохайрхан дүүрэг (33-38-р хороо)
    '33-р хороо': 'Сонгинохайрхан',
    '34-р хороо': 'Сонгинохайрхан',
    '35-р хороо': 'Сонгинохайрхан',
    '36-р хороо': 'Сонгинохайрхан',
    '37-р хороо': 'Сонгинохайрхан',
    '38-р хороо': 'Сонгинохайрхан',
  };
  
  // Check direct mapping first
  if (khorooDistrictMap[khorooName]) {
    console.log('✅ Static mapping found:', khorooName, '->', khorooDistrictMap[khorooName]);
    return khorooDistrictMap[khorooName];
  }
  
  // If no direct mapping, try to extract district name from khoroo name patterns
  const districts = ['Багануур', 'Багахангай', 'Баянгол', 'Баянзүрх', 'Налайх', 'Сонгинохайрхан', 'Сүхбаатар', 'Хан Уул', 'Чингэлтэй'];
  
  for (const district of districts) {
    if (khorooName.includes(district)) {
      console.log('✅ District name found in khoroo name:', khorooName, '->', district);
      return district;
    }
  }
  
  console.log('❌ No mapping found for:', khorooName);
  return 'Тодорхойгүй дүүрэг';
}

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
    console.log('District data not loaded, using enhanced standard clustering');
    return createEnhancedStandardClusters(markers);
  }

  // Check current zoom level to decide clustering behavior
  const currentZoom = map.value ? map.value.getZoom() : 8;
  const DISTRICT_ZOOM_THRESHOLD = 11;   // Show district clusters
  const AREA_ZOOM_THRESHOLD = 13;       // Show area clusters  
  const INDIVIDUAL_ZOOM_THRESHOLD = 15; // Show individual markers
  
  console.log(`Creating district clusters at zoom level ${currentZoom}`);

  // At very high zoom, show individual markers with minimal clustering
  if (currentZoom >= INDIVIDUAL_ZOOM_THRESHOLD) {
    console.log('High zoom: Using enhanced standard clustering for individual markers');
    return createEnhancedStandardClusters(markers);
  }

  // At medium zoom, create area-based clusters
  if (currentZoom >= AREA_ZOOM_THRESHOLD) {
    console.log('Medium zoom: Creating area-based clusters');
    return createStandardAreaClusters(markers, currentZoom);
  }

  // At low zoom, create district-based clusters
  if (currentZoom >= DISTRICT_ZOOM_THRESHOLD) {
    console.log('Low zoom: Creating district-based clusters');
    return createDistrictStandardClusters(markers);
  }

  // At very low zoom, create city-wide cluster
  console.log('Very low zoom: Creating city-wide cluster');
  return createCityWideStandardCluster(markers);
}

// Enhanced standard clustering function
function createEnhancedStandardClusters(markers: any[]): any[] {
  if (markers.length === 0) return [];
  
  const currentZoom = map.value ? map.value.getZoom() : 15;
  const dynamicClusterRadius = Math.max(20, 80 - (currentZoom * 3)); // Smoother radius calculation
  
  const standardClusterGroup = L.markerClusterGroup({
    maxClusterRadius: dynamicClusterRadius,
    disableClusteringAtZoom: 18, // Always allow some clustering until max zoom
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyDistanceMultiplier: 1.3,
    animate: true,
    animateAddingMarkers: true,
    removeOutsideVisibleBounds: true, // Performance optimization
    iconCreateFunction: function(cluster) {
      const count = cluster.getChildCount();
      let size = 'small';
      let colorClass = 'marker-cluster-small';
      
      if (count < 10) {
        size = 'small';
        colorClass = 'marker-cluster-small';
      } else if (count < 100) {
        size = 'medium'; 
        colorClass = 'marker-cluster-medium';
      } else {
        size = 'large';
        colorClass = 'marker-cluster-large';
      }
      
      const iconSize = size === 'small' ? 32 : size === 'medium' ? 36 : 40;
      
      return L.divIcon({
        html: `<div style="background-color: rgba(34, 197, 94, 0.9); border-radius: 50%; color: white; font-weight: bold; text-align: center; line-height: ${iconSize}px; width: ${iconSize}px; height: ${iconSize}px; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); transition: all 0.3s ease; font-size: ${iconSize > 36 ? '14px' : '12px'};"><span>${count}</span></div>`,
        className: `${colorClass} enhanced-cluster-marker`,
        iconSize: [iconSize + 4, iconSize + 4],
        iconAnchor: [(iconSize + 4) / 2, (iconSize + 4) / 2]
      });
    }
  });
  
  // Add all markers to standard cluster group
  markers.forEach(marker => {
    standardClusterGroup.addLayer(marker);
  });
  
  return [standardClusterGroup];
}

// Function to create area-based clusters for standard markers
function createStandardAreaClusters(markers: any[], zoom: number): any[] {
  const clusters: any[] = [];
  const processed = new Set();
  const clusterRadius = Math.max(0.003, 0.015 - (zoom * 0.0008));
  const clusterRadiusMeters = clusterRadius * 111000;
  
  // Sort markers by latitude for optimization
  const sortedMarkers = [...markers].sort((a, b) => a.getLatLng().lat - b.getLatLng().lat);
  
  sortedMarkers.forEach((marker, index) => {
    if (processed.has(index)) return;
    
    const markerLatLng = marker.getLatLng();
    const nearbyMarkers = [marker];
    processed.add(index);
    
    // Find nearby markers
    for (let i = index + 1; i < sortedMarkers.length; i++) {
      if (processed.has(i)) continue;
      
      const otherMarker = sortedMarkers[i];
      const otherLatLng = otherMarker.getLatLng();
      
      // Quick latitude check
      const latDiff = Math.abs(markerLatLng.lat - otherLatLng.lat);
      if (latDiff > clusterRadius) break;
      
      const distance = markerLatLng.distanceTo(otherLatLng);
      
      if (distance < clusterRadiusMeters) {
        nearbyMarkers.push(otherMarker);
        processed.add(i);
        
        if (nearbyMarkers.length >= 25) break; // Limit for performance
      }
    }
    
    if (nearbyMarkers.length > 1) {
      const clusterMarker = createStandardClusterMarker(nearbyMarkers, 'area');
      clusters.push(clusterMarker);
    } else {
      clusters.push(marker);
    }
  });
  
  console.log(`Created ${clusters.length} standard area clusters from ${markers.length} markers`);
  return clusters;
}

// Function to create district-based standard clusters
function createDistrictStandardClusters(markers: any[]): any[] {
  const districtGroups: { [key: string]: any[] } = {};
  const ungroupedMarkers: any[] = [];

  // Group markers by district
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

  const clusterMarkers: any[] = [];

  // Create cluster for each district
  Object.entries(districtGroups).forEach(([districtName, districtMarkers]) => {
    if (districtMarkers.length > 1) {
      const clusterMarker = createStandardClusterMarker(districtMarkers, 'district', districtName);
      clusterMarkers.push(clusterMarker);
    } else if (districtMarkers.length === 1) {
      clusterMarkers.push(districtMarkers[0]);
    }
  });

  clusterMarkers.push(...ungroupedMarkers);
  console.log(`Created ${Object.keys(districtGroups).length} district clusters`);
  
  // Update KML layer popup counts
  updateDistrictCounts(districtGroups);
  
  return clusterMarkers;
}

// Function to create city-wide standard cluster
function createCityWideStandardCluster(markers: any[]): any[] {
  if (markers.length <= 1) return markers;
  
  const clusterMarker = createStandardClusterMarker(markers, 'city');
  return [clusterMarker];
}

// Function to create standard cluster marker
function createStandardClusterMarker(markers: any[], type: 'area' | 'district' | 'city', districtName?: string): any {
  const totalCount = markers.length;
  
  // Determine cluster position
  let clusterPosition;
  if (type === 'district' && districtName && districtPolygons[districtName]) {
    clusterPosition = districtPolygons[districtName].center;
  } else if (type === 'city') {
    clusterPosition = { lat: 47.9184, lng: 106.9177 }; // Ulaanbaatar center
  } else {
    // Calculate centroid for area clusters
    let latSum = 0, lngSum = 0;
    for (const marker of markers) {
      const latLng = marker.getLatLng();
      latSum += latLng.lat;
      lngSum += latLng.lng;
    }
    clusterPosition = { lat: latSum / markers.length, lng: lngSum / markers.length };
  }
  
  // Size and color based on count and type
  let iconSize = 36;
  let backgroundColor = 'rgba(34, 197, 94, 0.9)'; // Green
  
  if (type === 'city') {
    iconSize = 55;
    backgroundColor = 'rgba(59, 130, 246, 0.9)'; // Blue for city
  } else if (type === 'district') {
    iconSize = 46;
    backgroundColor = 'rgba(168, 85, 247, 0.9)'; // Purple for district
  } else if (totalCount > 15) {
    iconSize = 42;
    backgroundColor = 'rgba(245, 158, 11, 0.9)'; // Orange for large areas
  }
  
  const clusterIcon = L.divIcon({
    html: `<div style="background-color: ${backgroundColor}; border-radius: 50%; color: white; font-weight: bold; text-align: center; line-height: ${iconSize}px; width: ${iconSize}px; height: ${iconSize}px; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4); transition: all 0.3s ease; cursor: pointer; font-size: ${iconSize > 42 ? '14px' : '12px'};"><span>${totalCount}</span></div>`,
    className: `standard-cluster-marker standard-cluster-${type}`,
    iconSize: [iconSize + 6, iconSize + 6],
    iconAnchor: [(iconSize + 6) / 2, (iconSize + 6) / 2]
  });

  const clusterMarker = L.marker([clusterPosition.lat, clusterPosition.lng], { 
    icon: clusterIcon 
  });

  // Create popup content
  const typeLabel = type === 'district' ? 'дүүрэг' : type === 'city' ? 'хот' : 'бүс';
  
  const popupContent = `<div style="width: 240px; font-family: 'Segoe UI', sans-serif;">
<div style="font-weight: bold; font-size: 18px; margin: 8px 0 4px 0; color: ${backgroundColor};">
${districtName ? `${districtName} ${typeLabel}` : `${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} кластер`}
</div>
<div style="font-size: 14px; margin-bottom: 8px;">Нийт цэг: ${totalCount} ширхэг</div>
<div style="font-size: 12px; color: #666; margin-top: 8px;">Дэлгэрэнгүй харахын тулд дарна уу</div>
</div>`;

  clusterMarker.bindPopup(popupContent);

  // Click handler for smooth zoom
  clusterMarker.on('click', function() {
    if (map.value) {
      const currentZoom = map.value.getZoom();
      let targetZoom = Math.min(18, currentZoom + 3);
      
      if (type === 'city') targetZoom = 12;
      else if (type === 'district') targetZoom = 15;
      
      map.value.flyTo([clusterPosition.lat, clusterPosition.lng], targetZoom, {
        duration: 1.0,
        easeLinearity: 0.25
      });
      
      // Add click animation
      const element = this._icon;
      if (element) {
        element.classList.add('marker-cluster-clicked');
        setTimeout(() => {
          element.classList.remove('marker-cluster-clicked');
        }, 300);
      }
    }
  });

  return clusterMarker;
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
  
  console.log('Applying district filter...', 'selectedDistrictName:', props.selectedDistrictName, 'selectedKhorooName:', props.selectedKhorooName);
  
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
    
    // Create a new KML string with filtered content
    let filteredKML = '';
    
    if (!props.selectedDistrictName || props.selectedDistrictName === '' || props.selectedDistrictName === 'Дүүрэг' || props.selectedDistrictName === 'Бүгд') {
      // Show all districts and khoroos - use original KML
      filteredKML = kmlText;
    } else {
      // Filter for specific district and optionally specific khoroo
      const placemarks = kmlDoc.querySelectorAll('Placemark');
      const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
  <Document id="soumbnd">
    <name>sum_hil2.kml</name>
    <Snippet maxLines="2">
    </Snippet>
    <Style id="PolyStyle00">
      <LineStyle>
        <color>ff808080</color>
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
      let isInTargetDistrict = false;
      let foundTargetDistrict = false;
      let currentDistrictName = '';
      
      // Convert KML to string to work with comments
      const kmlString = new XMLSerializer().serializeToString(kmlDoc);
      const lines = kmlString.split('\n');
      
      console.log('Looking for district comment:', `<!-- ${props.selectedDistrictName} дүүрэгийн хороонууд`);
      
      // Special handling for Хан-Уул district (KML uses "Хануул")
      let searchDistrictName = props.selectedDistrictName;
      if (props.selectedDistrictName === 'Хан-Уул') {
        searchDistrictName = 'Хануул';
      }
      
      // Special handling for districts that need both district and khoroo polygons
      if (props.selectedDistrictName === 'Налайх') {
        console.log('Special handling for Налайх - showing district + khoroo polygons');
        
        // First, find and add the district polygon
        placemarks.forEach(placemark => {
          const nameElement = placemark.querySelector('name');
          if (nameElement && nameElement.textContent?.trim() === 'Налайх') {
            selectedPlacemarks += new XMLSerializer().serializeToString(placemark);
            console.log('Added Налайх district polygon');
          }
        });
        
        // Then, find and add all khoroo polygons for Налайх
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          if (line.includes('<!-- Налайх дүүргийн хороонууд -->')) {
            console.log('Found Налайх khoroos section');
            isInTargetDistrict = true;
            foundTargetDistrict = true;
            continue;
          }
          
          // Stop when we hit another district comment
          if (isInTargetDistrict && line.includes('<!--') && line.includes('дүүрэгийн хороонууд') && !line.includes('Налайх')) {
            console.log('Found end of Налайх khoroos section');
            isInTargetDistrict = false;
            break;
          }
          
          // Also check for end of document
          if (isInTargetDistrict && (line.includes('</Document>') || line.includes('</kml>'))) {
            console.log('Found end of document, stopping Налайх parsing');
            isInTargetDistrict = false;
            break;
          }
          
          // Collect khoroo placemarks
          if (isInTargetDistrict && line.includes('<Placemark')) {
            let placemarkContent = '';
            let j = i;
            let depth = 0;
            
            while (j < lines.length) {
              const currentLine = lines[j];
              placemarkContent += currentLine + '\n';
              
              if (currentLine.includes('<Placemark')) depth++;
              if (currentLine.includes('</Placemark>')) {
                depth--;
                if (depth === 0) {
                  selectedPlacemarks += placemarkContent;
                  i = j;
                  break;
                }
              }
              j++;
            }
          }
        }
      } else if (props.selectedDistrictName === 'Багахангай') {
        console.log('Special handling for Багахангай - only district polygon exists');
        
        // Only find and add the district polygon (no khoroos exist)
        placemarks.forEach(placemark => {
          const nameElement = placemark.querySelector('name');
          if (nameElement && nameElement.textContent?.trim() === 'Багахангай') {
            selectedPlacemarks += new XMLSerializer().serializeToString(placemark);
            console.log('Added Багахангай district polygon');
            foundTargetDistrict = true;
          }
        });
      } else if (props.selectedDistrictName === 'Хан-Уул') {
        console.log('Special handling for Хан-Уул (Хануул) - precise parsing needed');
        
        // Find Хануул khoroos section specifically
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          if (line.includes('<!-- Хануул дүүрэгийн хороонууд-->')) {
            console.log('Found Хануул khoroos section');
            isInTargetDistrict = true;
            foundTargetDistrict = true;
            continue;
          }
          
          // Stop when we hit Баянзүрх (which comes right after Хануул)
          if (isInTargetDistrict && line.includes('<!-- Баянзүрх дүүрэгийн хороонууд')) {
            console.log('Found end of Хануул khoroos section (Баянзүрх starts)');
            isInTargetDistrict = false;
            break;
          }
          
          // Also check for end of document
          if (isInTargetDistrict && (line.includes('</Document>') || line.includes('</kml>'))) {
            console.log('Found end of document, stopping Хануул parsing');
            isInTargetDistrict = false;
            break;
          }
          
          // Collect khoroo placemarks
          if (isInTargetDistrict && line.includes('<Placemark')) {
            let placemarkContent = '';
            let j = i;
            let depth = 0;
            
            while (j < lines.length) {
              const currentLine = lines[j];
              placemarkContent += currentLine + '\n';
              
              if (currentLine.includes('<Placemark')) depth++;
              if (currentLine.includes('</Placemark>')) {
                depth--;
                if (depth === 0) {
                  // Complete placemark found
                  const tempDoc = parser.parseFromString(`<root>${placemarkContent}</root>`, 'text/xml');
                  const placemark = tempDoc.querySelector('Placemark');
                  
                  if (placemark) {
                    const nameElement = placemark.querySelector('name');
                    const khorooName = nameElement?.textContent?.trim();
                    
                    console.log('Found khoroo in Хануул district:', khorooName);
                    
                    // If specific khoroo is selected, filter by khoroo name
                    if (!props.selectedKhorooName || props.selectedKhorooName === '' || props.selectedKhorooName === 'Хороо' || props.selectedKhorooName === 'Бүгд') {
                      // Show all khoroos in the district
                      selectedPlacemarks += placemarkContent;
                    } else {
                      // Show only the selected khoroo
                      if (khorooName === props.selectedKhorooName) {
                        selectedPlacemarks += placemarkContent;
                        console.log('Match found! Adding khoroo to filtered KML:', khorooName);
                      }
                    }
                  }
                  
                  i = j; // Skip to end of this placemark
                  break;
                }
              }
              j++;
            }
          }
        }
      } else {
        // Normal processing for other districts
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Check if this line contains our target district comment
          if (line.includes(`<!-- ${searchDistrictName} дүүрэгийн хороонууд`)) {
            console.log('Found target district comment:', line);
            isInTargetDistrict = true;
            foundTargetDistrict = true;
            currentDistrictName = props.selectedDistrictName;
            continue;
          }
          
          // Check if we hit another district comment (end of our target district)
          // More robust check for district comment endings
          if (isInTargetDistrict && line.includes('<!--') && line.includes('дүүрэгийн хороонууд')) {
            // Make sure it's not the same district comment we just started with
            if (!line.includes(`${searchDistrictName} дүүрэгийн хороонууд`)) {
              console.log('Found end of target district, stopping:', line);
              isInTargetDistrict = false;
              break;
            }
          }
          
          // Also check for end of document or other major sections
          if (isInTargetDistrict && (line.includes('</Document>') || line.includes('</kml>'))) {
            console.log('Found end of document, stopping parsing');
            isInTargetDistrict = false;
            break;
          }
          
          // If we're in the target district, collect placemarks
          if (isInTargetDistrict && line.includes('<Placemark')) {
            // Start collecting placemark
            let placemarkContent = '';
            let j = i;
            let depth = 0;
            
            while (j < lines.length) {
              const currentLine = lines[j];
              placemarkContent += currentLine + '\n';
              
              if (currentLine.includes('<Placemark')) depth++;
              if (currentLine.includes('</Placemark>')) {
                depth--;
                if (depth === 0) {
                  // Complete placemark found
                  const tempDoc = parser.parseFromString(`<root>${placemarkContent}</root>`, 'text/xml');
                  const placemark = tempDoc.querySelector('Placemark');
                  
                  if (placemark) {
                    const nameElement = placemark.querySelector('name');
                    const khorooName = nameElement?.textContent?.trim();
                    
                    console.log('Found khoroo in target district:', khorooName);
                    
                    // If specific khoroo is selected, filter by khoroo name
                    if (!props.selectedKhorooName || props.selectedKhorooName === '' || props.selectedKhorooName === 'Хороо' || props.selectedKhorooName === 'Бүгд') {
                      // Show all khoroos in the district
                      selectedPlacemarks += placemarkContent;
                    } else {
                      // Show only the selected khoroo
                      if (khorooName === props.selectedKhorooName) {
                        selectedPlacemarks += placemarkContent;
                        console.log('Match found! Adding khoroo to filtered KML:', khorooName);
                      }
                    }
                  }
                  
                  i = j; // Skip to end of this placemark
                  break;
                }
              }
              j++;
            }
          }
        }
      }
      
      if (selectedPlacemarks) {
        filteredKML = kmlHeader + selectedPlacemarks + kmlFooter;
        console.log('Created filtered KML with', selectedPlacemarks.split('<Placemark').length - 1, 'placemarks');
      } else {
        console.log('No matching district/khoroo found, creating empty KML');
        // Show empty KML instead of all data when no match is found
        filteredKML = kmlHeader + kmlFooter;
      }
    }
    
    // Create a blob from the filtered KML and load it
    const blob = new Blob([filteredKML], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    
    // District and Khoroo colors mapping for visual distinction
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

    // Generate unique colors for khoroos within each district
    const khorooColors = [
      '#FFB6C1', '#87CEEB', '#98FB98', '#F0E68C', '#DDA0DD',
      '#F4A460', '#B0E0E6', '#FF69B4', '#32CD32', '#FFD700',
      '#FF7F50', '#6495ED', '#9370DB', '#3CB371', '#FFA500'
    ];

    // Advanced function to determine which district a khoroo belongs to by parsing KML
    async function getDistrictForKhorooFromKML(khorooName: string): Promise<string> {
      try {
        // Load KML file
        const response = await fetch('/duureg.kml');
        const kmlText = await response.text();
        
        // Parse KML string to find the khoroo and its district
        const lines = kmlText.split('\n');
        let currentDistrict = '';
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Check if this line contains a district comment
          const districtMatch = line.match(/<!-- (.*?) дүүрэгийн хороонууд/);
          if (districtMatch) {
            currentDistrict = districtMatch[1];
            console.log('Found district section:', currentDistrict);
            continue;
          }
          
          // Check if we found our target khoroo in this district section
          if (currentDistrict && line.includes(`<name>${khorooName}</name>`)) {
            console.log(`Found khoroo "${khorooName}" in district "${currentDistrict}"`);
            return currentDistrict;
          }
        }
        
        console.log(`Could not find district for khoroo: ${khorooName}`);
        return 'Тодорхойгүй дүүрэг';
      } catch (error) {
        console.error('Error finding district for khoroo:', error);
        return 'Тодорхойгүй дүүрэг';
      }
    }

    // Function to determine which district a khoroo belongs to
    async function getDistrictForKhoroo(khorooName: string): Promise<string> {
      // If we have a currently selected district, use that
      if (props.selectedDistrictName && props.selectedDistrictName !== 'Дүүрэг' && props.selectedDistrictName !== 'Бүгд') {
        return props.selectedDistrictName;
      }
      
      // Otherwise, try to determine from KML structure
      return await getDistrictForKhorooFromKML(khorooName);
    }

    // Use omnivore to parse the filtered KML
    kmlLayer.value = omnivore.kml(url)
      .on('ready', async function() {
        console.log('Filtered KML layer loaded successfully');
        
        // Style each district/khoroo with different colors
        let khorooIndex = 0;
        const layers: any[] = [];
        
        // Collect all layers first
        this.eachLayer(function(layer: any) {
          layers.push(layer);
        });
        
        // Process each layer
        for (const layer of layers) {
          if (layer.setStyle && layer.feature && layer.feature.properties && layer.feature.properties.name) {
            const placeName = layer.feature.properties.name.trim();
            console.log('Styling placemark:', placeName);
            
            let styleColor = { color: '#ff7800', fillColor: '#ff7800' }; // Default
            let isDistrict = false;
            
            // Check if this is a district (matches our district names)
            if (districtColors[placeName]) {
              styleColor = districtColors[placeName];
              isDistrict = true;
              console.log('Applied district color for:', placeName);
            } else {
              // This is likely a khoroo, use rotating khoroo colors
              const colorIndex = khorooIndex % khorooColors.length;
              const khorooColor = khorooColors[colorIndex];
              styleColor = { color: khorooColor, fillColor: khorooColor };
              khorooIndex++;
              console.log('Applied khoroo color for:', placeName, 'color:', khorooColor);
            }
            
            layer.setStyle({
              color: '#808080',        // Gray border
              weight: 2,
              opacity: 0.8,
              fillColor: styleColor.fillColor,
              fillOpacity: 0.3
            });
            
            // Add hover effect
            layer.on('mouseover', function(e: any) {
              e.target.setStyle({
                color: '#505050',        // Darker gray on hover
                weight: 3,
                opacity: 1,
                fillOpacity: 0.5
              });
            });
            
            layer.on('mouseout', function(e: any) {
              e.target.setStyle({
                color: '#808080',        // Gray border
                weight: 2,
                opacity: 0.8,
                fillColor: styleColor.fillColor,
                fillOpacity: 0.3
              });
            });
            
            // Enhanced popup with district and khoroo info
            if (isDistrict) {
              const popupContent = `
                <div style="text-align: center;">
                  <h4 style="margin: 5px 0; color: ${styleColor.color};">${placeName}</h4>
                  <div style="font-size: 12px; color: #666;">
                    Улаанбаатар хотын дүүрэг
                  </div>
                </div>
              `;
              layer.bindPopup(popupContent);
            } else {
              // This is a khoroo - find its district asynchronously
              const districtName = await getDistrictForKhoroo(placeName);
              const popupContent = `
                <div style="text-align: center;">
                  <h4 style="margin: 5px 0; color: ${styleColor.color};">${placeName}</h4>
                  <div style="font-size: 14px; font-weight: bold; color: #333; margin: 5px 0;">
                    ${districtName} дүүрэг
                  </div>
                  <div style="font-size: 12px; color: #666;">
                    Улаанбаатар хот
                  </div>
                </div>
              `;
              layer.bindPopup(popupContent);
            }
            
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
        }
        
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
  
  console.log(`Re-rendering markers based on zoom level ${currentZoom}, mapType: ${props.mapType}`);
  
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
  
  // Apply clustering based on map type and current zoom
  let clusteredMarkers;
  if (props.mapType === 'ebarimt') {
    // Use ebarimt-specific clustering
    clusteredMarkers = createEbarimtClusters(storedMarkers);
  } else {
    // Use standard district clustering
    clusteredMarkers = createDistrictClusters(storedMarkers);
  }
  
  // Add clustered markers to the map with smooth transition
  setTimeout(() => {
    clusteredMarkers.forEach(marker => {
      markersLayer.value.addLayer(marker);
    });
  }, 50); // Small delay for smooth transition
  
  // Update district counts only when clustered and not in ebarimt mode
  if (currentZoom < ZOOM_THRESHOLD && props.mapType !== 'ebarimt') {
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
  // Clear but keep the existing markersLayer if it exists
  if (!markersLayer.value) {
    markersLayer.value = L.layerGroup();
    console.log('Created simple layerGroup for district clustering');
  } else {
    console.log('Using existing markersLayer for district clustering');
  }
  
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
    
    // Apply enhanced district-based clustering to organization markers
    if (individualMarkers.length > 0) {
      console.log('Applying enhanced district-based clustering...');
      console.log(`Total markers to cluster: ${individualMarkers.length}`);
      
      // Store individual markers on map object for zoom-based re-rendering
      if (map.value) {
        map.value._individualMarkers = individualMarkers;
      }
      
      // Create enhanced district clusters
      const clusteredMarkers = createDistrictClusters(individualMarkers);
      console.log(`Clustered into: ${clusteredMarkers.length} markers/clusters`);
      
      // Add clustered markers to the map with smooth transition
      setTimeout(() => {
        clusteredMarkers.forEach(marker => {
          markersLayer.value.addLayer(marker);
        });
      }, 50); // Small delay for smooth rendering
      
      console.log('✅ Enhanced district-based clustering applied');
    } else {
      // If district data not loaded, add individual markers normally
      console.log('District data not loaded, adding individual markers...');
      
      // Store individual markers on map object even when not clustering (except for ebarimt mode)
      if (map.value && props.mapType !== 'ebarimt') {
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
    console.log('PayCenter data for ebarimt:', props.payCenter);
    
    if (props.payCenter && Object.keys(props.payCenter).length > 0) {
      updateMarkersWithEbarimtColors(props.payCenter);
    } else {
      console.log('No payCenter data available for ebarimt mode');
    }
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
            <div style="font-weight:bold; font-size:18px; margin: 8px 0 4px 0; color:${groupColor};">Газрын талбай ${payCenterID}</div>
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

    // Маркеруудыг шинэчлэх - fallback markers ч enhanced clustering хийх
    if (markersLayer.value) {
      try {
        markersLayer.value.clearLayers();
      } catch (e) {}
    }
    
    // Use simple LayerGroup for fallback markers to apply custom clustering
    markersLayer.value = L.layerGroup();
    
    const individualMarkers: any[] = [];
    
    markersData.forEach((marker: LandData) => {
      const lat = parseFloat(marker.COORD_Y?.String || marker.COORD_Y);
      const lng = parseFloat(marker.COORD_X?.String || marker.COORD_X);
      if (!isNaN(lat) && !isNaN(lng)) {
        // all_barimt_ok утгаар өнгө сонгоно
        let icon = greenIcon;
        const leafletMarker = L.marker([lat, lng], { icon });
        const popupHtml = `<div style='width:240px'>
<img src='/uploads/go.market.jpeg' style='width:100%;border-radius:8px 8px 0 0;' />
<div style='text-align:center;'>
<div style='font-weight:bold;font-size:18px;margin:8px 0 4px 0;'>${marker.NAME?.String || marker.NAME || 'Газрын нэр'}</div>
</div>
<div style='font-size:13px;'>ID: ${marker.ID || ''}</div>
<div style='font-size:13px;'>Нэгж талбарын дугаар: ${marker.PARCEL_ID || '-'}</div>
<div style='font-size:13px;margin-bottom:8px;'>${marker.COORD_Y?.String || marker.COORD_Y || ""}</div>
<div style='display:flex;align-items:center;gap:6px;'>
<a href='/entity?id=${marker.ID}' style='color:#1976d2;text-decoration:underline;cursor:pointer;'>дэлгэрэнгүй</a>
<span style='font-size:12px;color:#888;'>(2025/06/21 нд шинчлэгдсэн)</span>
</div>
</div>`;
        
        leafletMarker.bindPopup(popupHtml);
        individualMarkers.push(leafletMarker);
      }
    });
    
    // Store individual markers for zoom-based clustering
    if (map.value) {
      map.value._individualMarkers = individualMarkers;
    }
    
    // Apply enhanced clustering to fallback markers
    const clusteredMarkers = createDistrictClusters(individualMarkers);
    
    // Add clustered markers to the map
    clusteredMarkers.forEach(marker => {
      markersLayer.value.addLayer(marker);
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
      
      // Set new timer with adaptive debounce delay based on map type
      const debounceDelay = props.mapType === 'ebarimt' ? 150 : 100; // Slightly longer for ebarimt due to more complex clustering
      
      zoomDebounceTimer = setTimeout(() => {
        console.log(`Executing zoom-based re-render at zoom ${currentZoom} for ${props.mapType} mode`);
        reRenderMarkersOnZoom();
        zoomDebounceTimer = null;
      }, debounceDelay);
    });
    
    // Add move event for better performance during panning
    map.value.on('moveend', function() {
      // Only re-cluster if we're in a clustered zoom level and have many markers
      const currentZoom = map.value.getZoom();
      const storedMarkers = map.value._individualMarkers || [];
      
      if (storedMarkers.length > 50 && currentZoom < 13) {
        // Clear previous timer
        if (zoomDebounceTimer) {
          clearTimeout(zoomDebounceTimer);
        }
        
        zoomDebounceTimer = setTimeout(() => {
          console.log(`Re-clustering after pan at zoom ${currentZoom}`);
          reRenderMarkersOnZoom();
          zoomDebounceTimer = null;
        }, 200); // Longer delay for move events
      }
    });
    
    console.log('Zoom and move event listeners added with adaptive smooth debounce');
    
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
      .on("ready", async function () {
        console.log('🎉 KML layer ready, bounds:', kmlLayer.value.getBounds());
        console.log('📊 District polygons loaded for clustering:', Object.keys(districtPolygons));
        console.log('🔍 Total layers loaded:', this.getLayers().length);
        
        // Collect all layers first
        const layers: any[] = [];
        this.eachLayer(function(layer: any) {
          layers.push(layer);
        });
        
        // Process each layer with async district detection
        let layerCount = 0;
        for (const layer of layers) {
          layerCount++;
          console.log(`\n🔍 === LAYER ${layerCount} ANALYSIS ===`);
          
          if (layer.feature && layer.feature.properties) {
            // Get polygon name from KML properties
            let polygonName = null;
            
            // Log all available properties for debugging
            console.log('🔍 ALL PROPERTIES:', JSON.stringify(layer.feature.properties, null, 2));
            console.log('🔍 FEATURE TYPE:', layer.feature.type);
            console.log('🔍 GEOMETRY TYPE:', layer.feature.geometry?.type);
            
            // Try different property names that might contain the polygon name
            if (layer.feature.properties.name) {
              polygonName = layer.feature.properties.name;
              console.log('📍 Found name:', polygonName);
            } else if (layer.feature.properties.n) {
              polygonName = layer.feature.properties.n;
              console.log('📍 Found n:', polygonName);
            } else if (layer.feature.properties.soum_name) {
              polygonName = layer.feature.properties.soum_name;
              console.log('📍 Found soum_name:', polygonName);
            } else if (layer.feature.properties.Name) {
              polygonName = layer.feature.properties.Name;
              console.log('📍 Found Name (capital):', polygonName);
            } else if (layer.feature.properties.description) {
              console.log('📍 Found description:', layer.feature.properties.description);
            }
            
            console.log('🎯 Final polygonName:', polygonName);
            
            // Determine if this is a district or khoroo based on the name pattern
            let isDistrict = false;
            let districtName = '';
            let khorooName = '';
            
            console.log('🔎 Starting analysis for:', polygonName);
            
            // Check if it's a district (main districts in Mongolia)
            const districts = ['Багануур', 'Багахангай', 'Баянгол', 'Баянзүрх', 'Налайх', 'Сонгинохайрхан', 'Сүхбаатар', 'Хан Уул', 'Чингэлтэй'];
            
            if (polygonName && districts.includes(polygonName)) {
              // This is a district
              isDistrict = true;
              districtName = polygonName;
              console.log('✅ DISTRICT detected:', districtName);
            } else if (polygonName) {
              // This is likely a khoroo - we need to determine which district it belongs to
              khorooName = polygonName;
              
              try {
                // Map khoroo names to their districts using async function
                districtName = await getDistrictForKhorooName(polygonName);
                console.log('✅ KHOROO detected:', khorooName, '-> belongs to district:', districtName);
              } catch (error) {
                console.error('Error getting district for khoroo:', error);
                districtName = 'Тодорхойгүй дүүрэг';
              }
              
              // Validate our result
              if (!districtName || districtName === 'Тодорхойгүй дүүрэг') {
                console.log('⚠️ FALLBACK USED - might be incorrect mapping for:', polygonName);
                
                // Try alternative detection methods
                Object.keys(layer.feature.properties).forEach(key => {
                  const value = layer.feature.properties[key];
                  if (typeof value === 'string') {
                    districts.forEach(district => {
                      if (value.includes(district)) {
                        console.log(`🔍 Found district "${district}" in property "${key}": "${value}"`);
                        districtName = district;
                      }
                    });
                  }
                });
              }
            } else {
              console.log('❌ NO POLYGON NAME FOUND - using fallback');
              // Try to find any district name in any property
              Object.keys(layer.feature.properties).forEach(key => {
                const value = layer.feature.properties[key];
                if (typeof value === 'string') {
                  districts.forEach(district => {
                    if (value.includes(district)) {
                      console.log(`🔍 Found district "${district}" in property "${key}": "${value}"`);
                      districtName = district;
                      isDistrict = true;
                    }
                  });
                }
              });
            }
            
            const color = districtColors[districtName] || '#808080'; // Use district color or default gray
            console.log('Assigned color for', polygonName, ':', color);
            
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
            
            // Create appropriate popup content based on polygon type
            let popupContent = '';
            
            console.log('🎨 Creating popup - isDistrict:', isDistrict, 'districtName:', districtName, 'khorooName:', khorooName);
            
            if (isDistrict) {
              // District popup
              popupContent = `
                <div style="text-align: center;">
                  <h4 style="margin: 5px 0; color: ${color};">${districtName || polygonName || 'Тодорхойгүй'}</h4>
                  <div style="font-size: 14px; font-weight: bold; color: #2563eb; margin: 5px 0;">
                    ДҮҮРЭГ
                  </div>
                  <div style="font-size: 12px; color: #666;">
                    Улаанбаатар хот
                  </div>
                  <div style="font-size: 14px; margin-top: 8px; font-weight: bold;">
                    🏢 <span class="district-count-${districtName}">Газар: 0 ширхэг</span>
                  </div>
                  <div style="font-size: 10px; color: #999; margin-top: 4px;">
                    DEBUG: ${polygonName || 'No name found'}
                  </div>
                </div>
              `;
            } else {
              // Khoroo popup
              const displayKhorooName = khorooName || polygonName || 'Тодорхойгүй хороо';
              const displayDistrictName = districtName || 'Тодорхойгүй дүүрэг';
              
              popupContent = `
                <div style="text-align: center;">
                  <h4 style="margin: 5px 0; color: ${color};">${displayKhorooName}</h4>
                  <div style="font-size: 14px; font-weight: bold; color: #333; margin: 5px 0;">
                    ${displayDistrictName} дүүрэг
                  </div>
                  <div style="font-size: 12px; color: #666; margin: 2px 0;">
                    Улаанбаатар хот
                  </div>
                  <div style="font-size: 14px; margin-top: 8px; font-weight: bold;">
                    🏢 <span class="khoroo-count-${displayKhorooName}">Газар: 0 ширхэг</span>
                  </div>
                  <div style="font-size: 10px; color: #999; margin-top: 4px;">
                    DEBUG: Original name: ${polygonName || 'No name found'}
                  </div>
                </div>
              `;
            }
            
            layer.bindPopup(popupContent);
            console.log('✅ Popup created for layer', layerCount);
          } else {
            console.log('❌ Layer', layerCount, 'has no feature or properties');
          }
          console.log(`🔍 === END LAYER ${layerCount} ANALYSIS ===\n`);
        }
        
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
  () => [props.district, props.khoroo, props.category, props.searchLand, props.organizations, props.payCenter, props.mapType, props.selectedAddress, props.selectedDistrictName, props.selectedKhorooName],
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
    console.log('SelectedKhorooName changed:', newValues[9] !== oldValues?.[9]);
    console.log('Current selectedKhorooName:', newValues[9]);
    
    // Handle district or khoroo filter change for KML layer
    if (newValues[8] !== oldValues?.[8] || newValues[9] !== oldValues?.[9]) {
      console.log('District or Khoroo filter changed, updating KML layer...');
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

// Function to create ebarimt-specific clusters with color-aware grouping
function createEbarimtClusters(markers: any[]): any[] {
  if (!map.value || markers.length === 0) return markers;

  const currentZoom = map.value.getZoom();
  
  // Dynamic clustering thresholds for smoother transitions
  const DISTRICT_ZOOM_THRESHOLD = 11;   // Show district clusters
  const AREA_ZOOM_THRESHOLD = 13;       // Show area clusters
  const INDIVIDUAL_ZOOM_THRESHOLD = 15; // Show individual markers
  
  console.log(`Creating ebarimt clusters at zoom level ${currentZoom}`);

  // At very high zoom, show individual markers with minimal clustering
  if (currentZoom >= INDIVIDUAL_ZOOM_THRESHOLD) {
    console.log('High zoom: Using minimal clustering for individual markers');
    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 30,
      disableClusteringAtZoom: 18,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyDistanceMultiplier: 1.2,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        const markers = cluster.getAllChildMarkers();
        
        // Analyze cluster composition for color
        let redCount = 0, yellowCount = 0, greenCount = 0;
        markers.forEach(marker => {
          if (marker._ebarimtData) {
            switch(marker._ebarimtData.color) {
              case 'red': redCount++; break;
              case 'yellow': yellowCount++; break;
              case 'green': greenCount++; break;
            }
          }
        });
        
        // Determine dominant color
        let dominantColor = 'rgba(220, 53, 69, 0.9)'; // red
        let textColor = 'white';
        if (greenCount > redCount && greenCount > yellowCount) {
          dominantColor = 'rgba(40, 167, 69, 0.9)'; // green
        } else if (yellowCount > redCount && yellowCount >= greenCount) {
          dominantColor = 'rgba(255, 193, 7, 0.9)'; // yellow
          textColor = 'black';
        }
        
        return L.divIcon({
          html: `<div style="background-color: ${dominantColor}; border-radius: 20px; color: ${textColor}; font-weight: bold; text-align: center; line-height: 32px; width: 32px; height: 32px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transition: all 0.3s ease; font-size: 12px;"><span>${count}</span></div>`,
          className: 'ebarimt-cluster-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
      }
    });
    
    markers.forEach(marker => clusterGroup.addLayer(marker));
    return [clusterGroup];
  }

  // At medium zoom, create area-based clusters
  if (currentZoom >= AREA_ZOOM_THRESHOLD) {
    console.log('Medium zoom: Creating area-based clusters');
    return createAreaClusters(markers, currentZoom);
  }

  // At low zoom, create district-based clusters
  if (currentZoom >= DISTRICT_ZOOM_THRESHOLD) {
    console.log('Low zoom: Creating district-based clusters');
    return createDistrictEbarimtClusters(markers);
  }

  // At very low zoom, create city-wide cluster
  console.log('Very low zoom: Creating city-wide cluster');
  return createCityWideEbarimtCluster(markers);
}

// Function to create area-based clusters for medium zoom levels
function createAreaClusters(markers: any[], zoom: number): any[] {
  const clusters: any[] = [];
  const processed = new Set();
  const clusterRadius = Math.max(0.003, 0.015 - (zoom * 0.0008)); // Optimized dynamic radius
  const clusterRadiusMeters = clusterRadius * 111000; // Convert to meters
  
  // Sort markers by latitude for better spatial locality
  const sortedMarkers = [...markers].sort((a, b) => a.getLatLng().lat - b.getLatLng().lat);
  
  sortedMarkers.forEach((marker, index) => {
    if (processed.has(index)) return;
    
    const markerLatLng = marker.getLatLng();
    const nearbyMarkers = [marker];
    processed.add(index);
    
    // Find nearby markers within cluster radius (optimized search)
    for (let i = index + 1; i < sortedMarkers.length; i++) {
      if (processed.has(i)) continue;
      
      const otherMarker = sortedMarkers[i];
      const otherLatLng = otherMarker.getLatLng();
      
      // Quick latitude check first (optimization)
      const latDiff = Math.abs(markerLatLng.lat - otherLatLng.lat);
      if (latDiff > clusterRadius) break; // Markers are sorted by latitude, so no more matches
      
      const distance = markerLatLng.distanceTo(otherLatLng);
      
      if (distance < clusterRadiusMeters) {
        nearbyMarkers.push(otherMarker);
        processed.add(i);
        
        // Limit cluster size for performance
        if (nearbyMarkers.length >= 20) break;
      }
    }
    
    if (nearbyMarkers.length > 1) {
      // Create cluster marker
      const clusterMarker = createEbarimtClusterMarker(nearbyMarkers, 'area');
      clusters.push(clusterMarker);
    } else {
      // Single marker
      clusters.push(marker);
    }
  });
  
  console.log(`Created ${clusters.length} area clusters from ${markers.length} markers`);
  return clusters;
}

// Function to create district-based ebarimt clusters
function createDistrictEbarimtClusters(markers: any[]): any[] {
  if (!isDistrictDataLoaded || Object.keys(districtPolygons).length === 0) {
    return markers;
  }

  const districtGroups: { [key: string]: any[] } = {};
  const ungroupedMarkers: any[] = [];

  // Group markers by district
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

  const clusterMarkers: any[] = [];

  // Create cluster for each district
  Object.entries(districtGroups).forEach(([districtName, districtMarkers]) => {
    if (districtMarkers.length > 1) {
      const clusterMarker = createEbarimtClusterMarker(districtMarkers, 'district', districtName);
      clusterMarkers.push(clusterMarker);
    } else if (districtMarkers.length === 1) {
      clusterMarkers.push(districtMarkers[0]);
    }
  });

  clusterMarkers.push(...ungroupedMarkers);
  return clusterMarkers;
}

// Function to create city-wide ebarimt cluster
function createCityWideEbarimtCluster(markers: any[]): any[] {
  if (markers.length <= 1) return markers;
  
  const clusterMarker = createEbarimtClusterMarker(markers, 'city');
  return [clusterMarker];
}

// Function to create ebarimt cluster marker with statistics
function createEbarimtClusterMarker(markers: any[], type: 'area' | 'district' | 'city', districtName?: string): any {
  const totalCount = markers.length;
  let redCount = 0, yellowCount = 0, greenCount = 0;
  let totalOrgs = 0, totalEbarimtOrgs = 0;
  
  // Calculate statistics with optimized loop
  for (const marker of markers) {
    if (marker._ebarimtData) {
      const data = marker._ebarimtData;
      switch(data.color) {
        case 'red': redCount++; break;
        case 'yellow': yellowCount++; break;
        case 'green': greenCount++; break;
      }
      totalOrgs += data.totalOrgs || 0;
      totalEbarimtOrgs += data.ebarimtOrgs || 0;
    }
  }
  
  // Determine cluster position
  let clusterPosition;
  if (type === 'district' && districtName && districtPolygons[districtName]) {
    clusterPosition = districtPolygons[districtName].center;
  } else if (type === 'city') {
    clusterPosition = { lat: 47.9184, lng: 106.9177 }; // Ulaanbaatar center
  } else {
    // Calculate centroid for area clusters (optimized)
    let latSum = 0, lngSum = 0;
    for (const marker of markers) {
      const latLng = marker.getLatLng();
      latSum += latLng.lat;
      lngSum += latLng.lng;
    }
    clusterPosition = { lat: latSum / markers.length, lng: lngSum / markers.length };
  }
  
  // Determine dominant color and size
  const dominantCounts = [
    { color: 'rgba(220, 53, 69, 0.9)', textColor: 'white', type: 'Улаан', count: redCount },
    { color: 'rgba(255, 193, 7, 0.9)', textColor: 'black', type: 'Шар', count: yellowCount },
    { color: 'rgba(40, 167, 69, 0.9)', textColor: 'white', type: 'Ногоон', count: greenCount }
  ];
  
  const dominant = dominantCounts.reduce((prev, current) => 
    current.count > prev.count ? current : prev
  );
  
  // Size based on count and type
  let iconSize = 40;
  if (type === 'city') iconSize = 60;
  else if (type === 'district') iconSize = 50;
  else if (totalCount > 10) iconSize = 45;
  
  const clusterIcon = L.divIcon({
    html: `<div style="background-color: ${dominant.color}; border-radius: 50%; color: ${dominant.textColor}; font-weight: bold; text-align: center; line-height: ${iconSize}px; width: ${iconSize}px; height: ${iconSize}px; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4); transition: all 0.3s ease; cursor: pointer; font-size: ${iconSize > 45 ? '14px' : '12px'};"><span>${totalCount}</span></div>`,
    className: `ebarimt-cluster-marker ebarimt-cluster-${type}`,
    iconSize: [iconSize + 6, iconSize + 6],
    iconAnchor: [(iconSize + 6) / 2, (iconSize + 6) / 2]
  });

  const clusterMarker = L.marker([clusterPosition.lat, clusterPosition.lng], { 
    icon: clusterIcon 
  });

  // Create detailed popup (optimized string building)
  const avgPercentage = totalOrgs > 0 ? ((totalEbarimtOrgs / totalOrgs) * 100) : 0;
  const typeLabel = type === 'district' ? 'дүүрэг' : type === 'city' ? 'хот' : 'бүс';
  
  const popupContent = `<div style="width: 280px; font-family: 'Segoe UI', sans-serif;">
<div style="font-weight: bold; font-size: 18px; margin: 8px 0 4px 0; color: ${dominant.color};">
${districtName ? `${districtName} ${typeLabel}` : `Е-баримт ${typeLabel}`}
</div>
<div style="font-size: 14px; margin-bottom: 8px;">Нийт цэг: ${totalCount} ширхэг</div>
<div style="border: 1px solid #eee; padding: 8px; border-radius: 6px; margin: 8px 0;">
<div style="font-size: 13px; margin: 2px 0;"><span style="color: #dc3545;">●</span> Улаан: ${redCount} цэг</div>
<div style="font-size: 13px; margin: 2px 0;"><span style="color: #ffc107;">●</span> Шар: ${yellowCount} цэг</div>
<div style="font-size: 13px; margin: 2px 0;"><span style="color: #28a745;">●</span> Ногоон: ${greenCount} цэг</div>
</div>
<div style="font-size: 13px; margin: 4px 0;">Нийт байгууллага: ${totalOrgs}</div>
<div style="font-size: 13px; margin: 4px 0;">Е-баримт гаргадаг: ${totalEbarimtOrgs}</div>
<div style="font-size: 13px; margin: 4px 0; font-weight: bold;">Дундаж е-баримт: ${avgPercentage.toFixed(1)}%</div>
<div style="font-size: 12px; color: #666; margin-top: 8px;">Дэлгэрэнгүй харахын тулд дарна уу</div>
</div>`;

  clusterMarker.bindPopup(popupContent);

  // Click handler for smooth zoom
  clusterMarker.on('click', function() {
    if (map.value) {
      const currentZoom = map.value.getZoom();
      let targetZoom = Math.min(18, currentZoom + 3);
      
      if (type === 'city') targetZoom = 12;
      else if (type === 'district') targetZoom = 15;
      
      map.value.flyTo([clusterPosition.lat, clusterPosition.lng], targetZoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
      
      // Add click animation
      const element = this._icon;
      if (element) {
        element.classList.add('marker-cluster-clicked');
        setTimeout(() => {
          element.classList.remove('marker-cluster-clicked');
        }, 300);
      }
    }
  });

  return clusterMarker;
}

// Function to update markers with ebarimt colors
function updateMarkersWithEbarimtColors(payCenterData: any) {
  if (!map.value || !markersLayer.value) return;
  
  console.log('Updating markers with ebarimt colors...', payCenterData);
  
  // Clear existing markers but keep the layer on the map
  markersLayer.value.clearLayers();
  
  // Clear stored individual markers to prevent interference with zoom events
  if (map.value._individualMarkers) {
    map.value._individualMarkers = [];
  }
  
  // Reset statistics
  ebarimtStats.value = {
    redMarkers: 0,
    yellowMarkers: 0,
    greenMarkers: 0,
    totalMarkers: 0
  };
  
  let markersCreated = 0;
  const individualMarkers: any[] = [];
  
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
      ebarimtStats.value.greenMarkers++;
    } else if (data.color === 'yellow') {
      markerIcon = yellowIcon;
      colorName = 'Шар (50-99% е-баримт)';
      ebarimtStats.value.yellowMarkers++;
    } else {
      markerIcon = redIcon;
      colorName = 'Улаан (<50% е-баримт)';
      ebarimtStats.value.redMarkers++;
    }
    
    // Increment total markers count
    ebarimtStats.value.totalMarkers++;
    
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
    
    // Create marker with ebarimt data
    const leafletMarker = L.marker([lat, lng], { icon: markerIcon });
    leafletMarker.bindPopup(popupHtml);
    
    // Store ebarimt-specific data on the marker for clustering
    leafletMarker._ebarimtData = {
      color: data.color,
      colorName: colorName,
      percentage: data.ebarimt_percentage || 0,
      totalOrgs: data.total_organizations || 0,
      ebarimtOrgs: data.organizations_with_ebarimt || 0
    };
    
    individualMarkers.push(leafletMarker);
    markersCreated++;
    console.log(`Created ebarimt marker: ${data.name} at [${lat}, ${lng}] - ${colorName}`);
  }
  
  // Store individual markers for zoom-based clustering
  if (map.value) {
    map.value._individualMarkers = individualMarkers;
  }
  
  // Apply ebarimt-specific clustering
  const clusteredMarkers = createEbarimtClusters(individualMarkers);
  
  // Add clustered markers to the map with smooth transition
  clusteredMarkers.forEach(marker => {
    markersLayer.value.addLayer(marker);
  });
  
  // Ensure markers layer is added to map
  if (map.value && !map.value.hasLayer(markersLayer.value)) {
    map.value.addLayer(markersLayer.value);
  }
  
  console.log(`✅ Updated markers with ebarimt colors: ${markersCreated} markers created and clustered`);
}

// Expose ebarimt statistics to parent component
defineExpose({
  ebarimtStats
});
</script>
