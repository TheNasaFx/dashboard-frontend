<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div
              class="page-title-box d-md-flex justify-content-md-between align-items-center"
            >
              <h4 class="page-title">Татвар төлөгчид</h4>
              <div class="">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                  <li class="breadcrumb-item">
                    <a href="#">Татвар төлөгчид</a>
                  </li>
                  <li class="breadcrumb-item active">Жагсаалт</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-12 col-lg-12">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-wrap gap-2">
                  <!-- Dropdowns for filters -->
                  <!-- ... (copy dropdown HTML as in PHP) ... -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="card">
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    src="/uploads/go.market.jpeg"
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div class="col-md-8">
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
                    <a class="btn btn-icon btn-primary btn-sm" href="#"
                      ><i class="fa fa-edit"></i
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
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card">
              <div class="row g-0">
                <div class="col-md-4">
                  <img
                    src="/uploads/narantuul2.jpeg"
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">
                      Нарантуул-2 зах
                      <button
                        type="button"
                        class="btn btn-primary position-relative btn-sm"
                      >
                        Татвар төлөгч
                        <span
                          class="position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle"
                        >
                          <small class="thumb-xs">256</small>
                        </span>
                      </button>
                    </h5>
                    <p class="fs-12 text-muted">Үйлчилгээний төв</p>
                    <p class="card-text">
                      Нарантуул-2" худалдааны төв, Чингэлтэй дүүрэг - 12 хороо,
                      Улаанбаатар 15120
                    </p>
                    <small class="text-muted">Бүртгэл</small>
                    <div class="progress">
                      <div
                        class="progress-bar bg-danger progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style="width: 45%"
                        aria-valuenow="45"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <small class="text-muted">Тайлан</small>
                    <div class="progress">
                      <div
                        class="progress-bar bg-danger progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style="width: 35%"
                        aria-valuenow="35"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <a
                      class="btn btn-icon btn-warning btn-sm"
                      href="https://www.google.com/maps/search/%D0%BD%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D1%83%D1%83%D0%BB+%D0%B7%D0%B0%D1%85/@47.9471627,106.9023049,13z?entry=s&sa=X"
                      ><i class="fa fa-map-pin"></i
                    ></a>
                    <a class="btn btn-icon btn-primary btn-sm" href="#"
                      ><i class="fa fa-edit"></i
                    ></a>
                    <a class="btn btn-icon btn-dark btn-sm" href="entity?id=2"
                      >Зохион байгуулалт</a
                    >
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

<script setup>
// Add any interactivity or API calls here as needed
</script>

<style scoped>
/* Add your styles here or import from assets */
</style>
