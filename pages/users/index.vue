<template>
  <div class="page-wrapper">
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div
              class="page-title-box d-md-flex justify-content-md-between align-items-center"
            >
              <h4 class="page-title">Байцаагчид</h4>
              <div class="">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a href="#">МТА - НТГ</a></li>
                  <li class="breadcrumb-item active">Байцаагчид</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table mb-0" id="datatable_1">
                    <thead class="table-light">
                      <tr>
                        <th>Нэр</th>
                        <th>Имэйл</th>
                        <th>Утас</th>
                        <th>Нэвтэрсэн</th>
                        <th>Төлөв</th>
                        <th class="text-end">Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Example static row, repeat as needed -->
                      <tr>
                        <td class="d-flex align-items-center">
                          <div class="d-flex align-items-center">
                            <img
                              src="/assets/images/users/avatar-1.jpg"
                              class="me-2 thumb-md align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">Баатарсайхан.Б</h6>
                              <p class="fs-12 text-muted mb-0">Чингэлтэй</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a
                            href="#"
                            class="text-body text-decoration-underline"
                            >bbdf54@gmail.com</a
                          >
                        </td>
                        <td>99161843</td>
                        <td>2025-04-29</td>
                        <td>
                          <span
                            class="badge rounded text-success bg-success-subtle"
                            >Active</span
                          >
                        </td>
                        <td class="text-end">
                          <a href="#"
                            ><i class="las la-pen text-secondary fs-18"></i
                          ></a>
                        </td>
                      </tr>
                      <!-- Add more static rows as needed -->
                    </tbody>
                  </table>
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
