<template>
  <div class="chart-container">
    <div class="chart-header">
      <h5 class="chart-title">Дүүргийн тархалт</h5>
      <div class="chart-subtitle">Түрээслэгчдийн дүүргийн хуваарилалт</div>
    </div>

    <div class="chart-wrapper">
      <canvas ref="chartCanvas" :id="chartId"></canvas>
    </div>

    <div class="loading-overlay" v-if="loading">
      <div class="spinner"></div>
      <div>Өгөгдөл уншиж байна...</div>
    </div>

    <!-- Хороонуудын мэдээлэл харуулах Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDistrictData?.name }} - Хороонуудын мэдээлэл</h3>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedDistrictData?.khoroos && selectedDistrictData.khoroos.length > 0" class="khoroo-list">
            <div class="total-info">
              <strong>Нийт түрээслэгч: {{ selectedDistrictData.count }}</strong>
            </div>
            <div class="khoroo-grid">
              <div 
                v-for="(khoroo, index) in selectedDistrictData.khoroos" 
                :key="index"
                class="khoroo-item"
              >
                <div class="khoroo-name">{{ khoroo.name }}</div>
                <div class="khoroo-count">{{ khoroo.count }} түрээслэгч</div>
                <div class="khoroo-percentage">
                  {{ Math.round((khoroo.count / selectedDistrictData.count) * 100) }}%
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            Хороонуудын мэдээлэл байхгүй
          </div>
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

interface KhorooData {
  name: string;
  count: number;
}

interface DistrictData {
  name: string;
  count: number;
  khoroos: KhorooData[];
}

interface ApiResponse {
  districts: DistrictData[];
}

const route = useRoute();
const { get, set } = useCache();
const chartCanvas = ref<HTMLCanvasElement>();
const chartId = ref(`entity-bar-chart-${Date.now()}`);
const chartInstance = ref<Chart | null>(null);
const loading = ref(false);

// Modal-ийн төлөв
const showModal = ref(false);
const selectedDistrictData = ref<DistrictData | null>(null);

// Store the full API response
const apiData = ref<ApiResponse | null>(null);

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

function closeModal() {
  showModal.value = false;
  selectedDistrictData.value = null;
}

function showDistrictDetails(district: DistrictData) {
  selectedDistrictData.value = district;
  showModal.value = true;
}

async function fetchTaxOfficeData(buildingId: string) {
  loading.value = true;
  try {
    const cacheKey = `tax_office_stats_${buildingId}`;
    const cachedData = get(cacheKey);
    
    if (cachedData) {
      apiData.value = cachedData;
      console.log('Cache-аас өгөгдөл ашиглаж байна:', apiData.value);
    } else {
      // Add timeout and disable cache for large data
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const response = await useApi(`/tax-office-stats/${buildingId}`, {}, false);
        clearTimeout(timeoutId);
        
        if (response.success && response.data) {
          apiData.value = response.data as ApiResponse;
          set(cacheKey, response.data);
          console.log('Шинэ өгөгдөл татаж авлаа:', apiData.value);
        } else {
          console.error('API алдаа:', response);
          apiData.value = { districts: [] };
        }
      } catch (apiError) {
        clearTimeout(timeoutId);
        if (apiError instanceof Error && apiError.name === 'AbortError') {
          console.error('API хүсэлт хугацаа хэтэрсэн');
          apiData.value = { districts: [] };
        } else {
          throw apiError;
        }
      }
    }
    
    createChart();
  } catch (error) {
    console.error('Өгөгдөл татахад алдаа гарлаа:', error);
    apiData.value = { districts: [] };
    createChart();
  } finally {
    loading.value = false;
  }
}

function createChart() {
  if (!chartCanvas.value || !apiData.value) {
    return;
  }

  // Өмнөх chart-ийг устгах
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) {
    return;
  }

  const data = apiData.value.districts || [];
  
  if (!data || data.length === 0) {
    // Хоосон төлөв харуулах
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('Өгөгдөл байхгүй', ctx.canvas.width / 2, ctx.canvas.height / 2);
    return;
  }

  // Validate and process data
  const validData = data.filter(item => 
    item && 
    typeof item === 'object' && 
    item.name && 
    typeof item.name === 'string' && 
    typeof item.count === 'number' && 
    item.count > 0
  );

  if (validData.length === 0) {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('Хүчинтэй өгөгдөл байхгүй', ctx.canvas.width / 2, ctx.canvas.height / 2);
    return;
  }

  // Тоогоор эрэмбэлэх
  const sortedData = [...validData].sort((a, b) => b.count - a.count);

  // Chart-ийн өндрийг тооцох
  const minHeight = 250;
  const heightPerItem = 35;
  const maxItems = 15;
  const itemsToShow = Math.min(sortedData.length, maxItems);
  const dynamicHeight = Math.max(minHeight, itemsToShow * heightPerItem);
  
  // Chart wrapper-ийн өндрийг шинэчлэх
  if (chartCanvas.value?.parentElement) {
    chartCanvas.value.parentElement.style.height = `${dynamicHeight}px`;
  }
  
  // Дээд талын өгөгдлүүдийг авах
  const displayData = sortedData.slice(0, maxItems);
  const labels = displayData.map(item => item.name);
  const values = displayData.map(item => item.count);

  // Gradient үүсгэх
  const gradient = ctx.createLinearGradient(0, 0, 400, 0);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.secondary);

  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Дүүрэг',
        data: values,
        backgroundColor: gradient,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 25,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
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
              return `Дүүрэг: ${label}`;
            },
            label: function(context) {
              const value = context.parsed.x;
              const total = context.dataset.data.reduce((a: any, b: any) => (a || 0) + (b || 0), 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              
              let tooltipText = `${value} түрээслэгч (${percentage}%)`;
              
              // Хороонуудын мэдээлэл харуулах
              const itemName = context[0].label;
              const districtData = displayData.find(item => item.name === itemName) as DistrictData;
              
              if (districtData && districtData.khoroos && districtData.khoroos.length > 0) {
                tooltipText += '\n\nХороонууд:';
                districtData.khoroos.slice(0, 3).forEach((khoroo: KhorooData) => {
                  tooltipText += `\n• ${khoroo.name}: ${khoroo.count} түрээслэгч`;
                });
                if (districtData.khoroos.length > 3) {
                  tooltipText += `\n• ... болон ${districtData.khoroos.length - 3} хороо`;
                }
                tooltipText += '\n\nДэлгэрэнгүй харахын тулд дарна уу';
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
              return label.length > 25 ? label.substring(0, 25) + '...' : label;
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
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const clickedItem = displayData[index] as DistrictData;
          
          if (clickedItem && clickedItem.khoroos && clickedItem.khoroos.length > 0) {
            showDistrictDetails(clickedItem);
          }
        }
      }
    },
    plugins: [{
      id: 'datalabels',
      afterDatasetsDraw(chart: any) {
        const { ctx, data } = chart;
        const dataset = data.datasets[0];
        const meta = chart.getDatasetMeta(0);
        
        meta.data.forEach((element: any, index: number) => {
          if (element.hidden) return;
          
          const value = dataset.data[index];
          const { x, y } = element;
          
          // Bar-ийн дотор тоог харуулах
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          
          // Тоог харуулах
          ctx.fillText(value.toString(), x - 20, y);
          ctx.restore();
        });
      }
    }]
  });
}

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
  margin-bottom: 10px;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  margin: 16px 0;
  z-index: 1;
  overflow-y: auto;
  overflow-x: hidden;
  cursor: pointer;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 0;
  max-width: 600px;
  max-height: 80vh;
  width: 90%;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.total-info {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.1rem;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.khoroo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.khoroo-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.khoroo-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.khoroo-name {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 8px;
  color: #ffecd2;
}

.khoroo-count {
  font-size: 0.9rem;
  margin-bottom: 4px;
  opacity: 0.9;
}

.khoroo-percentage {
  font-size: 0.85rem;
  opacity: 0.8;
  font-weight: 500;
  color: #a8edea;
}

.no-data {
  text-align: center;
  padding: 40px;
  opacity: 0.7;
  font-style: italic;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 16px;
  }
  
  .chart-title {
    font-size: 1.2rem;
  }
  
  .chart-wrapper {
    height: 300px;
  }
  
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-header h3 {
    font-size: 1.2rem;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .khoroo-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .khoroo-item {
    padding: 12px;
  }
}
</style>
