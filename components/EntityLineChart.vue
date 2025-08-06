<template>
  <div class="chart-container">
    <div class="chart-header">
      <h5 class="chart-title">Бүртгэлийн статистик</h5>
      <div class="chart-subtitle">Түрээслэгчдийн бүртгэлийн тархалт</div>
    </div>
    
    <div class="stats-summary" v-if="registrationData">
      <div class="stat-card">
        <div class="stat-number">{{ registrationData.total }}</div>
        <div class="stat-label">Нийт түрээслэгч</div>
      </div>
      <div class="stat-card registered">
        <div class="stat-number">{{ registrationData.registered }}</div>
        <div class="stat-label">Бүртгэгдсэн</div>
        <div class="stat-percentage">{{ registrationData.registered_percentage }}%</div>
      </div>
      <div class="stat-card not-registered">
        <div class="stat-number">{{ registrationData.not_registered }}</div>
        <div class="stat-label">Бүртгэгдээгүй</div>
        <div class="stat-percentage">{{ registrationData.not_registered_percentage }}%</div>
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
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useCache } from "../composables/useCache";
import { useApi } from "../composables/useApi";
import Chart from 'chart.js/auto';

interface RegistrationData {
  registered: number;
  not_registered: number;
  total: number;
  registered_percentage: number;
  not_registered_percentage: number;
}

const route = useRoute();
const { get, set } = useCache();
const chartCanvas = ref<HTMLCanvasElement>();
const chartId = ref(`entity-line-chart-${Date.now()}`);
const chartInstance = ref<Chart | null>(null);
const registrationData = ref<RegistrationData | null>(null);
const loading = ref(false);

// Modern color palette
const colors = {
  registered: '#10b981',
  notRegistered: '#ef4444',
  background: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.2)'
};

async function fetchRegistrationData(buildingId: string) {
  loading.value = true;
  try {
    const cacheKey = `registration_stats_${buildingId}`;
    const cachedData = get(cacheKey);
    
    if (cachedData) {
      registrationData.value = cachedData;
    } else {
      const response = await useApi(`/registration-stats/${buildingId}`);
      if (response.success && response.data) {
        registrationData.value = response.data as RegistrationData;
        set(cacheKey, response.data);
      } else {
        // Fallback data if API fails
        registrationData.value = {
          registered: 0,
          not_registered: 0,
          total: 0, 
          registered_percentage: 0,
          not_registered_percentage: 0
        };
      }
    }
    
    createChart();
  } catch (error) {
    console.error('Error fetching registration data:', error);
    // Fallback data
    registrationData.value = {
      registered: 0,
      not_registered: 0,
      total: 0,
      registered_percentage: 0,
      not_registered_percentage: 0
    };
  } finally {
    loading.value = false;
  }
}

function createChart() {
  if (!chartCanvas.value || !registrationData.value) return;

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Create gradient for background
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Бүртгэгдсэн', 'Бүртгэгдээгүй'],
      datasets: [{
        data: [
          registrationData.value.registered,
          registrationData.value.not_registered
        ],
        backgroundColor: [colors.registered, colors.notRegistered],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverBorderColor: '#ffffff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      radius: '85%',
      plugins: {
        legend: {
          display: false, // We'll use custom legend in stats summary
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${percentage}%)`;
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
        mode: 'index'
      }
    }
  });
}

onMounted(async () => {
  await nextTick();
  const buildingId = route.query.id as string;
  if (buildingId) {
    fetchRegistrationData(buildingId);
  }
});

watch(() => route.query.id, (newId) => {
  if (newId) {
    fetchRegistrationData(newId as string);
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

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.stat-card.registered {
  border-left: 4px solid #10b981;
}

.stat-card.not-registered {
  border-left: 4px solid #ef4444;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-percentage {
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.8;
}

.chart-wrapper {
  position: relative;
  height: 180px;
  margin: 12px 0;
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
    padding: 12px;
    min-height: 300px;
  }
  
  .chart-title {
    font-size: 1rem;
  }
  
  .stats-summary {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .stat-card {
    padding: 8px;
  }
  
  .stat-number {
    font-size: 1.2rem;
  }
  
  .chart-wrapper {
    height: 150px;
  }
}
</style>
