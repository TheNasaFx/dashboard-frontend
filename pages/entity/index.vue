<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div
              class="page-title-box d-md-flex justify-content-md-between align-items-center"
            >
              <h4 class="page-title">Go.to market</h4>
              <div class="">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                  <li class="breadcrumb-item"><a href="#">Татвар төлөгч</a></li>
                  <li class="breadcrumb-item active">Дэлгэрэнгүй</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-8">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">
                  Go.to market
                  <button
                    type="button"
                    class="btn btn-primary position-relative btn-sm"
                  >
                    Татвар төлөгч
                    <span
                      class="position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle"
                    >
                      <small class="thumb-xs">128</small>
                    </span>
                  </button>
                </h5>
                <p class="fs-12 text-muted">Үйлчилгээний төв</p>
                <p class="card-text">
                  СБД, 11-р хороо, 7-р хороолол /Хангай хотхоны баруун талд/
                  14180 Ulaanbaatar, Mongolia
                </p>
                <small class="text-muted">Бүртгэл</small>
                <div class="progress">
                  <div
                    class="progress-bar bg-gray progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style="width: 90%"
                    aria-valuenow="90"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <small class="text-muted">Тайлан</small>
                <div class="progress">
                  <div
                    class="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style="width: 75%"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <div class="card-footer">
                <a
                  class="btn btn-icon btn-warning btn-sm"
                  href="https://www.google.com/maps/dir/?api=1&destination=47.934086900672%2C106.91685211685"
                  ><i class="fa fa-map-pin"></i
                ></a>
                <button
                  type="button"
                  class="btn btn-icon btn-dark btn-sm dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Давхар <i class="las la-angle-down ms-1"></i>
                </button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="entity?id=1&floor=1">1</a>
                  <a class="dropdown-item" href="entity?id=1&floor=2">2</a>
                  <a class="dropdown-item" href="entity?id=1&floor=3">3</a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <a href="/uploads/floor1.jpg" class="image-link">
              <img src="/uploads/floor1.jpg" alt="" class="w-100" />
            </a>
          </div>
        </div>
        <!-- Additional content (charts, etc.) can be added here as needed -->
      </div>
    </div>
  </div>
</template>

<script setup>
// Add any interactivity or API calls here as needed
</script>

<style scoped>
/* Add your styles here or import from assets */
</style>
