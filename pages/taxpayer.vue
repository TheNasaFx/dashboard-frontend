<template>
  <div>
    <div class="container py-4">
      <div v-if="loading" class="text-center my-5">
        <span>Уншиж байна...</span>
      </div>
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-else-if="taxpayer">
        <!-- Header section -->
        <div class="card mb-4 p-4 shadow-sm">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h2 class="mb-1 fw-bold">{{ taxpayer.entity_name || taxpayer.LAST_NAME + ' ' + taxpayer.FIRST_NAME }}</h2>
              <div class="text-muted mb-2">Регистр: {{ taxpayer.pin || taxpayer.REG_NUM }}</div>
            </div>
          </div>
        </div>
        <!-- Tabs -->
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <a class="nav-link" :class="{active: activeTab==='info'}" @click="activeTab='info'">Мэдээлэл</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{active: activeTab==='report'}" @click="activeTab='report'">Тайлан</a>
          </li>
          <li class="nav-item"><a class="nav-link disabled">Нэхэмжлэх</a></li>
          <li class="nav-item"><a class="nav-link disabled">Тооцоолол</a></li>
          <li class="nav-item"><a class="nav-link" :class="{active: activeTab==='payment'}" @click="activeTab='payment'">Төлөлт</a></li>
          <li class="nav-item"><a class="nav-link" :class="{active: activeTab==='property'}" @click="activeTab='property'">Үл хөдлөх</a></li>
          <li class="nav-item"><a class="nav-link" :class="{active: activeTab==='land'}" @click="activeTab='land'">Газар</a></li>
        </ul>
        <!-- Tab content -->
        <div v-if="activeTab==='info'">
          <div class="row justify-content-center mb-4">
            <div class="col-md-6">
              <div class="card text-center shadow-sm p-4">
                <div class="fs-1 fw-bold text-primary">{{ barimtCount }}</div>
                <div class="text-muted">Сүүлийн 72 цагт е-баримт гаргасан тоо</div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center mb-4">
            <div class="col-md-6">
              <div class="card text-center shadow-sm p-4">
                <div class="fw-bold">Регистр: {{ taxpayer.pin }}</div>
                <div class="fw-bold">Нэр: {{ taxpayer.entity_name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab==='report'">
          <div class="row g-3">
            <div class="col-md-6 col-lg-4" v-for="item in reportData" :key="item.tax_type_code">
              <div class="card shadow-sm p-3 h-100 border-primary border-2">
                <div class="mb-2">
                  <span class="fw-bold">Татварын төрөл:</span> <span>{{ item.tax_type_name }}</span>
                </div>
                <div class="mb-1">
                  <span class="fw-bold">Төрлийн код:</span> <span>{{ item.tax_type_code }}</span>
                </div>
                <div>
                  <span class="fw-bold">Татварын алба:</span> <span>{{ item.branch_name }}</span>
                </div>
              </div>
            </div>
            <div v-if="!reportData.length" class="text-center text-muted py-5">Тайлангийн мэдээлэл алга байна</div>
          </div>
        </div>
        <div v-else-if="activeTab==='payment'">
          <div v-if="paymentsLoading" class="text-center my-5">
            <span>Төлөлтийн мэдээлэл уншиж байна...</span>
          </div>
          <div v-else-if="paymentsError" class="alert alert-danger">
            {{ paymentsError }}
          </div>
          <div v-else-if="paymentsSummary">
            <!-- Summary Section -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">Төлөлтийн товч мэдээлэл</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3">
                    <div class="text-center">
                      <div class="fs-5 fw-bold text-primary">{{ formatSqlDate(paymentsSummary.earliest_date) }}</div>
                      <div class="text-muted small">Эхний төлөлт</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center">
                      <div class="fs-5 fw-bold text-success">{{ formatSqlDate(paymentsSummary.latest_date) }}</div>
                      <div class="text-muted small">Сүүлийн төлөлт</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center">
                      <div class="fs-4 fw-bold text-warning">{{ formatSqlNumber(paymentsSummary.total_amount) }}₮</div>
                      <div class="text-muted small">Нийт төлсөн</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="text-center">
                      <div class="fs-5 fw-bold text-info">{{ paymentsSummary.payment_count }}</div>
                      <div class="text-muted small">Төлөлтийн тоо</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Detailed Payments -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Төлөлтийн дэлгэрэнгүй</h5>
              </div>
              <div class="card-body">
                <div v-if="paymentsSummary.payments && paymentsSummary.payments.length > 0">
                  <div v-for="payment in paymentsSummary.payments" :key="payment.invoice_no" class="border rounded p-3 mb-3">
                                         <div class="row">
                       <div class="col-md-6">
                         <div class="mb-2">
                           <strong>{{ getSqlStringValue(payment.tax_type_name) || 'Татварын төрөл тодорхойгүй' }}</strong>
                         </div>
                         <div class="text-muted small mb-1">
                           <strong>Нэхэмжлэхийн дугаар:</strong> {{ getSqlStringValue(payment.invoice_no) || '-' }}
                         </div>
                         <div class="text-muted small">
                           <strong>Татварын алба:</strong> {{ getSqlStringValue(payment.branch_name) || '-' }}
                         </div>
                       </div>
                       <div class="col-md-6 text-md-end">
                         <div class="mb-2">
                           <strong>Төлсөн огноо:</strong> {{ formatSqlDate(payment.paid_date) }}
                         </div>
                         <div class="fs-5 fw-bold text-success">
                           {{ formatSqlNumber(payment.amount) }}₮
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
                <div v-else class="text-center text-muted py-5">
                  Төлөлтийн мэдээлэл алга байна
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted py-5">
            Төлөлтийн мэдээлэл олдсонгүй
          </div>
        </div>
        <div v-else-if="activeTab==='property'">
          <div class="my-3">
            <input v-model="propertySearch" placeholder="Үл хөдлөх хөрөнгийн дугаар" class="form-control" />
          </div>
          <div class="row g-3">
            <div v-for="property in filteredProperties" :key="property.property_number" class="col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm border-primary border-2">
                <div class="card-body">
                  <h6 class="card-title text-primary fw-bold mb-3">
                    ҮХЭХ-ийн дугаар: {{ property.property_number || 'Тодорхойгүй' }}
                  </h6>
                  <div class="mb-2">
                    <strong>Хаяг:</strong> 
                    <span class="text-muted">{{ property.full_address || 'Хаяг байхгүй' }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Төрөл:</strong> 
                    <span class="badge bg-info">{{ property.property_type || 'Тодорхойгүй' }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Үл хөдлөхийн хэмжээ:</strong> 
                    <span class="text-success fw-bold">{{ 
                      property.property_size ? 
                      `${property.property_size.toLocaleString()} м²` : 
                      'Хэмжээ байхгүй' 
                    }}</span>
                  </div>
                  <div class="mb-0">
                    <strong>Гэрчилгээний огноо:</strong> 
                    <span class="text-muted small">{{ 
                      property.created_date ? 
                      formatDate(property.created_date) : 
                      'Огноо байхгүй' 
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredProperties.length === 0" class="text-center text-muted py-5">
            {{ propertySearch ? 'Хайлтад тохирох үл хөдлөх хөрөнгө олдсонгүй' : 'Үл хөдлөх хөрөнгийн мэдээлэл алга байна' }}
          </div>
        </div>
        <div v-else-if="activeTab==='land'">
          <div class="my-3">
            <input v-model="landSearch" placeholder="Гэрчилгээний дугаар" class="form-control" />
          </div>
          <div class="row g-3">
            <div v-for="land in filteredLandData" :key="land.certificate_no" class="col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm border-success border-2">
                <div class="card-body">
                  <h6 class="card-title text-success fw-bold mb-3">
                    {{ land.certificate_no || 'Гэрчилгээний дугаар байхгүй' }}
                  </h6>
                  <div class="mb-2">
                    <strong>Хаяг:</strong> 
                    <span class="text-muted">{{ land.full_address || 'Хаяг байхгүй' }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Захирамжийн дугаар:</strong> 
                    <span class="badge bg-warning">{{ land.decision_no || 'Дугаар байхгүй' }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Хэмжээ мкв:</strong> 
                    <span class="text-primary fw-bold">{{ 
                      land.area_m2 ? 
                      `${land.area_m2.toLocaleString()} м²` : 
                      'Хэмжээ байхгүй' 
                    }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Аймаг хот:</strong> 
                    <span class="text-info">{{ land.au1_name || 'Мэдээлэл байхгүй' }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Сум дүүрэг:</strong> 
                    <span class="text-info">{{ land.au2_name || 'Мэдээлэл байхгүй' }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Баг хороо:</strong> 
                    <span class="text-info">{{ land.au3_name || 'Мэдээлэл байхгүй' }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Гудамж:</strong> 
                    <span class="text-muted">{{ land.street || 'Гудамж байхгүй' }}</span>
                  </div>
                  <div class="mb-0">
                    <strong>Хашаа:</strong> 
                    <span class="text-muted small">{{ land.address_khashaa || 'Хашааны дугаар байхгүй' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredLandData.length === 0" class="text-center text-muted py-5">
            {{ landSearch ? 'Хайлтад тохирох газрын мэдээлэл олдсонгүй' : 'Газрын мэдээлэл алга байна' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const taxpayer = ref<any>(null)
const loading = ref(false)
const error = ref('')
const barimtCount = ref(0)
const activeTab = ref<'info'|'report'|'payment'|'property'|'land'>('info')
const reportData = ref<any[]>([])
const paymentData = ref<any[]>([])
const entId = ref(null)
const branchNames = ref<Record<string, string>>({})
const propertyData = ref<any[]>([])
const propertyStats = ref({
  total: 0,
  registered: 0,
  needRegister: 0,
  sold: 0,
  owned: 0,
  traded: 0,
  splitList: 0,
  changedBySplit: 0,
});
const propertySearch = ref('');
const landData = ref<any[]>([]);
const landSearch = ref('');

// New payment-related variables
const paymentsSummary = ref<any>(null);
const paymentsLoading = ref(false);
const paymentsError = ref('');

// Computed property for filtering properties
const filteredProperties = computed(() => {
  if (!propertySearch.value) {
    return propertyData.value;
  }
  return propertyData.value.filter(p => 
    (p.property_number || '').toLowerCase().includes(propertySearch.value.toLowerCase())
  );
});

// Computed property for filtering land data
const filteredLandData = computed(() => {
  if (!landSearch.value) {
    return landData.value;
  }
  return landData.value.filter(l => 
    (l.certificate_no || '').toLowerCase().includes(landSearch.value.toLowerCase())
  );
});

// Date formatting function
function formatDate(dateString: string): string {
  if (!dateString) return 'Огноо байхгүй';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN');
  } catch {
    return dateString;
  }
}

// Number formatting function
function formatNumber(num: any): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
}

// SQL NullString value extractor
function getSqlStringValue(sqlValue: any): string {
  if (sqlValue && typeof sqlValue === 'object' && sqlValue.Valid && sqlValue.String) {
    return sqlValue.String;
  }
  return '';
}

// SQL NullFloat64 value extractor and formatter
function formatSqlNumber(sqlValue: any): string {
  if (sqlValue && typeof sqlValue === 'object' && sqlValue.Valid && sqlValue.Float64 !== undefined) {
    return Number(sqlValue.Float64).toLocaleString('en-US');
  }
  return '0';
}

// SQL NullTime value extractor and formatter
function formatSqlDate(sqlValue: any): string {
  if (sqlValue && typeof sqlValue === 'object' && sqlValue.Valid && sqlValue.Time) {
    try {
      const date = new Date(sqlValue.Time);
      return date.toLocaleDateString('mn-MN');
    } catch {
      return 'Огноо буруу';
    }
  }
  return 'Огноо байхгүй';
}

async function fetchTaxpayer() {
  loading.value = true
  error.value = ''
  try {
    const regno = route.query.regno
    if (!regno) {
      error.value = 'Регистр оруулаагүй байна.'
      return
    }
    // Info tab
    if (activeTab.value === 'info') {
      const infoRes = await fetch(`http://localhost:8080/api/v1/account-general-years?regno=${regno}&tab=info`)
      const infoArr = infoRes.ok ? await infoRes.json() : []
      taxpayer.value = Array.isArray(infoArr) && infoArr.length > 0 ? infoArr[0] : null
      // Barimt count (last 72h)
      const barimtRes =  await fetch(`http://localhost:8080/api/ebarimt/${regno}`);
      if (barimtRes.ok) {
        const barimtData = await barimtRes.json()
        barimtCount.value = barimtData.count || 0
      }
    }
    // Report tab
    if (activeTab.value === 'report') {
      const reportRes = await fetch(`http://localhost:8080/api/v1/account-general-years?regno=${regno}&tab=report`)
      reportData.value = reportRes.ok ? await reportRes.json() : []
    }
    // Payment tab
    if (activeTab.value === 'payment') {
      paymentsLoading.value = true;
      paymentsError.value = '';
      paymentsSummary.value = null;
      
      try {
        const payRes = await fetch(`http://localhost:8080/api/v1/payments/${regno}`);
        if (payRes.ok) {
          const data = await payRes.json();
          if (data.success && data.data) {
            paymentsSummary.value = data.data;
          } else {
            paymentsError.value = 'Төлөлтийн мэдээлэл олдсонгүй';
          }
        } else {
          paymentsError.value = 'Төлөлтийн мэдээлэл авахад алдаа гарлаа';
        }
      } catch (e: any) {
        paymentsError.value = e.message || 'Төлөлтийн мэдээлэл авахад алдаа гарлаа';
      } finally {
        paymentsLoading.value = false;
      }
    }
    // Property tab
    if (activeTab.value === 'property') {
      // REG_NUM-ээр шууд property-уудыг авна
      const propRes = await fetch(`http://localhost:8080/api/v1/property-owners?reg_num=${regno}`)
      if (propRes.ok) {
        const data = await propRes.json()
        propertyData.value = data.success && Array.isArray(data.data) ? data.data : [];
      } else {
        propertyData.value = [];
      }
      
      // Статистик тооцоолол (шинэ өгөгдлийн бүтцэд тохируулан)
      propertyStats.value.total = propertyData.value.length;
      propertyStats.value.registered = propertyData.value.filter(p => p.property_type?.includes('Бүртгэсэн')).length;
      propertyStats.value.needRegister = propertyData.value.filter(p => p.property_type?.includes('Бүртгүүлэх')).length;
      propertyStats.value.sold = propertyData.value.filter(p => p.property_type?.includes('Худалдсан')).length;
      propertyStats.value.owned = propertyData.value.filter(p => p.property_type?.includes('Өмчилсөн')).length;
      propertyStats.value.traded = propertyData.value.filter(p => p.property_type?.includes('Арилжсан')).length;
      propertyStats.value.splitList = propertyData.value.filter(p => p.property_type?.includes('Жагсаалтаар салсан')).length;
             propertyStats.value.changedBySplit = propertyData.value.filter(p => p.property_type?.includes('Бүртгэл салгаснаар хэмжээ өөрчлөгдсөн')).length;
    }
    // Land tab
    if (activeTab.value === 'land') {
      // PIN-ээр шууд land-уудыг авна
      const landRes = await fetch(`http://localhost:8080/api/v1/land-views?pin=${regno}`)
      if (landRes.ok) {
        const data = await landRes.json()
        landData.value = data.success && Array.isArray(data.data) ? data.data : [];
      } else {
        landData.value = [];
      }
    }
    console.log(propertyData.value, landData.value);
  } catch (e: any) {
    error.value = e.message || 'Алдаа гарлаа'
    console.error('Fetch taxpayer error:', e, taxpayer.value)
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (
    activeTab.value === 'info' ||
    activeTab.value === 'report' ||
    activeTab.value === 'payment' ||
    activeTab.value === 'property' ||
    activeTab.value === 'land'
  ) {
    fetchTaxpayer();
  }
});

onMounted(fetchTaxpayer)
</script> 