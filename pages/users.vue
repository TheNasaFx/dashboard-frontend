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
                  <table class="table mb-0">
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
                      <tr v-for="user in users" :key="user.email">
                        <td class="d-flex align-items-center">
                          <div class="d-flex align-items-center">
                            <img
                              :src="user.avatar"
                              class="me-2 thumb-md align-self-center rounded"
                              alt="..."
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">{{ user.name }}</h6>
                              <p class="fs-12 text-muted mb-0">
                                {{ user.district }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a
                            href="#"
                            class="text-body text-decoration-underline"
                            >{{ user.email }}</a
                          >
                        </td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.lastLogin }}</td>
                        <td>
                          <span
                            :class="[
                              'badge',
                              'rounded',
                              user.status === 'Active'
                                ? 'text-success bg-success-subtle'
                                : 'text-secondary bg-secondary-subtle',
                            ]"
                          >
                            {{ user.status }}
                          </span>
                        </td>
                        <td class="text-end">
                          <a href="#"
                            ><i class="las la-pen text-secondary fs-18"></i
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
import TheMenu from "../components/TheMenu.vue";
import FooterComponent from "../components/FooterComponent.vue";

const users = [
  {
    name: "Баатарсайхан.Б",
    avatar: "/assets/images/users/avatar-1.jpg",
    district: "Чингэлтэй",
    email: "bbdf54@gmail.com",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Active",
  },
  {
    name: "Сарантуяа.Б",
    avatar: "/assets/images/users/avatar-1.jpg",
    district: "Чингэлтэй",
    email: "saraa7878@gmail.com",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Active",
  },
  {
    name: "Ербулан.К",
    avatar: "/assets/images/users/avatar-2.jpg",
    district: "Баянгол",
    email: "erka212@gmail.com",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Active",
  },
  {
    name: "Сэргэлэн.С",
    avatar: "/assets/images/users/avatar-3.jpg",
    district: "Сонгинохайрхан",
    email: "sserge74@gmail.com",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Inactive",
  },
  {
    name: "Тамир.С",
    avatar: "/assets/images/users/avatar-4.jpg",
    district: "Баянзүрх",
    email: "tamir926@gmail.com",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Active",
  },
  {
    name: "Раднаасэд.Л",
    avatar: "/assets/images/users/avatar-5.jpg",
    district: "Баянгол",
    email: "monsters976@gmail.com",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Inactive",
  },
  {
    name: "Уянга.Б",
    avatar: "/assets/images/users/avatar-1.jpg",
    district: "Баянгол",
    email: "uyanga.b@mta.mn",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Active",
  },
  {
    name: "Нарангэрэл.П",
    avatar: "/assets/images/users/avatar-1.jpg",
    district: "Баянгол",
    email: "narangerel.pu@mta.mn",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Active",
  },
  {
    name: "Энхсайхан.Ж",
    avatar: "/assets/images/users/avatar-2.jpg",
    district: "Чингэлтэй",
    email: "enkhsaihan.j@mta.mn",
    phone: "99161843",
    lastLogin: "2025-04-29",
    status: "Active",
  },
];

onMounted(async () => {
  if (process.client) {
    await import("~/assets/js/app.js");
    await import("~/assets/js/pages/datatable.init.js");
  }
});
</script>
