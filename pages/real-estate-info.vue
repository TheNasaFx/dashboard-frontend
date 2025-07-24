<template>
  <NuxtLayout>
    <template #sidebar>
      <TheMenu />
    </template>
    <div class="page-wrapper">
      <div class="page-content">
        <div class="container-fluid">
          <!-- Page Title -->
          <div class="row">
            <div class="col-sm-12">
              <div class="page-title-box d-md-flex justify-content-md-between align-items-center">
                <h4 class="page-title">Үл хөдлөхийн мэдээлэл</h4>
                <div class="">
                  <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                    <li class="breadcrumb-item active">Үл хөдлөхийн мэдээлэл</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Coming Soon -->
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body text-center py-5">
                  <div class="avatar-lg mx-auto mb-4">
                    <div class="avatar-title bg-primary-subtle text-primary rounded-circle">
                      <i class="iconoir-building fs-36"></i>
                    </div>
                  </div>
                  <h4 class="mb-3">Үл хөдлөхийн мэдээлэл</h4>
                  <p class="text-muted mb-4">
                    Энэ хуудас удахгүй нээгдэх болно. Үл хөдлөх хөрөнгийн мэдээллийг энд харуулах болно.
                  </p>
                  <p class="text-muted">
                    <small>Хөгжүүлэлт явагдаж байна...</small>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <FooterComponent />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue"

// Meta
useHead({
  title: 'Үл хөдлөхийн мэдээлэл - МТА-НТГ',
  script: [
    { src: "/assets/js/app.js" },
    { src: "/assets/js/baatars.js" }
  ]
})
</script>

<style scoped>
.avatar-lg {
  height: 5rem;
  width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-title {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-subtle {
  background-color: rgba(59, 130, 246, 0.1) !important;
}
</style> 