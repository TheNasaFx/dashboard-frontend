<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="close">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Байгууллагын дэлгэрэнгүй мэдээлэл</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div v-else-if="error" class="alert alert-danger">
            {{ error }}
          </div>
          
          <div v-else-if="data" class="row">
            <!-- Бүртгэл хэсэг -->
            <div class="col-md-6 mb-4">
              <div class="card">
                <div class="card-header bg-primary text-white">
                  <h6 class="mb-0">Бүртгэл</h6>
                </div>
                <div class="card-body">
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Регистер:</strong></td>
                        <td>{{ data.branch?.register || '-' }}</td>
                      </tr>
                      <tr>
                        <td><strong>Овог нэр:</strong></td>
                        <td>{{ data.branch?.ovog_ner || '-' }}</td>
                      </tr>
                      <tr>
                        <td><strong>Татварын алба:</strong></td>
                        <td>{{ data.branch?.tta || '-' }}</td>
                      </tr>
                      <tr>
                        <td><strong>Дэд алба:</strong></td>
                        <td>{{ data.branch?.ded_alba || '-' }}</td>
                      </tr>
                      <tr>
                        <td><strong>Бүртгэгдсэн эсэх:</strong></td>
                        <td>{{ data.branch?.tuluv || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Сегмент болон е-баримт хэсэг -->
            <div class="col-md-6 mb-4">
              <div class="card mb-3">
                <div class="card-header bg-info text-white">
                  <h6 class="mb-0">Сегмент</h6>
                </div>
                <div class="card-body">
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Сегмент:</strong></td>
                        <td>{{ data.segment?.segment || '-' }}</td>
                      </tr>
                      <tr>
                        <td><strong>Сегмент жил:</strong></td>
                        <td>{{ data.segment?.segment_year || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="card">
                <div class="card-header bg-success text-white">
                  <h6 class="mb-0">Е-баримт</h6>
                </div>
                <div class="card-body">
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Сүүлийн 3 хоногт:</strong></td>
                        <td>{{ data.ebarimt?.cnt_3 || 0 }}</td>
                      </tr>
                      <tr>
                        <td><strong>Сүүлийн 30 хоногт:</strong></td>
                        <td>{{ data.ebarimt?.cnt_30 || 0 }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Тайлан хэсэг -->
            <div class="col-12 mb-4">
              <div class="card">
                <div class="card-header bg-warning">
                  <h6 class="mb-0">Тайлан</h6>
                </div>
                <div class="card-body">
                  <div v-if="data.reports && data.reports.length > 0" class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th>Тайлангийн код</th>
                          <th>Давтамж</th>
                          <th>Татварын жил</th>
                          <th>Татварын хугацаа</th>
                          <th>Илгээсэн огноо</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(report, idx) in data.reports" :key="idx">
                          <td>{{ report.tax_report_code || '-' }}</td>
                          <td>{{ report.frequency || '-' }}</td>
                          <td>{{ report.tax_year || '-' }}</td>
                          <td>{{ report.tax_period || '-' }}</td>
                          <td>{{ report.submitted_date || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else class="text-muted">Тайлангийн мэдээлэл олдсонгүй</div>
                </div>
              </div>
            </div>
            
            <!-- Төлөлт хэсэг -->
            <div class="col-md-6 mb-4">
              <div class="card">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Төлөлт</h6>
                  <span class="badge bg-light text-dark">
                    Нийт: {{ formatNumber(totalPayment) }}₮
                  </span>
                </div>
                <div class="card-body">
                  <div v-if="data.payments && data.payments.length > 0" class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th>Татварын төрөл</th>
                          <th>Нэхэмжлэх №</th>
                          <th>Алба</th>
                          <th>Огноо</th>
                          <th>Дүн</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(payment, idx) in data.payments" :key="idx">
                          <td>{{ payment.tax_type_name || '-' }}</td>
                          <td>{{ payment.invoice_no || '-' }}</td>
                          <td>{{ payment.branch_name || '-' }}</td>
                          <td>{{ formatDate(payment.paid_date) || '-' }}</td>
                          <td>{{ formatNumber(payment.amount) }}₮</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else class="text-muted">Төлөлтийн мэдээлэл олдсонгүй</div>
                </div>
              </div>
            </div>
            
            <!-- Өрийн үлдэгдэл хэсэг -->
            <div class="col-md-6 mb-4">
              <div class="card">
                <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Өрийн үлдэгдэл</h6>
                  <span class="badge bg-light text-dark">
                    Нийт: {{ formatNumber(totalDebt) }}₮
                  </span>
                </div>
                <div class="card-body">
                  <div v-if="data.debts && data.debts.length > 0" class="table-responsive">
                    <table class="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th>Татварын төрөл</th>
                          <th>Жил</th>
                          <th>Хугацаа</th>
                          <th>Алба</th>
                          <th>Дүн</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(debt, idx) in data.debts" :key="idx">
                          <td>{{ debt.tax_type_name || '-' }}</td>
                          <td>{{ debt.year || '-' }}</td>
                          <td>{{ debt.period_type || '-' }}</td>
                          <td>{{ debt.branch_name || '-' }}</td>
                          <td>{{ formatNumber(debt.c2_debit) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else class="text-muted">Өрийн мэдээлэл олдсонгүй</div>
                </div>
              </div>
            </div>
            
            <!-- үлдэгдэл өр -->
            <div class="col-12 mb-4">
              <div class="card">
                <div class="card-header bg-warning text-dark">
                  <h6 class="mb-0">Үлдэгдэл өр</h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="text-center">
                        <h4 class="text-danger">{{ formatNumber(totalDebt) }}₮</h4>
                        <small class="text-muted">Нийт өр</small>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="text-center">
                        <h4 class="text-success">{{ formatNumber(totalPayment) }}₮</h4>
                        <small class="text-muted">Нийт төлөлт</small>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="text-center">
                        <h4 :class="remainingDebt >= 0 ? 'text-danger' : 'text-success'">
                          {{ formatNumber(Math.abs(remainingDebt)) }}₮
                        </h4>
                        <small class="text-muted">
                          {{ remainingDebt >= 0 ? 'Үлдэгдэл өр' : 'Илүү төлөлт' }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Бусад мэдээлэл -->
            <div class="col-12">
              <div class="card">
                <div class="card-header bg-secondary text-white">
                  <h6 class="mb-0">Бусад мэдээлэл</h6>
                </div>
                <div class="card-body">
                  <table class="table table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Зөвшөөрлийн мэдээ:</strong></td>
                        <td>{{ data.license_info || 0 }}</td>
                      </tr>
                      <tr>
                        <td><strong>Туслан зөвлөх үйлчилгээ:</strong></td>
                        <td>{{ data.advisory_service || 0 }}</td>
                      </tr>
                      <tr>
                        <td><strong>Зөрчлийн мэдээлэл:</strong></td>
                        <td>{{ data.violation_info || 0 }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Хаах</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useApi } from '../composables/useApi';

interface Props {
  isOpen: boolean;
  mrchRegno: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const loading = ref(false);
const error = ref('');
const data = ref<any>(null);

// Computed properties for totals
const totalDebt = computed(() => {
  if (!data.value?.debts || !Array.isArray(data.value.debts)) return 0;
  return data.value.debts.reduce((sum: number, debt: any) => {
    return sum + (debt.c2_debit || 0);
  }, 0);
});

const totalPayment = computed(() => {
  if (!data.value?.payments || !Array.isArray(data.value.payments)) return 0;
  return data.value.payments.reduce((sum: number, payment: any) => {
    return sum + (payment.amount || 0);
  }, 0);
});

const remainingDebt = computed(() => {
  return totalDebt.value - totalPayment.value;
});

// Number format function
function formatNumber(num: number | string | undefined) {
  if (num === undefined || num === null) return '-';
  return Number(num).toLocaleString('en-US');
}

// Date format function
function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    // ISO string-г зөв parse хийх
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return date.toLocaleDateString('mn-MN');
  } catch (error) {
    console.error('Date parsing error:', error);
    return dateStr;
  }
}

// Fetch organization details
async function fetchDetails() {
  if (!props.mrchRegno) return;
  
  loading.value = true;
  error.value = '';
  data.value = null;
  
  try {
    const response = await useApi(`/organization-detail/${props.mrchRegno}`);
    
    if (response.success) {
      data.value = response.data;
    } else {
      error.value = response.error?.message || 'Мэдээлэл авахад алдаа гарлаа';
    }
  } catch (e: any) {
    error.value = e.message || 'Алдаа гарлаа';
  } finally {
    loading.value = false;
  }
}

// Watch for modal open
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.mrchRegno) {
    fetchDetails();
  }
});

function close() {
  emit('close');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal-dialog {
  max-width: 90%;
  max-height: 90vh;
  overflow: auto;
}

.modal-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
}

.table-responsive {
  max-height: 300px;
  overflow-y: auto;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: 600;
}


</style> 