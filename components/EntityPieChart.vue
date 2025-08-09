<template>
  <div class="chart-container">
    <div class="chart-header">
      <h5 class="chart-title">Үйл ажиллагааны төрлүүд</h5>
      <div class="chart-subtitle">Түрээслэгчдийн үйл ажиллагааны тархалт</div>
    </div>
    <div class="chart-wrapper">
      <canvas ref="chartCanvas" :id="chartId"></canvas>
    </div>
    <div class="chart-legend" v-if="legendData.length > 0">
      <div 
        v-for="(item, index) in legendData" 
        :key="index"
        class="legend-item"
        @click="toggleDataset(index)"
        :class="{ 'legend-item-disabled': !item.visible }"
      >
        <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
        <div class="legend-text">
          <div class="legend-label">{{ item.label }}</div>
          <div class="legend-value">{{ item.value }} ({{ item.percentage }}%)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useCache } from "../composables/useCache";
import { useApi } from "../composables/useApi";
import Chart from 'chart.js/auto';

interface ActivityTypeData {
  op_type_name: string;
  count: number;
}

interface LegendItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
  visible: boolean;
}

const { get, set } = useCache();
const route = useRoute();
const chartCanvas = ref<HTMLCanvasElement>();
const chartId = ref(`entity-chart-${Date.now()}`);
const chartInstance = ref<Chart | null>(null);
const legendData = ref<LegendItem[]>([]);

// Modern color palette with gradients
const colorPalette = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', 
  '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140',
  '#a8edea', '#fed6e3', '#ffecd2', '#fcb69f', '#ff9a9e'
];

// Create gradient colors for better visual appeal
function createGradientColors(ctx: CanvasRenderingContext2D, colors: string[]) {
  return colors.map((color, index) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustBrightness(color, -20));
    return gradient;
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

async function fetchActivityTypes(payCenterId: string) {
  try {
    const cacheKey = `activity_types_${payCenterId}`;
    const cachedData = get(cacheKey);
    
    let organizations: any[] = [];
    
    if (cachedData) {
      organizations = cachedData;
    } else {
      const response = await useApi(`/markets?pay_center_id=${payCenterId}`);
      if (response.success && response.data) {
        const data = response.data as any;
        if (Array.isArray(data)) {
          organizations = data;
        } else if (data.data && Array.isArray(data.data)) {
          organizations = data.data;
        }
        set(cacheKey, organizations);
      }
    }

    // OP_TYPE_NAME-ууд тоолох
    const activityTypes: { [key: string]: number } = {};
    
    organizations.forEach((org: any) => {
      const opType = org.op_type_name || org.OP_TYPE_NAME || 'Тодорхойгүй';
      if (activityTypes[opType]) {
        activityTypes[opType]++;
      } else {
        activityTypes[opType] = 1;
      }
    });

    // Тоогоор эрэмбэлж, хамгийн их 10-ийг авах
    const sortedEntries = Object.entries(activityTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Үлдсэн бүгдийг "Бусад" гэж нэгтгэх
    const remainingEntries = Object.entries(activityTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(10);
    
    let labels: string[] = [];
    let values: number[] = [];

    if (sortedEntries.length === 0) {
      labels = ["Мэдээлэл байхгүй"];
      values = [1];
    } else {
      labels = sortedEntries.map(([name]) => name);
      values = sortedEntries.map(([, count]) => count);

      if (remainingEntries.length > 0) {
        const othersCount = remainingEntries.reduce((sum, [, count]) => sum + count, 0);
        labels.push("Бусад");
        values.push(othersCount);
      }
    }

    // Calculate percentages and create legend data
    const total = values.reduce((sum, val) => sum + val, 0);
    legendData.value = labels.map((label, index) => ({
      label: label || 'Тодорхойгүй',
      value: values[index] || 0,
      percentage: total > 0 ? Math.round(((values[index] || 0) / total) * 100) : 0,
      color: colorPalette[index % colorPalette.length],
      visible: true
    }));

    createChart(labels, values);
  } catch (error) {
    console.error('Error fetching activity types:', error);
    // Fallback data
    const fallbackLabels = ["Үйлчилгээ", "Худалдаа", "Хүнс", "Тээвэр", "Бусад"];
    const fallbackValues = [44, 55, 13, 43, 22];
    const fallbackTotal = fallbackValues.reduce((a, b) => a + b, 0);
    
    legendData.value = fallbackLabels.map((label, index) => ({
      label,
      value: fallbackValues[index],
      percentage: fallbackTotal > 0 ? Math.round((fallbackValues[index] / fallbackTotal) * 100) : 0,
      color: colorPalette[index % colorPalette.length],
      visible: true
    }));

    createChart(fallbackLabels, fallbackValues);
  }
}

function createChart(labels: string[], values: number[]) {
  if (!chartCanvas.value) return;

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Validate data
  if (!Array.isArray(labels) || !Array.isArray(values) || labels.length !== values.length) {
    console.error('Invalid chart data');
    return;
  }

  // Filter out invalid values
  const validData = labels.map((label, index) => ({
    label,
    value: typeof values[index] === 'number' && !isNaN(values[index]) ? values[index] : 0
  })).filter(item => item.value > 0);

  if (validData.length === 0) {
    // Show empty state
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('Өгөгдөл байхгүй', ctx.canvas.width / 2, ctx.canvas.height / 2);
    return;
  }

  const chartLabels = validData.map(item => item.label);
  const chartValues = validData.map(item => item.value);
  const gradients = createGradientColors(ctx, colorPalette);

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartValues,
        backgroundColor: gradients.slice(0, chartLabels.length),
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
      plugins: {
        legend: {
          display: false, // We'll use custom legend
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
          callbacks: {
            title: function(context) {
              return context[0]?.label || '';
            },
            label: function(context) {
              const value = context.parsed;
              const total = context.dataset.data.reduce((a: any, b: any) => {
                const aVal = typeof a === 'number' ? a : 0;
                const bVal = typeof b === 'number' ? b : 0;
                return aVal + bVal;
              }, 0) as number;
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${value} түрээслэгч (${percentage}%)`;
            },
            afterBody: function(context) {
              const total = context[0].dataset.data.reduce((a: any, b: any) => {
                const aVal = typeof a === 'number' ? a : 0;
                const bVal = typeof b === 'number' ? b : 0;
                return aVal + bVal;
              }, 0) as number;
              return `Нийт: ${total} түрээслэгч`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 800,
        easing: 'easeOutQuart'
      },
      interaction: {
        intersect: false,
        mode: 'nearest'
      },
      onHover: (event, elements) => {
        if (chartCanvas.value) {
          chartCanvas.value.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      }
    },
    plugins: [{
      id: 'datalabels',
      afterDatasetsDraw(chart: any) {
        const { ctx, data } = chart;
        const dataset = data.datasets[0];
        const meta = chart.getDatasetMeta(0);
        
        if (!dataset || !dataset.data) return;
        
        meta.data.forEach((element: any, index: number) => {
          if (element.hidden) return;
          
          const { x, y } = element.tooltipPosition();
          const value = dataset.data[index];
          
          if (value === null || value === undefined || typeof value !== 'number') return;
          
          const total = dataset.data.reduce((a: any, b: any) => {
            const aVal = typeof a === 'number' ? a : 0;
            const bVal = typeof b === 'number' ? b : 0;
            return aVal + bVal;
          }, 0) as number;
          
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          
          // Only show label if percentage is greater than 3% to avoid clutter
          if (percentage >= 3) {
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Draw the value
            ctx.fillText(value.toString(), x, y);
            ctx.restore();
          }
        });
      }
    }]
  });
}

function toggleDataset(index: number) {
  if (!chartInstance.value || !legendData.value[index]) return;
  
  const meta = chartInstance.value.getDatasetMeta(0);
  const item = legendData.value[index];
  
  if (meta.data[index]) {
    const isCurrentlyHidden = (meta.data[index] as any).hidden;
    
    if (!isCurrentlyHidden) {
      (meta.data[index] as any).hidden = true;
      item.visible = false;
    } else {
      (meta.data[index] as any).hidden = false;
      item.visible = true;
    }
    
    chartInstance.value.update('none'); // Smooth update without animation
  }
}

onMounted(async () => {
  await nextTick();
  const payCenterId = route.query.id as string;
  if (payCenterId) {
    fetchActivityTypes(payCenterId);
  }
});

watch(() => route.query.id, (newId) => {
  if (newId) {
    fetchActivityTypes(newId as string);
  }
});
</script>

<style scoped>
.chart-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.chart-subtitle {
  font-size: 0.8rem;
  opacity: 0.9;
  font-weight: 300;
}

.chart-wrapper {
  position: relative;
  height: 200px;
  margin: 12px 0;
  z-index: 1;
}

.chart-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin-top: 12px;
  position: relative;
  z-index: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.legend-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.legend-item-disabled {
  opacity: 0.5;
  filter: grayscale(1);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.legend-text {
  flex: 1;
  min-width: 0;
}

.legend-label {
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.legend-value {
  font-size: 0.7rem;
  opacity: 0.8;
  font-weight: 400;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 12px;
    min-height: 300px;
  }
  
  .chart-title {
    font-size: 1rem;
  }
  
  .chart-wrapper {
    height: 180px;
  }
  
  .chart-legend {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .legend-item {
    padding: 6px;
  }
  
  .legend-label {
    font-size: 0.75rem;
  }
  
  .legend-value {
    font-size: 0.65rem;
  }
}
</style>
