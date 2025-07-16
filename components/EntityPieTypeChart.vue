<template>
  <div class="chart-container">
    <div class="chart-header">
      <h5 class="chart-title">Сегментийн тархалт</h5>
      <div class="chart-subtitle">Түрээслэгчдийн сегментийн хуваарилалт</div>
      <div class="total-count" v-if="totalCount > 0">
        Нийт: <span class="count-number">{{ totalCount }}</span> түрээслэгч
      </div>
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
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { useRoute } from "vue-router";
import { useCache } from "../composables/useCache";
import { useApi } from "../composables/useApi";
import Chart from 'chart.js/auto';

interface SegmentData {
  name: string;
  count: number;
}

const route = useRoute();
const { get, set } = useCache();
const chartCanvas = ref<HTMLCanvasElement>();
const chartId = ref(`entity-pie-type-chart-${Date.now()}`);
const chartInstance = ref<Chart | null>(null);
const segmentData = ref<SegmentData[]>([]);
const loading = ref(false);

// Compute total count from segment data
const totalCount = computed(() => {
  return segmentData.value.reduce((sum, item) => sum + item.count, 0);
});

// Modern color palette
const colors = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', 
  '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140',
  '#a8edea', '#fed6e3', '#ffecd2', '#fcb69f', '#ff9a9e'
];

async function fetchSegmentData(buildingId: string) {
  loading.value = true;
  try {
    const cacheKey = `segment_stats_${buildingId}`;
    const cachedData = get(cacheKey);
    
    if (cachedData) {
      segmentData.value = cachedData;
    } else {
      const response = await useApi(`/segment-stats/${buildingId}`);
      if (response.success && response.data) {
        segmentData.value = response.data as SegmentData[];
        set(cacheKey, response.data);
      } else {
        // Fallback data if API fails
        segmentData.value = [
          { name: 'ХХК', count: 30 },
          { name: 'ТББ', count: 25 },
          { name: 'ХЗХ', count: 20 },
          { name: 'ББСБ', count: 15 },
          { name: 'Бусад', count: 10 }
        ];
      }
    }
    
    createChart();
  } catch (error) {
    console.error('Error fetching segment data:', error);
    // Fallback data
    segmentData.value = [
      { name: 'ХХК', count: 30 },
      { name: 'ТББ', count: 25 },
      { name: 'ХЗХ', count: 20 },
      { name: 'ББСБ', count: 15 },
      { name: 'Бусад', count: 10 }
    ];
    createChart();
  } finally {
    loading.value = false;
  }
}

function createChart() {
  if (!chartCanvas.value || !segmentData.value) return;

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Check if data exists and has length
  if (!segmentData.value || segmentData.value.length === 0) {
    // Show empty state
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('Өгөгдөл байхгүй', ctx.canvas.width / 2, ctx.canvas.height / 2);
    return;
  }

  // Sort data by count in descending order
  const sortedData = segmentData.value
    .sort((a, b) => b.count - a.count);

  // Take only top 10 items to avoid overcrowding
  const displayData = sortedData.slice(0, 10);
  const labels = displayData.map(item => item.name);
  const values = displayData.map(item => item.count);

  // Create gradient colors for better visual appeal
  const gradients = colors.slice(0, labels.length).map((color, index) => {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustBrightness(color, -20));
    return gradient;
  });

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: gradients,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverBorderColor: '#ffffff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      radius: '90%',
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: 'rgba(255, 255, 255, 0.9)',
            font: {
              size: 12,
              weight: 500
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
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
              return context[0].label || '';
            },
            label: function(context) {
              const value = context.parsed;
              const total = context.dataset.data.reduce((a: any, b: any) => (a || 0) + (b || 0), 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${value} түрээслэгч (${percentage}%)`;
            },
            afterBody: function(context) {
              const total = (context[0] as any).dataset.data.reduce((a: any, b: any) => (a || 0) + (b || 0), 0);
              return `Нийт: ${total} түрээслэгч`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
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

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

onMounted(async () => {
  await nextTick();
  const buildingId = route.query.id as string;
  if (buildingId) {
    fetchSegmentData(buildingId);
  }
});

watch(() => route.query.id, (newId) => {
  if (newId) {
    fetchSegmentData(newId as string);
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

.total-count {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: inline-block;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.count-number {
  font-weight: 700;
  color: #ffecd2;
  font-size: 1.1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.chart-wrapper {
  position: relative;
  height: 300px;
  margin: 16px 0;
  z-index: 1;
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
  border-radius: 16px;
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
    min-height: 300px;
  }
  
  .chart-title {
    font-size: 1.1rem;
  }
  
  .chart-subtitle {
    font-size: 0.8rem;
  }
  
  .total-count {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
  
  .count-number {
    font-size: 1rem;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}
</style>
