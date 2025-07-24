<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Уншиж байна...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    <div v-else-if="chartData.series.length === 0" class="text-center py-4 text-muted">
      <i class="fas fa-chart-pie fs-1 mb-3 text-secondary"></i>
      <p class="fw-bold">Оператор мэдээлэл олдсонгүй</p>
    </div>
    <div v-else class="chart-container">
      <apexchart
        type="bar"
        height="600"
        :options="chartOptions"
        :series="chartData.series"
      />

      <!-- Summary -->
      <div class="mt-3">
        <div class="row g-2">
          <div class="col-6">
            <div class="card bg-light border-0 h-100">
              <div class="card-body text-center p-3">
                <h5 class="text-primary mb-1">{{ totalOperators }}</h5>
                <small class="text-muted">Нийт оператор</small>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="card bg-light border-0 h-100">
              <div class="card-body text-center p-3">
                <h5 class="text-success mb-1">{{ chartData.series[0].data.length }}</h5>
                <small class="text-muted">Төрлийн тоо</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import VueApexCharts from "vue3-apexcharts";

interface Props {
  centerId?: number;
}
const props = withDefaults(defineProps<Props>(), {
  centerId: undefined
});

const route = useRoute();
const loading = ref(false);
const error = ref('');
const operatorData = ref<any[]>([]);

const entityId = computed(() => {
  return props.centerId || (route.query.id ? Number(route.query.id) : null);
});

const chartData = computed(() => {
  if (!operatorData.value.length) {
    return { series: [], categories: [] };
  }

  const sortedData = [...operatorData.value].sort((a, b) => b.count - a.count);

  const data = sortedData.map(item => item.count);
  const categories = sortedData.map(item => {
    let clean = item.oprt_name.replace(/\s*XXX\s*$/i, '');
    return clean.length > 30 ? clean.slice(0, 30) + "…" : clean;
  });

  return {
    series: [{ name: 'Операторууд', data }],
    categories
  };
});

const totalOperators = computed(() =>
  operatorData.value.reduce((sum, item) => sum + item.count, 0)
);

const chartOptions = computed(() => {
  // Theme detection inside function
  const isDark = (typeof window !== 'undefined') && (
    document.documentElement.classList.contains('dark') || 
    document.documentElement.getAttribute('data-bs-theme') === 'dark' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  const currentTheme = isDark ? {
    textColors: '#e2e8f0',
    gridColor: '#374151',
    backgroundColor: 'transparent',
    gradientStart: '#3b82f6',
    gradientEnd: '#8b5cf6',
    tooltipTheme: 'dark'
  } : {
    textColors: '#64748b',
    gridColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gradientStart: '#3b82f6', 
    gradientEnd: '#a855f7',
    tooltipTheme: 'light'
  };
  
  return {
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: "'Segoe UI', sans-serif",
    background: currentTheme.backgroundColor,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
      barHeight: '60%',
    }
  },
  dataLabels: {
    enabled: true,
    offsetX: 10,
    formatter: (val: number) => `${val}`, // тоон утгыг харуулна
    style: {
      fontWeight: 'bold',
      fontSize: '14px',
      colors: ['#fff'],
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      gradientToColors: ['#a855f7'],
      stops: [0, 100]
    }
  },
  xaxis: {
    categories: chartData.value.categories,
    title: {
      text: 'Оператор тоо',
      style: {
        color: '#cbd5e1',
        fontSize: '13px',
      }
    },
    labels: {
      style: {
        colors: '#94a3b8',
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#94a3b8',
        fontSize: '13px'
      }
    }
  },
      tooltip: {
      enabled: true,
      theme: currentTheme.tooltipTheme,
      style: {
        fontSize: '13px'
      },
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const value = series[seriesIndex][dataPointIndex];
        const category = w.globals.labels[dataPointIndex];
        const totalOps = operatorData.value.reduce((sum, item) => sum + item.count, 0);
        const percent = totalOps > 0 ? Math.round((value / totalOps) * 100) : 0;
        
        // Theme colors based on current theme
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark' || 
                       document.documentElement.classList.contains('dark') ||
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const textColor = isDark ? '#f1f5f9' : '#1e293b';
        const bgColor = isDark ? '#1e293b' : '#ffffff';
        const borderColor = isDark ? '#374151' : '#e2e8f0';
        const mutedColor = isDark ? '#94a3b8' : '#64748b';
        
        return `
          <div style="
            background: ${bgColor}; 
            color: ${textColor}; 
            padding: 10px 12px; 
            border-radius: 8px;
            border: 1px solid ${borderColor};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 13px;
            min-width: 160px;
          ">
            <div style="font-weight: 600; margin-bottom: 4px; color: ${textColor};">
              ${category}
            </div>
            <div style="color: ${textColor};">
              <strong style="color: #3b82f6;">${value}</strong> оператор 
              <span style="color: ${mutedColor};">(${percent}%)</span>
            </div>
          </div>
        `;
      }
    },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: { height: 500 },
        plotOptions: {
          bar: {
            barHeight: '50%',
          }
        },
        dataLabels: {
          style: {
            fontSize: '11px'
          }
        }
      }
    }
  ]
  };
});

async function fetchOperatorStats() {
  if (!entityId.value) return;

  loading.value = true;
  error.value = '';
  try {
    const response = await fetch(`http://localhost:8080/api/v1/operators/stats/${entityId.value}`);
    const result = await response.json();
    if (result.success) {
      operatorData.value = Array.isArray(result.data) ? result.data : [];
    } else {
      error.value = result.error || 'Мэдээлэл авахад алдаа гарлаа';
      operatorData.value = [];
    }
  } catch (err) {
    console.error('Error fetching operator stats:', err);
    error.value = 'Сервертэй холбогдоход алдаа гарлаа';
    operatorData.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchOperatorStats();
});

watch(entityId, (newId) => {
  if (newId) fetchOperatorStats();
}, { immediate: false });
</script>

<script lang="ts">
export default {
  components: {
    apexchart: VueApexCharts,
  },
};
</script>

<style scoped>
.chart-container {
  padding: 10px 0;
  overflow-x: auto;
}
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-2px);
}
</style>
