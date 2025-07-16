<template>
  <div class="chart-container">
    <div class="chart-header">
      <h5 class="chart-title">Татварын алба болон дүүргийн тархалт</h5>
      <div class="chart-subtitle">Түрээслэгчдийн бүртгэлийн байршлын мэдээлэл</div>
    </div>
    
    <div class="chart-tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'tax_offices' }"
        @click="switchTab('tax_offices')"
      >
        <div class="tab-content">
          <div class="tab-title">Татварын алба</div>
          <div class="tab-subtitle">Дүүргүүд харьяалагдах алба</div>
        </div>
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'districts' }"
        @click="switchTab('districts')"
      >
        <div class="tab-content">
          <div class="tab-title">Дүүрэг</div>
          <div class="tab-subtitle">Хороонууд харьяалагдах дүүрэг</div>
        </div>
      </button>
    </div>

    <div class="chart-wrapper">
      <canvas ref="chartCanvas" :id="chartId"></canvas>
    </div>

    <div class="loading-overlay" v-if="loading">
      <div class="spinner"></div>
      <div>Өгөгдөл уншиж байна...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useCache } from "../composables/useCache";
import { useApi } from "../composables/useApi";
import Chart from 'chart.js/auto';

interface TaxOfficeData {
  name: string;
  count: number;
  districts?: DistrictData[];
}

interface DistrictData {
  name: string;
  count: number;
  khoroos?: KhorooData[];
}

interface KhorooData {
  name: string;
  count: number;
}

interface ChartData {
  tax_offices: TaxOfficeData[];
  districts: DistrictData[];
}

const route = useRoute();
const { get, set } = useCache();
const chartCanvas = ref<HTMLCanvasElement>();
const chartId = ref(`entity-bar-chart-${Date.now()}`);
const chartInstance = ref<Chart | null>(null);
const chartData = ref<ChartData | null>(null);
const loading = ref(false);
const activeTab = ref<'tax_offices' | 'districts'>('tax_offices');
const selectedItem = ref<string | null>(null);

function switchTab(tab: 'tax_offices' | 'districts') {
  console.log('Switching to tab:', tab);
  activeTab.value = tab;
  
  // Add a small delay to ensure the tab change is processed
  setTimeout(() => {
    createChart();
  }, 100);
}

// Modern color palette
const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  background: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.2)'
};

async function fetchTaxOfficeData(buildingId: string) {
  loading.value = true;
  try {
    const cacheKey = `tax_office_stats_${buildingId}`;
    const cachedData = get(cacheKey);
    
    if (cachedData) {
      chartData.value = cachedData;
    } else {
      const response = await useApi(`/tax-office-stats/${buildingId}`);
      if (response.success && response.data) {
        chartData.value = response.data as ChartData;
        set(cacheKey, response.data);
      } else {
        // Fallback data if API fails
        chartData.value = {
          tax_offices: [
            {
              name: 'Төв татварын алба',
              count: 150,
              districts: [
                { name: 'Баянзүрх дүүрэг', count: 45, khoroos: [
                  { name: '1-р хороо', count: 15 },
                  { name: '2-р хороо', count: 18 },
                  { name: '3-р хороо', count: 12 }
                ]},
                { name: 'Сүхбаатар дүүрэг', count: 38, khoroos: [
                  { name: '1-р хороо', count: 12 },
                  { name: '2-р хороо', count: 14 },
                  { name: '3-р хороо', count: 12 }
                ]},
                { name: 'Хан-Уул дүүрэг', count: 32, khoroos: [
                  { name: '1-р хороо', count: 10 },
                  { name: '2-р хороо', count: 11 },
                  { name: '3-р хороо', count: 11 }
                ]}
              ]
            },
            {
              name: 'Баянхошуу татварын алба',
              count: 120,
              districts: [
                { name: 'Баянхошуу дүүрэг', count: 35, khoroos: [
                  { name: '1-р хороо', count: 12 },
                  { name: '2-р хороо', count: 13 },
                  { name: '3-р хороо', count: 10 }
                ]},
                { name: 'Налайх дүүрэг', count: 28, khoroos: [
                  { name: '1-р хороо', count: 9 },
                  { name: '2-р хороо', count: 10 },
                  { name: '3-р хороо', count: 9 }
                ]}
              ]
            }
          ],
          districts: [
            {
              name: 'Баянзүрх дүүрэг',
              count: 45,
              khoroos: [
                { name: '1-р хороо', count: 15 },
                { name: '2-р хороо', count: 18 },
                { name: '3-р хороо', count: 12 }
              ]
            },
            {
              name: 'Сүхбаатар дүүрэг',
              count: 38,
              khoroos: [
                { name: '1-р хороо', count: 12 },
                { name: '2-р хороо', count: 14 },
                { name: '3-р хороо', count: 12 }
              ]
            },
            {
              name: 'Хан-Уул дүүрэг',
              count: 32,
              khoroos: [
                { name: '1-р хороо', count: 10 },
                { name: '2-р хороо', count: 11 },
                { name: '3-р хороо', count: 11 }
              ]
            },
            {
              name: 'Баянхошуу дүүрэг',
              count: 35,
              khoroos: [
                { name: '1-р хороо', count: 12 },
                { name: '2-р хороо', count: 13 },
                { name: '3-р хороо', count: 10 }
              ]
            },
            {
              name: 'Налайх дүүрэг',
              count: 28,
              khoroos: [
                { name: '1-р хороо', count: 9 },
                { name: '2-р хороо', count: 10 },
                { name: '3-р хороо', count: 9 }
              ]
            }
          ]
        };
      }
    }
    
    createChart();
  } catch (error) {
    console.error('Error fetching tax office data:', error);
    // Use the same fallback data as above
    chartData.value = {
      tax_offices: [
        {
          name: 'Төв татварын алба',
          count: 150,
          districts: [
            { name: 'Баянзүрх дүүрэг', count: 45, khoroos: [
              { name: '1-р хороо', count: 15 },
              { name: '2-р хороо', count: 18 },
              { name: '3-р хороо', count: 12 }
            ]},
            { name: 'Сүхбаатар дүүрэг', count: 38, khoroos: [
              { name: '1-р хороо', count: 12 },
              { name: '2-р хороо', count: 14 },
              { name: '3-р хороо', count: 12 }
            ]}
          ]
        }
      ],
      districts: [
        {
          name: 'Баянзүрх дүүрэг',
          count: 45,
          khoroos: [
            { name: '1-р хороо', count: 15 },
            { name: '2-р хороо', count: 18 },
            { name: '3-р хороо', count: 12 }
          ]
        },
        {
          name: 'Сүхбаатар дүүрэг',
          count: 38,
          khoroos: [
            { name: '1-р хороо', count: 12 },
            { name: '2-р хороо', count: 14 },
            { name: '3-р хороо', count: 12 }
          ]
        }
      ]
    };
  } finally {
    loading.value = false;
  }
}

function createChart() {
  console.log('Creating chart for tab:', activeTab.value);
  
  if (!chartCanvas.value || !chartData.value) {
    console.log('Missing chart canvas or data');
    return;
  }

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) {
    console.log('Could not get canvas context');
    return;
  }

  // Get data based on active tab
  const data = activeTab.value === 'tax_offices' ? (chartData.value?.tax_offices || []) : (chartData.value?.districts || []);
  console.log('Data for current tab:', data);
  
  // Check if data exists and has length
  if (!data || data.length === 0) {
    console.log('No data available for current tab');
    // Show empty state
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('Өгөгдөл байхгүй', ctx.canvas.width / 2, ctx.canvas.height / 2);
    return;
  }

  // Sort data by count in descending order
  const sortedData = data
    .sort((a, b) => b.count - a.count);

  // Calculate dynamic height based on number of items for horizontal bars
  const minHeight = 250;
  const heightPerItem = 25; // Slightly larger for better visibility
  const maxItems = 15; // Show max 15 items
  const itemsToShow = Math.min(sortedData.length, maxItems);
  const dynamicHeight = Math.max(minHeight, itemsToShow * heightPerItem);
  
  // Update chart wrapper height
  if (chartCanvas.value?.parentElement) {
    chartCanvas.value.parentElement.style.height = `${dynamicHeight}px`;
  }
  
  // Take only top items to avoid overcrowding
  const displayData = sortedData.slice(0, maxItems);
  const labels = displayData.map(item => item.name);
  const values = displayData.map(item => item.count);

  // Create gradient for horizontal bars
  const gradient = ctx.createLinearGradient(0, 0, 400, 0);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.secondary);

  // Store current tab for tooltip access
  const currentTab = activeTab.value;

  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: activeTab.value === 'tax_offices' ? 'Татварын алба' : 'Дүүрэг',
        data: values,
        backgroundColor: gradient,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 20,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', // Make it horizontal bar chart
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 10,
          right: 10
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
          callbacks: {
            title: function(context) {
              const label = context[0].label || '';
              return currentTab === 'tax_offices' ? `Татварын алба: ${label}` : `Дүүрэг: ${label}`;
            },
            label: function(context) {
              const value = context.parsed.x;
              const total = context.dataset.data.reduce((a: any, b: any) => (a || 0) + (b || 0), 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              
              // Get detailed information for tooltip
              const itemName = context[0].label;
              const currentData = currentTab === 'tax_offices' ? (chartData.value?.tax_offices || []) : (chartData.value?.districts || []);
              const itemData = currentData.find(item => item.name === itemName);
              
              let tooltipText = `${value} түрээслэгч (${percentage}%)`;
              
              if (currentTab === 'tax_offices' && itemData && 'districts' in itemData && itemData.districts) {
                tooltipText += '\n\nДүүргүүд:';
                itemData.districts.forEach(district => {
                  tooltipText += `\n• ${district.name}: ${district.count} түрээслэгч`;
                });
              } else if (currentTab === 'districts' && itemData && 'khoroos' in itemData && itemData.khoroos) {
                tooltipText += '\n\nХороонууд:';
                itemData.khoroos.forEach(khoroo => {
                  tooltipText += `\n• ${khoroo.name}: ${khoroo.count} түрээслэгч`;
                });
              }
              
              return tooltipText;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: 'rgba(255, 255, 255, 0.9)',
            font: {
              size: 12,
              weight: 500
            },
            padding: 8
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.15)',
            lineWidth: 1
          }
        },
        y: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.9)',
            font: {
              size: 11,
              weight: 500
            },
            padding: 8,
            callback: function(value, index, values) {
              const label = this.getLabelForValue(Number(value));
              // Truncate long labels for horizontal bars
              return label.length > 20 ? label.substring(0, 20) + '...' : label;
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            lineWidth: 1
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      interaction: {
        intersect: false,
        mode: 'nearest'
      }
    }
  });
}

// Watch for tab changes - removed to prevent double chart creation
// Chart creation is now handled in switchTab function

onMounted(async () => {
  await nextTick();
  const buildingId = route.query.id as string;
  if (buildingId) {
    fetchTaxOfficeData(buildingId);
  }
});

watch(() => route.query.id, (newId) => {
  if (newId) {
    fetchTaxOfficeData(newId as string);
  }
});
</script>

<style scoped>
.chart-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 350px;
}

.chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.chart-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.chart-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.chart-subtitle {
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 300;
}

.chart-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.tab-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px 20px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.tab-button.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.tab-content {
  text-align: center;
}

.tab-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.tab-subtitle {
  font-size: 0.7rem;
  opacity: 0.8;
  font-weight: 300;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  margin: 16px 0;
  z-index: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .chart-container {
    padding: 16px;
  }
  
  .chart-title {
    font-size: 1.2rem;
  }
  
  .chart-tabs {
    flex-direction: column;
    gap: 8px;
  }
  
  .tab-button {
    padding: 10px 16px;
  }
  
  .tab-title {
    font-size: 0.8rem;
  }
  
  .tab-subtitle {
    font-size: 0.65rem;
  }
  
  .chart-wrapper {
    height: 300px;
  }
}
</style>
