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
          <li class="nav-item"><a class="nav-link disabled">Үл хөдлөх</a></li>
          <li class="nav-item"><a class="nav-link disabled">Газар</a></li>
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
          <div class="card my-4">
            <div class="card-header">Хуулийн этгээдийн үл хөдлөх эд хөрөнгийн албан татвар</div>
            <div class="card-body">
              <div v-for="payment in paymentData" :key="payment.INVOICE_NO">
                <div>Нэхэмжлэхийн дугаар: {{ payment.INVOICE_NO }}</div>
                <div>Татварын алба: {{ branchNames[payment.INVOICE_NO] || 'Тодорхойгүй' }}</div>
                <div>Төлсөн огноо: {{ payment.PAID_DATE }}</div>
                <div>Төлсөн дүн: {{ payment.AMOUNT }}</div>
              </div>
              <div v-if="!paymentData.length" class="text-muted">Төлөлтийн мэдээлэл алга байна</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const taxpayer = ref<any>(null)
const loading = ref(false)
const error = ref('')
const barimtCount = ref(0)
const activeTab = ref<'info'|'report'|'payment'>('info')
const reportData = ref<any[]>([])
const paymentData = ref<any[]>([])
const entId = ref(null)
const branchNames = ref<Record<string, string>>({})

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
      console.log('PAYMENT TAB', regno);
      // 1. ENT_ID-г авна
      const infoRes = await fetch(`http://localhost:8080/api/v1/account-general-years?regno=${regno}&tab=info`)
      const infoArr = infoRes.ok ? await infoRes.json() : []
      if (Array.isArray(infoArr) && infoArr.length > 0 && infoArr[0].ENT_ID) {
        entId.value = infoArr[0].ENT_ID.Int64 || infoArr[0].ENT_ID;
        // 2. Payments API-г дуудаж өгөгдлийг авна
        const payRes = await fetch(`http://localhost:8080/api/v1/payments?owner_id=${entId.value}`)
        paymentData.value = payRes.ok ? await payRes.json() : []
        // 3. BRANCH_NAME-уудыг авах (INVOICE_NO-р холбох)
        const branchRes = await fetch(`http://localhost:8080/api/v1/account-general-years?regno=${regno}&tab=report`)
        const branchArr = branchRes.ok ? await branchRes.json() : []
        branchNames.value = {};
        branchArr.forEach(item => {
          if (item.INVOICE_NO && item.BRANCH_NAME && !branchNames.value[item.INVOICE_NO]) {
            branchNames.value[item.INVOICE_NO] = item.BRANCH_NAME;
          }
        });
      } else {
        entId.value = null;
        paymentData.value = [];
        branchNames.value = {};
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Алдаа гарлаа'
    console.error('Fetch taxpayer error:', e, taxpayer.value)
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (activeTab.value === 'info' || activeTab.value === 'report' || activeTab.value === 'payment') {
    fetchTaxpayer();
  }
});

onMounted(fetchTaxpayer)
</script> 