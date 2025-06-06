<template>
  <TheMenu />
  <div class="page-wrapper">
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div
              class="page-title-box d-md-flex justify-content-md-between align-items-center"
            >
              <h4 class="page-title">Хянах самбар</h4>
              <div class="">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                  <li class="breadcrumb-item active">Хянах самбар</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-12 col-lg-6">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Бүртгэл</h4>
                  </div>
                  <div class="col-auto">
                    <div class="dropdown">
                      <a
                        href="#"
                        class="btn bt btn-light dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="icofont-calendar fs-5 me-1"></i> Энэ сар<i
                          class="las la-angle-down ms-1"
                        ></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Энэ жил</a>
                        <a class="dropdown-item" href="#">Бүгд</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body pt-0">
                <RegistrationChart />
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Татвар бүрдүүлэлт</h4>
                  </div>
                  <div class="col-auto">
                    <div class="dropdown">
                      <a
                        href="#"
                        class="btn bt btn-light dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="icofont-calendar fs-5 me-1"></i> Энэ сар<i
                          class="las la-angle-down ms-1"
                        ></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Энэ жил</a>
                        <a class="dropdown-item" href="#">Бүгд</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body pt-0">
                <CashflowChart />
                <div class="row">
                  <div class="col-4">
                    <div class="text-center">
                      <p class="text-muted text-uppercase mb-0 fw-medium fs-13">
                        Бүртгэл
                      </p>
                      <h5 class="mt-1 mb-0 fw-medium">76%</h5>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center">
                      <p class="text-muted text-uppercase mb-0 fw-medium fs-13">
                        Тодорхойгүй
                      </p>
                      <h5 class="mt-1 mb-0 fw-medium">23%</h5>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center">
                      <p class="text-muted text-uppercase mb-0 fw-medium fs-13">
                        Бусад
                      </p>
                      <h5 class="mt-1 mb-0 fw-medium">1%</h5>
                    </div>
                  </div>
                </div>
                <div class="text-center mx-auto">
                  <img
                    src="/assets/images/extra/rabit.png"
                    alt=""
                    class="d-inline-block"
                    height="105"
                  />
                </div>
                <div class="card-bg position-relative z-0">
                  <div class="p-3 bg-primary-subtle rounded position-relative">
                    <div class="d-flex align-items-center">
                      <div
                        class="flex-shrink-0 bg-primary-subtle text-primary thumb-lg rounded-circle"
                      >
                        <i class="iconoir-bright-star fs-3"></i>
                      </div>
                      <div class="flex-grow-1 ms-2">
                        <h6 class="my-0 fw-normal text-dark fs-13 mb-0">
                          Яг одоо бүртгэл хийгдэж байгаа
                          <a
                            href="#"
                            class="text-primary fw-medium mb-0 text-decoration-underline"
                            >хэн явж байна?</a
                          >
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="card bg-corner-img">
              <div class="card-body">
                <div class="row d-flex justify-content-center">
                  <div class="col-9">
                    <p class="text-muted text-uppercase mb-0 fw-normal fs-13">
                      E баримт гаргадаг
                    </p>
                    <h4 class="mt-1 mb-0 fw-medium">865</h4>
                  </div>
                  <div class="col-3 align-self-center">
                    <div
                      class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto"
                    >
                      <i
                        class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card bg-corner-img">
              <div class="card-body">
                <div class="row d-flex justify-content-center">
                  <div class="col-9">
                    <p class="text-muted text-uppercase mb-0 fw-normal fs-13">
                      Тайлан тушаасан
                    </p>
                    <h4 class="mt-1 mb-0 fw-medium">3,365</h4>
                  </div>
                  <div class="col-3 align-self-center">
                    <div
                      class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto"
                    >
                      <i
                        class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card bg-corner-img">
              <div class="card-body">
                <div class="row d-flex justify-content-center">
                  <div class="col-9">
                    <p class="text-muted text-uppercase mb-0 fw-normal fs-13">
                      Татварын өртэй
                    </p>
                    <h4 class="mt-1 mb-0 fw-medium">65</h4>
                  </div>
                  <div class="col-3 align-self-center">
                    <div
                      class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto"
                    >
                      <i
                        class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card bg-corner-img">
              <div class="card-body">
                <div class="row d-flex justify-content-center">
                  <div class="col-9">
                    <p class="text-muted text-uppercase mb-0 fw-normal fs-13">
                      НӨАТ төлөгч
                    </p>
                    <h4 class="mt-1 mb-0 fw-medium">2,365</h4>
                  </div>
                  <div class="col-3 align-self-center">
                    <div
                      class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto"
                    >
                      <i
                        class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 order-2 order-lg-1">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Үйл ажиллагааны чиглэл</h4>
                  </div>
                </div>
              </div>
              <div class="card-body pt-0">
                <BalanceChart />
                <div class="bg-light py-3 px-2 mb-0 mt-3 text-center rounded">
                  <h6 class="mb-0">
                    <i class="icofont-calendar fs-5 me-1"></i> 8,658 татвар
                    төлөгчид
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 col-lg-6 order-1 order-lg-2">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Сүүлийн бүртгэл</h4>
                  </div>
                  <div class="col-auto">
                    <div class="dropdown">
                      <a
                        href="#"
                        class="btn bt btn-light dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="icofont-calendar fs-5 me-1"></i> Энэ сар<i
                          class="las la-angle-down ms-1"
                        ></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#">Энэ жил</a>
                        <a class="dropdown-item" href="#">Бүгд</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="table-responsive">
                  <table class="table mb-0">
                    <thead class="table-light">
                      <tr>
                        <th class="border-top-0">Татвар төлөгч</th>
                        <th class="border-top-0">Бүртгэл</th>
                        <th class="border-top-0">Ибаримт</th>
                        <th class="border-top-0">Тайлан</th>
                        <th class="border-top-0">Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/logos/lang-logo/chatgpt.png"
                              height="40"
                              class="me-3 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">Баян Өндөг ХХК</h6>
                              <a href="#" class="fs-12 text-primary">Хүнс</a>
                            </div>
                          </div>
                        </td>
                        <td>2025-04-25</td>
                        <td><i class="fa fa-check text-success"></i></td>
                        <td>
                          <span
                            class="badge bg-success-subtle text-success fs-11 fw-medium px-2"
                            >Баталгаажсан</span
                          >
                        </td>
                        <td>
                          <a href="#"
                            ><i class="las la-print text-secondary fs-18"></i
                          ></a>
                          <a href="#"
                            ><i class="las la-edit text-secondary fs-18"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/logos/lang-logo/nodejs.png"
                              height="40"
                              class="me-3 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">Apple ХХК</h6>
                              <a href="#" class="fs-12 text-primary"
                                >Мэдээллийн технологи</a
                              >
                            </div>
                          </div>
                        </td>
                        <td>2025-04-26</td>
                        <td><i class="fa fa-check text-success"></i></td>
                        <td>
                          <span
                            class="badge bg-success-subtle text-success fs-11 fw-medium px-2"
                            >Баталгаажсан</span
                          >
                        </td>
                        <td>
                          <a href="#"
                            ><i class="las la-print text-secondary fs-18"></i
                          ></a>
                          <a href="#"
                            ><i class="las la-edit text-secondary fs-18"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/logos/lang-logo/meta.png"
                              height="40"
                              class="me-3 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">Пепси ХХК</h6>
                              <a href="#" class="fs-12 text-primary">Хүнс</a>
                            </div>
                          </div>
                        </td>
                        <td>2025-04-27</td>
                        <td><i class="fa fa-times text-danger"></i></td>
                        <td>
                          <span
                            class="badge bg-danger-subtle text-danger fs-11 fw-medium px-2"
                            >Гологдсон</span
                          >
                        </td>
                        <td>
                          <a href="#"
                            ><i class="las la-print text-secondary fs-18"></i
                          ></a>
                          <a href="#"
                            ><i class="las la-edit text-secondary fs-18"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/logos/lang-logo/gitlab.png"
                              height="40"
                              class="me-3 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">Монрос ХХК</h6>
                              <a href="#" class="fs-12 text-primary"
                                >Эрүүл мэнд</a
                              >
                            </div>
                          </div>
                        </td>
                        <td>2025-04-28</td>
                        <td><i class="fa fa-check text-success"></i></td>
                        <td>
                          <span
                            class="badge bg-success-subtle text-success fs-11 fw-medium px-2"
                            >Баталгаажсан</span
                          >
                        </td>
                        <td>
                          <a href="#"
                            ><i class="las la-print text-secondary fs-18"></i
                          ></a>
                          <a href="#"
                            ><i class="las la-edit text-secondary fs-18"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/logos/lang-logo/python.png"
                              height="40"
                              class="me-3 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">Форд ХХК</h6>
                              <a href="#" class="fs-12 text-primary"
                                >Үйлчилгээ</a
                              >
                            </div>
                          </div>
                        </td>
                        <td>2025-04-29</td>
                        <td><i class="fa fa-check text-success"></i></td>
                        <td>
                          <span
                            class="badge bg-success-subtle text-success fs-11 fw-medium px-2"
                            >Баталгаажсан</span
                          >
                        </td>
                        <td>
                          <a href="#"
                            ><i class="las la-print text-secondary fs-18"></i
                          ></a>
                          <a href="#"
                            ><i class="las la-edit text-secondary fs-18"></i
                          ></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3 order-3 order-lg-3">
            <div class="card">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Байцаагчид</h4>
                  </div>
                  <div class="col-auto">
                    <div class="dropdown">
                      <a href="#" class="btn bt btn-light">
                        <i class="icofont-contact-add fs-5 me-1"></i> бүгд
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="table-responsive">
                  <table class="table mb-0">
                    <tbody>
                      <tr>
                        <td class="px-0">
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/users/avatar-1.jpg"
                              height="36"
                              class="me-2 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0 text-truncate">Б.Батсайхан</h6>
                              <a
                                href="#"
                                class="font-12 text-muted text-decoration-underline"
                                >#3652</a
                              >
                            </div>
                          </div>
                        </td>
                        <td class="px-0 text-end">
                          <span
                            class="text-primary ps-2 align-self-center text-end fw-medium"
                            >33</span
                          >
                        </td>
                        <td class="px-0 text-end">
                          <a href="#" class="text-body"
                            ><i class="las la-sync-alt"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-0">
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/users/avatar-2.jpg"
                              height="36"
                              class="me-2 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0 text-truncate">С.Эрдэнэбаяр</h6>
                              <a
                                href="#"
                                class="font-12 text-muted text-decoration-underline"
                                >#4789</a
                              >
                            </div>
                          </div>
                        </td>
                        <td class="px-0 text-end">
                          <span
                            class="text-primary ps-2 align-self-center text-end fw-medium"
                            >148.00</span
                          >
                        </td>
                        <td class="px-0 text-end">
                          <a href="#" class="text-body"
                            ><i class="las la-sync-alt"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-0">
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/users/avatar-3.jpg"
                              height="36"
                              class="me-2 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0 text-truncate">С.Тамир</h6>
                              <a
                                href="#"
                                class="font-12 text-muted text-decoration-underline"
                                >#295</a
                              >
                            </div>
                          </div>
                        </td>
                        <td class="px-0 text-end">
                          <span
                            class="text-primary ps-2 align-self-center text-end fw-medium"
                            >295</span
                          >
                        </td>
                        <td class="px-0 text-end">
                          <a href="#" class="text-body"
                            ><i class="las la-sync-alt"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-0">
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/users/avatar-4.jpg"
                              height="36"
                              class="me-2 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0 text-truncate">Т.Гэрэл</h6>
                              <a
                                href="#"
                                class="font-12 text-muted text-decoration-underline"
                                >#3628</a
                              >
                            </div>
                          </div>
                        </td>
                        <td class="px-0 text-end">
                          <span
                            class="text-primary ps-2 align-self-center text-end fw-medium"
                            >185</span
                          >
                        </td>
                        <td class="px-0 text-end">
                          <a href="#" class="text-body"
                            ><i class="las la-sync-alt"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-0">
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/users/avatar-5.jpg"
                              height="36"
                              class="me-2 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0 text-truncate">У.Уянга</h6>
                              <a
                                href="#"
                                class="font-12 text-muted text-decoration-underline"
                                >#142</a
                              >
                            </div>
                          </div>
                        </td>
                        <td class="px-0 text-end">
                          <span
                            class="text-primary ps-2 align-self-center text-end fw-medium"
                            >142</span
                          >
                        </td>
                        <td class="px-0 text-end">
                          <a href="#" class="text-body"
                            ><i class="las la-sync-alt"></i
                          ></a>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-0">
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/users/avatar-6.jpg"
                              height="36"
                              class="me-2 align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0 text-truncate">Steven Sharp</h6>
                              <a
                                href="#"
                                class="font-12 text-muted text-decoration-underline"
                                >#4521</a
                              >
                            </div>
                          </div>
                        </td>
                        <td class="px-0 text-end">
                          <span
                            class="text-primary ps-2 align-self-center text-end fw-medium"
                            >29</span
                          >
                        </td>
                        <td class="px-0 text-end">
                          <a href="#" class="text-body"
                            ><i class="las la-sync-alt"></i
                          ></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TheMenu from "~/components/TheMenu.vue";
import RegistrationChart from "~/components/RegistrationChart.vue";
import CashflowChart from "~/components/CashflowChart.vue";
import BalanceChart from "~/components/BalanceChart.vue";
import "~/assets/js/app.js";
import "~/assets/js/baatars.js";
import { useRuntimeConfig } from "nuxt/app";

onMounted(async () => {
  const config = useRuntimeConfig();
  if (config.app.client) {
    await import("~/assets/js/app.js");
    await import("~/assets/js/pages/index.init.js");
    await import("~/assets/js/DynamicSelect.js");
  }
});
</script>
