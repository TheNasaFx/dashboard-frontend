<template>
  <div class="container-xxl">
    <div class="row vh-100 d-flex justify-content-center">
      <div class="col-12 align-self-center">
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4 mx-auto">
              <div class="card">
                <div
                  class="card-body p-0 bg-primary auth-header-box rounded-top"
                >
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
                      Нийслэлийн татварын газар
                    </h4>
                    <p class="text-muted fw-medium mb-0">Байцаагчийн тайлан</p>
                  </div>
                </div>
                <div class="card-body pt-0">
                  <form class="my-4" @submit.prevent="login">
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

                    <!-- Progress Steps Indicator -->
                    <div class="mb-4">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="step-indicator" :class="{ 'active': step >= 1, 'completed': step > 1 }">
                          <div class="step-circle">
                            <i class="fas fa-user"></i>
                          </div>
                          <span class="step-label">Нэвтрэх</span>
                        </div>
                        <div class="step-line" :class="{ 'active': step > 1 }"></div>
                        <div class="step-indicator" :class="{ 'active': step >= 2 }">
                          <div class="step-circle">
                            <i class="fas fa-shield-alt"></i>
                          </div>
                          <span class="step-label">2FA</span>
                        </div>
                      </div>
                    </div>

                    <!-- Step 1: Username and Password -->
                    <div v-show="step === 1" class="login-step">
                      <div class="form-group mb-3">
                        <label class="form-label fw-semibold" for="username">
                          <i class="fas fa-user me-2 text-primary"></i>Нэвтрэх нэр
                        </label>
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          id="username"
                          v-model="username"
                          placeholder="Нэвтрэх нэрээ оруулна уу"
                          required
                          :autofocus="step === 1"
                        />
                      </div>
                      <div class="form-group mb-3">
                        <label class="form-label fw-semibold" for="password">
                          <i class="fas fa-lock me-2 text-primary"></i>Нууц үг
                        </label>
                        <input
                          type="password"
                          class="form-control form-control-lg"
                          id="password"
                          v-model="password"
                          placeholder="Нууц үгээ оруулна уу"
                          required
                        />
                      </div>
                    </div>
                    
                    <!-- Step 2: 2FA Token Input -->
                    <div v-show="step === 2" class="login-step">
                      <div class="text-center mb-4">
                        <div class="mb-3">
                          <i class="fas fa-mobile-alt fa-3x text-primary mb-3"></i>
                          <h5 class="fw-semibold">Аюулгүй байдлын баталгаажуулалт</h5>
                          <p class="text-muted">Google Authenticator эсвэл бусад 2FA програмаас гарсан кодыг оруулна уу</p>
                        </div>
                      </div>
                      
                      <div class="form-group mb-3">
                        <label class="form-label fw-semibold text-center d-block">
                          <i class="fas fa-key me-2 text-primary"></i>Баталгаажуулах код
                        </label>
                        <input
                          type="text"
                          class="form-control form-control-lg text-center"
                          id="token"
                          v-model="twoFAToken"
                          placeholder="000000"
                          maxlength="6"
                          pattern="[0-9]{6}"
                          :required="step === 2"
                          :autofocus="step === 2"
                          style="letter-spacing: 0.8em; font-size: 1.5em; font-weight: bold; background: #f8f9fa;"
                        />
                        <div class="form-text text-center mt-2">
                          <small class="text-muted">6 оронтой тоо оруулна уу</small>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="form-group mb-0">
                      <div class="d-grid">
                        <button 
                          class="btn btn-primary btn-lg py-3" 
                          type="submit"
                          :disabled="loading"
                        >
                          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                          <i v-if="!loading" :class="step === 1 ? 'fas fa-sign-in-alt' : 'fas fa-shield-check'" class="me-2"></i>
                          {{ step === 1 ? 'Нэвтрэх' : 'Баталгаажуулах' }}
                        </button>
                      </div>
                      
                      <!-- Back button for 2FA step -->
                      <div v-if="step === 2" class="d-grid mt-3">
                        <button 
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="resetForm"
                        >
                          <i class="fas fa-arrow-left me-2"></i>
                          Буцах
                        </button>
                      </div>
                      
                      <!-- 2FA Reset Link -->
                      <div v-if="step === 2" class="text-center mt-3">
                        <div class="border-top pt-3">
                          <button 
                            type="button"
                            @click="reset2FA"
                            class="btn btn-link text-decoration-none p-0"
                          >
                            <i class="fas fa-redo me-2 text-warning"></i>
                            <span class="text-muted">2FA дахин тохируулах</span>
                          </button>
                          <br>
                          <small class="text-muted">Google Authenticator дээрээс устгасан бол энд дарна уу</small>
                        </div>
                      </div>
                    </div>
                  </form>
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
import { useRouter } from 'vue-router'
import { useUser } from '../composables/useUser'

// Reactive variables
const username = ref('')
const password = ref('')
const twoFAToken = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const step = ref(1) // 1 = username/password, 2 = 2FA token

const router = useRouter()
const { setUser } = useUser()

// Helper function to parse JWT
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return {}
  }
}

// Main login function
const login = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    if (step.value === 1) {
      // Step 1: Initial login with username/password
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value
        })
      })

      const data = await response.json()
      console.log('LOGIN RESPONSE:', data)

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Нэвтрэх алдаа')
      }

      if (data.data.requires_2fa) {
        // User has 2FA enabled, proceed to step 2
        step.value = 2
        success.value = '2FA код шаардлагатай. Баталгаажуулах кодыг оруулна уу.'
      } else if (data.data.needs_setup) {
        // User needs to set up 2FA first
        sessionStorage.setItem('temp_username', username.value)
        sessionStorage.setItem('temp_password', password.value)
        router.push('/setup-2fa')
      } else {
        // Direct login (2FA already configured)
        localStorage.setItem('token', data.data.token)
        const payload = parseJwt(data.data.token)
        setUser({
          name: data.data.fullName || '',
          avatar: '',
          logged: true,
          token: data.data.token,
          workerCode: payload.sub
        })
        router.push('/dashboard')
      }
    } else if (step.value === 2) {
      // Step 2: 2FA verification
      if (twoFAToken.value.length !== 6) {
        throw new Error('6 оронтой код оруулна уу')
      }

      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
          token: twoFAToken.value
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || '2FA баталгаажуулах алдаа')
      }

      // Login successful
      localStorage.setItem('token', data.data.token)
      const payload = parseJwt(data.data.token)
      setUser({
        name: data.data.fullName || '',
        avatar: '',
        logged: true,
        token: data.data.token,
        workerCode: payload.sub
      })
      router.push('/dashboard')
    }
  } catch (err: any) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      error.value = 'Сервертэй холбогдож чадсангүй. Та backend серверээ шалгана уу.'
    } else {
      error.value = err.message || 'Нэвтрэх алдаа гарлаа'
    }
  } finally {
    loading.value = false
  }
}

// Reset form function
const resetForm = () => {
  step.value = 1
  twoFAToken.value = ''
  error.value = ''
  success.value = ''
}

// Reset 2FA function - disable current 2FA and redirect to setup
const reset2FA = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // First, try to disable current 2FA (this might fail if user can't authenticate)
    // But we'll proceed to reset anyway
    
    // Store credentials for setup process
    sessionStorage.setItem('temp_username', username.value)
    sessionStorage.setItem('temp_password', password.value)
    sessionStorage.setItem('reset_2fa', 'true') // Flag to indicate this is a reset
    
    // Redirect to setup page
    router.push('/setup-2fa')
    
  } catch (err: any) {
    error.value = err.message || '2FA дахин тохируулах алдаа гарлаа'
  } finally {
    loading.value = false
  }
}

// Auto-format 2FA token input (only allow numbers)
watch(() => twoFAToken.value, (newValue) => {
  const cleaned = newValue.replace(/\D/g, '')
  if (cleaned !== newValue) {
    twoFAToken.value = cleaned
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

/* Login Step Animation */
.login-step {
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
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3);
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

/* 2FA Token Input Special Styling */
input[type="text"][maxlength="6"] {
  font-family: 'Courier New', monospace;
}

/* Responsive Design */
@media (max-width: 768px) {
  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .step-line {
    margin: 0 10px;
  }
  
  .form-control-lg {
    font-size: 1rem;
  }
}
</style>
