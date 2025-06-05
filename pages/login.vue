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
                  <form class="my-4" @submit.prevent="onLogin">
                    <div v-if="error" class="alert alert-danger">
                      {{ error }}
                    </div>
                    <div v-if="success" class="alert alert-success">
                      {{ success }}
                    </div>
                    <div class="form-group mb-2">
                      <label class="form-label" for="username"
                        >Нэвтрэх нэр</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="username"
                        v-model="username"
                        placeholder="Нэвтрэх нэр"
                        required
                        autofocus
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="userpassword"
                        >Нууц үг</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        id="userpassword"
                        v-model="password"
                        placeholder="Нууц үг"
                        required
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "../composables/useUser";

const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const error = ref("");
const success = ref("");
const router = useRouter();
const { setUser } = useUser();

const onLogin = () => {
  error.value = "";
  success.value = "";
  // Dummy authentication
  if (username.value === "magnate" && password.value === "123") {
    setUser({
      name: username.value,
      avatar: "/assets/images/users/avatar-1.jpg",
      logged: true,
    });
    success.value = "Амжилттай нэвтэрлээ!";
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  } else {
    error.value = "Нэвтрэх нэр эсвэл нууц үг буруу!";
  }
};
</script>
