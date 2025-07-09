<template>
  <div class="statistics-cards">
    <div class="row g-3 mb-4">
      <!-- Эхний мөр -->
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-primary-light mb-2">
            <i class="fas fa-building text-primary"></i>
          </div>
          <div class="stats-number text-primary fs-4 fw-bold">
            {{ formatNumber(statistics.total_buildings) }}
          </div>
          <div class="stats-label text-muted small">Объект /барилга/</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-danger-light mb-2">
            <i class="fas fa-exclamation-circle text-danger"></i>
          </div>
          <div class="stats-number text-danger fs-4 fw-bold">18</div>
          <div class="stats-label text-muted small">Зах. хуулиарналт тев</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-success-light mb-2">
            <i class="fas fa-users text-success"></i>
          </div>
          <div class="stats-number text-success fs-4 fw-bold">2,048</div>
          <div class="stats-label text-muted small">Хуулийн этгээд</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-warning-light mb-2">
            <i class="fas fa-user text-warning"></i>
          </div>
          <div class="stats-number text-warning fs-4 fw-bold">1,104</div>
          <div class="stats-label text-muted small">Иргэн</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-info-light mb-2">
            <i class="fas fa-home text-info"></i>
          </div>
          <div class="stats-number text-info fs-4 fw-bold">0</div>
          <div class="stats-label text-muted small">Чөлөөлөгдөх</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-cyan-light mb-2">
            <i class="fas fa-female text-cyan"></i>
          </div>
          <div class="stats-number text-cyan fs-4 fw-bold">706</div>
          <div class="stats-label text-muted small">Эзэмшигч</div>
        </div>
      </div>
    </div>
    
    <!-- Хоёр дахь мөр -->
    <div class="row g-3">
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-danger-light mb-2">
            <i class="fas fa-user-times text-danger"></i>
          </div>
          <div class="stats-number text-danger fs-4 fw-bold">0</div>
          <div class="stats-label text-muted small">Түрээслүүлэгч</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-success-light mb-2">
            <i class="fas fa-layer-group text-success"></i>
          </div>
          <div class="stats-number text-success fs-4 fw-bold">1,220</div>
          <div class="stats-label text-muted small">Давхар түрээслүүлэгч</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-warning-light mb-2">
            <i class="fas fa-user-check text-warning"></i>
          </div>
          <div class="stats-number text-warning fs-4 fw-bold">
            {{ formatNumber(statistics.total_tenants) }}
          </div>
          <div class="stats-label text-muted small">Түрээслэгч</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-info-light mb-2">
            <i class="fas fa-ruler-combined text-info"></i>
          </div>
          <div class="stats-number text-info fs-4 fw-bold">
            {{ formatNumber(statistics.total_area) }}
          </div>
          <div class="stats-label text-muted small">Нийт мкв</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-info-light mb-2">
            <i class="fas fa-money-bill text-info"></i>
          </div>
          <div class="stats-number text-info fs-4 fw-bold">897</div>
          <div class="stats-label text-muted small">НӨАТ суутган төлөгч</div>
        </div>
      </div>
      
      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-danger-light mb-2">
            <i class="fas fa-receipt text-danger"></i>
          </div>
          <div class="stats-number text-danger fs-4 fw-bold">
            {{ formatNumber(statistics.total_receipt_count) }}
          </div>
          <div class="stats-label text-muted small">Баримт хэвлэдэг</div>
        </div>
      </div>

      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-info-light mb-2">
            <i class="fas fa-coins text-info"></i>
          </div>
          <div class="stats-number text-info fs-4 fw-bold">8970</div>
          <div class="stats-label text-muted small">НХАТ төлөгч</div>
        </div>
      </div>

      <div class="col-lg-2 col-md-4 col-7">
        <div class="card stats-card text-center p-3">
          <div class="stats-icon bg-info-light mb-2">
            <i class="fas fa-cash-register text-info"></i>
          </div>
          <div class="stats-number text-info fs-4 fw-bold">3200</div>
          <div class="stats-label text-muted small">ХХ хураамж төлөгч</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '../composables/useApi';

interface StatisticsData {
  total_buildings: number;
  total_area: number;
  total_tenants: number;
  total_receipt_count: number;
}

const statistics = ref<StatisticsData>({
  total_buildings: 0,
  total_area: 0,
  total_tenants: 0,
  total_receipt_count: 0
});

const loading = ref(false);
const error = ref('');

function formatNumber(num: number): string {
  if (num === 0) return '0';
  return num.toLocaleString('en-US');
}

async function fetchStatistics() {
  loading.value = true;
  error.value = '';
  
  try {
    const res = await useApi('/statistics');
    if (res.success && res.data) {
      statistics.value = res.data as StatisticsData;
    } else {
      error.value = 'Статистик мэдээлэл авахад алдаа гарлаа';
    }
  } catch (e: any) {
    error.value = e.message || 'Алдаа гарлаа';
    console.error('Statistics fetch error:', e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchStatistics();
});
</script>

<style scoped>
.statistics-cards {
  margin-bottom: 1rem;
}

.stats-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.stats-icon i {
  font-size: 18px;
}

.stats-number {
  margin-bottom: 0.25rem;
  font-weight: 700;
}

.stats-label {
  font-size: 0.75rem;
  line-height: 1.2;
}

/* Background colors */
.bg-primary-light {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
}

.bg-danger-light {
  background-color: rgba(var(--bs-danger-rgb), 0.1);
}

.bg-success-light {
  background-color: rgba(var(--bs-success-rgb), 0.1);
}

.bg-warning-light {
  background-color: rgba(var(--bs-warning-rgb), 0.1);
}

.bg-info-light {
  background-color: rgba(var(--bs-info-rgb), 0.1);
}

.bg-cyan-light {
  background-color: rgba(23, 162, 184, 0.1);
}

.text-cyan {
  color: #17a2b8 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stats-number {
    font-size: 1.25rem !important;
  }
  
  .stats-icon {
    width: 32px;
    height: 32px;
  }
  
  .stats-icon i {
    font-size: 14px;
  }
}
</style> 