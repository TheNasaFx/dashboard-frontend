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
                    <a href="/" class="logo logo-admin">
                      <!-- Assuming logo.png is in public/assets/images -->
                      <img
                        src="/assets/images/logo.png"
                        height="50"
                        alt="logo"
                        class="auth-logo"
                      />
                    </a>
                    <h4 class="mt-3 mb-1 fw-semibold text-white fs-18">
                      Нийслэлийн татварын газар
                    </h4>
                    <p class="text-muted fw-medium mb-0">Байцаагчийн тайлан</p>
                  </div>
                </div>
                <div class="card-body pt-0">
                  <!-- We will handle form submission with Vue/Nuxt instead of direct POST -->
                  <form class="my-4" @submit.prevent="handleLogin">
                    <!-- TODO: Display error/success messages here based on API response -->
                    <!-- Example using a simple div -->
                    <div
                      v-if="message"
                      :class="{
                        alert: true,
                        'alert-danger': messageType === 'error',
                        'alert-success': messageType === 'success',
                      }"
                    >
                      {{ message }}
                    </div>

                    <div class="form-group mb-2">
                      <label class="form-label" for="username"
                        >Нэвтрэх нэр</label
                      >
                      <!-- Use v-model to bind input to data -->
                      <input
                        type="text"
                        class="form-control"
                        id="username"
                        name="username"
                        placeholder="Нэвтрэх нэр"
                        required
                        autofocus
                        v-model="username"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="userpassword"
                        >Нууц үг</label
                      >
                      <!-- Use v-model to bind input to data -->
                      <input
                        type="password"
                        class="form-control"
                        name="password"
                        id="userpassword"
                        placeholder="Нууц үг"
                        required
                        v-model="password"
                      />
                    </div>

                    <div class="form-group row mt-3">
                      <div class="col-sm-6">
                        <div class="form-check form-switch form-switch-success">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="customSwitchSuccess"
                            v-model="rememberMe"
                          />
                          <label
                            class="form-check-label"
                            for="customSwitchSuccess"
                            >Намайг сана</label
                          >
                        </div>
                      </div>
                      <!-- Password reset link (commented out in original, keep commented for now) -->
                      <!-- <div class="col-sm-6 text-end">
                        <a href="#" class="text-muted font-13"><i class="dripicons-lock"></i> Forgot password?</a>
                      </div> -->
                    </div>

                    <div class="form-group mb-0 row">
                      <div class="col-12">
                        <div class="d-grid mt-3">
                          <button class="btn btn-primary" type="submit">
                            Нэвтрэх <i class="fas fa-sign-in-alt ms-1"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <!-- Social login/register links (commented out in original, keep commented for now) -->
                  <!-- <div class="text-center mb-2">
                    <p class="text-muted">Don't have an account ? <a href="#" class="text-primary ms-2">Free Resister</a></p>
                    <h6 class="px-3 d-inline-block">Or Login With</h6>
                  </div>
                  <div class="d-flex justify-content-center">
                    <a href="#" class="d-flex justify-content-center align-items-center thumb-md bg-blue-subtle text-blue rounded-circle me-2">
                      <i class="fab fa-facebook align-self-center"></i>
                    </a>
                    <a href="#" class="d-flex justify-content-center align-items-center thumb-md bg-info-subtle text-info rounded-circle me-2">
                      <i class="fab fa-twitter align-self-center"></i>
                    </a>
                    <a href="#" class="d-flex justify-content-center align-items-center thumb-md bg-danger-subtle text-danger rounded-circle">
                      <i class="fab fa-google align-self-center"></i>
                    </a>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// Use $fetch for making API calls in Nuxt 3
// import { useFetch } from 'nuxt/app'; // Comment out useFetch

// Disable layout for this page
definePageMeta({
  layout: false,
});

const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const message = ref(null);
const messageType = ref(null); // 'success', 'error', or 'info' for placeholder

const handleLogin = async () => {
  // Clear previous messages
  message.value = null;
  messageType.value = null;

  try {
    // Implement API call to /api/auth/login using $fetch
    // Ensure the API endpoint exists and is set up to handle POST requests
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
        rememberMe: rememberMe.value, // Pass rememberMe state
      },
    });

    // Handle successful response from the API
    if (response.success) {
      message.value = response.message || "Login successful.";
      messageType.value = "success";
      // TODO: Handle successful login (e.g., set auth state in Pinia store, save token/session info)
      console.log("Login successful");
      // Use full page reload for now to ensure cookie is set
      window.location.replace("/dashboard");
    } else {
      // Handle error response from the API
      message.value = response.message || "Login failed.";
      messageType.value = "error";
      console.error("Login failed:", response.message);
    }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error("API Error during login:", error);
    message.value = error.data?.message || "An error occurred during login.";
    messageType.value = "error";
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
