<template>
  <div class="container-xxl">
    <div class="row vh-100 d-flex justify-content-center">
      <div class="col-12 align-self-center">
        <div class="card-body">
          <div class="row">
            <div class="col-lg-6 mx-auto">
              <div class="card">
                <div class="card-body p-0 bg-primary auth-header-box rounded-top">
                  <div class="text-center p-3">
                    <NuxtLink to="/dashboard" class="logo logo-admin">
                      <img
                        src="/assets/images/logo.png"
                        height="50"
                        alt="logo"
                        class="auth-logo"
                      />
                    </NuxtLink>
                    <h4 class="mt-3 mb-1 fw-semibold text-white fs-18">
                      2FA Аюулгүй байдал тохируулах
                    </h4>
                    <p class="text-muted fw-medium mb-0">Хоёр шат баталгаажуулалт</p>
                  </div>
                </div>
                
                <div class="card-body pt-0">
                  <!-- Progress Steps -->
                  <div class="my-4">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="step-indicator" :class="{ 'active': step >= 1, 'completed': step > 1 }">
                        <div class="step-circle">
                          <span>1</span>
                        </div>
                        <span class="step-label">Хэрэглэгч</span>
                      </div>
                      <div class="step-line" :class="{ 'active': step > 1 }"></div>
                      <div class="step-indicator" :class="{ 'active': step >= 2, 'completed': step > 2 }">
                        <div class="step-circle">
                          <span>2</span>
                        </div>
                        <span class="step-label">QR код</span>
                      </div>
                      <div class="step-line" :class="{ 'active': step > 2 }"></div>
                      <div class="step-indicator" :class="{ 'active': step >= 3 }">
                        <div class="step-circle">
                          <span>3</span>
                        </div>
                        <span class="step-label">Баталгаажуулалт</span>
                      </div>
                    </div>
                  </div>

                  <!-- Error and Success Messages -->
                  <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    {{ error }}
                    <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
                  </div>
                  <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    {{ success }}
                    <button type="button" class="btn-close" @click="success = ''" aria-label="Close"></button>
                  </div>

                  <!-- Step 1: Username Input -->
                  <div v-if="step === 1" class="setup-step">
                    <div class="text-center mb-4">
                      <i class="fas fa-user-shield fa-3x text-primary mb-3"></i>
                      <h5 class="fw-semibold">Хэрэглэгчийн мэдээлэл</h5>
                      <p class="text-muted">2FA тохируулахын тулд хэрэглэгчийн нэрээ оруулна уу</p>
                    </div>
                    
                    <form @submit.prevent="generateQRCode">
                      <div class="form-group mb-4">
                        <label class="form-label fw-semibold" for="username">
                          <i class="fas fa-user me-2 text-primary"></i>Хэрэглэгчийн нэр
                        </label>
                        <input
                          id="username"
                          v-model="username"
                          type="text"
                          required
                          class="form-control form-control-lg"
                          placeholder="Хэрэглэгчийн нэрээ оруулна уу"
                          autofocus
                        />
                      </div>
                      
                      <div class="d-grid">
                        <button
                          type="submit"
                          :disabled="loading || !username"
                          class="btn btn-primary btn-lg py-3"
                        >
                          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                          <i v-if="!loading" class="fas fa-qrcode me-2"></i>
                          QR код үүсгэх
                        </button>
                      </div>
                    </form>
                  </div>

                  <!-- Step 2: QR Code Display -->
                  <div v-if="step === 2" class="setup-step">
                    <div class="text-center mb-4">
                      <i class="fas fa-mobile-alt fa-3x text-primary mb-3"></i>
                      <h5 class="fw-semibold">QR кодыг скан хийх</h5>
                      <p class="text-muted">Google Authenticator эсвэл бусад 2FA програмаар доорх QR кодыг скан хийнэ үү</p>
                    </div>
                    
                    <div class="text-center mb-4">
                      <div class="qr-code-container">
                        <img
                          :src="`data:image/png;base64,${qrCodeData.qr_code}`"
                          alt="2FA QR Code"
                          class="qr-code-image"
                        />
                      </div>
                    </div>
                    
                    <div class="manual-entry-section">
                      <h6 class="fw-semibold mb-2">
                        <i class="fas fa-key me-2"></i>Гараар оруулах түлхүүр:
                      </h6>
                      <div class="secret-key-display">
                        <code>{{ qrCodeData.secret }}</code>
                        <button 
                          @click="copySecret" 
                          class="btn btn-outline-secondary btn-sm ms-2"
                          :class="{ 'btn-success': copied }"
                        >
                          <i :class="copied ? 'fas fa-check' : 'fas fa-copy'"></i>
                        </button>
                      </div>
                      <small class="text-muted">
                        QR код скан хийж чадахгүй бол дээрх түлхүүрийг гараар оруулна уу
                      </small>
                    </div>
                    
                    <div class="d-grid mt-4">
                      <button
                        @click="step = 3"
                        class="btn btn-primary btn-lg py-3"
                      >
                        <i class="fas fa-arrow-right me-2"></i>
                        Үргэлжлүүлэх
                      </button>
                    </div>
                  </div>

                  <!-- Step 3: Verification -->
                  <div v-if="step === 3" class="setup-step">
                    <div class="text-center mb-4">
                      <i class="fas fa-shield-check fa-3x text-primary mb-3"></i>
                      <h5 class="fw-semibold">Баталгаажуулалт</h5>
                      <p class="text-muted">2FA програмаас гарсан 6 оронтой кодыг оруулж баталгаажуулна уу</p>
                    </div>
                    
                    <form @submit.prevent="verifySetup">
                      <div class="form-group mb-4">
                        <label class="form-label fw-semibold text-center d-block">
                          <i class="fas fa-mobile-alt me-2 text-primary"></i>Баталгаажуулах код
                        </label>
                        <input
                          v-model="verificationCode"
                          type="text"
                          required
                          maxlength="6"
                          pattern="[0-9]{6}"
                          class="form-control form-control-lg text-center"
                          placeholder="000000"
                          style="letter-spacing: 0.8em; font-size: 1.5em; font-weight: bold; background: #f8f9fa;"
                          autofocus
                        />
                        <div class="form-text text-center mt-2">
                          <small class="text-muted">6 оронтой тоо оруулна уу</small>
                        </div>
                      </div>
                      
                      <div class="d-grid gap-2">
                        <button
                          type="submit"
                          :disabled="loading || verificationCode.length !== 6"
                          class="btn btn-success btn-lg py-3"
                        >
                          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                          <i v-if="!loading" class="fas fa-check-circle me-2"></i>
                          2FA идэвхжүүлэх
                        </button>
                        
                        <button
                          type="button"
                          @click="step = 2"
                          class="btn btn-outline-secondary"
                        >
                          <i class="fas fa-arrow-left me-2"></i>
                          Буцах
                        </button>
                      </div>
                    </form>
                  </div>

                  <!-- Back to Login Link -->
                  <div class="text-center mt-4">
                    <div class="border-top pt-3">
                      <NuxtLink to="/login" class="text-decoration-none">
                        <i class="fas fa-sign-in-alt me-2 text-primary"></i>
                        <span class="text-muted">Нэвтрэх хуудас руу буцах</span>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const step = ref(1)
const username = ref('')
const verificationCode = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const copied = ref(false)
const qrCodeData = ref<any>(null)

async function generateQRCode() {
  if (!username.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/setup-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value
      })
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || '2FA тохируулалт үүсгэх алдаа')
    }

    qrCodeData.value = data.data
    step.value = 2
  } catch (err: any) {
    error.value = err.message || 'Алдаа гарлаа'
  } finally {
    loading.value = false
  }
}

async function verifySetup() {
  if (verificationCode.value.length !== 6) {
    error.value = '6 оронтой код оруулна уу'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/verify-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        token: verificationCode.value
      })
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || '2FA баталгаажуулах алдаа')
    }

    success.value = '2FA амжилттай идэвхжлээ! Dashboard хуудас руу шилжиж байна...'
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 2000)
    
  } catch (err: any) {
    error.value = err.message || 'Баталгаажуулах алдаа гарлаа'
  } finally {
    loading.value = false
  }
}

function copySecret() {
  if (qrCodeData.value?.secret) {
    navigator.clipboard.writeText(qrCodeData.value.secret)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// Auto-format verification code input (only allow numbers)
watch(() => verificationCode.value, (newValue) => {
  const cleaned = newValue.replace(/\D/g, '')
  if (cleaned !== newValue) {
    verificationCode.value = cleaned
  }
})
</script>

<style scoped>
/* Step Indicator Styles */
.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 3px solid #e9ecef;
}

.step-indicator.active .step-circle {
  background: #0d6efd;
  color: white;
  border-color: #0d6efd;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.25);
}

.step-indicator.completed .step-circle {
  background: #198754;
  color: white;
  border-color: #198754;
}

.step-label {
  margin-top: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
  transition: color 0.3s ease;
}

.step-indicator.active .step-label {
  color: #0d6efd;
}

.step-indicator.completed .step-label {
  color: #198754;
}

.step-line {
  height: 3px;
  background: #e9ecef;
  flex: 1;
  margin: 0 15px;
  margin-top: 25px;
  transition: background 0.3s ease;
}

.step-line.active {
  background: #0d6efd;
}

/* Setup Step Animation */
.setup-step {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* QR Code Styles */
.qr-code-container {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: inline-block;
  margin: 20px auto;
}

.qr-code-image {
  max-width: 200px;
  height: auto;
  border-radius: 10px;
}

.manual-entry-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #0d6efd;
}

.secret-key-display {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  font-family: 'Courier New', monospace;
  word-break: break-all;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}

/* Form Enhancements */
.form-control-lg {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control-lg:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-lg {
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 135, 84, 0.3);
}

/* Alert Enhancements */
.alert {
  border-radius: 10px;
  border: none;
  font-weight: 500;
}

.alert-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.alert-success {
  background: linear-gradient(135deg, #198754 0%, #157347 100%);
  color: white;
}

/* Card Enhancements */
.card {
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: none;
}

.auth-header-box {
  border-radius: 20px 20px 0 0 !important;
}
</style>
