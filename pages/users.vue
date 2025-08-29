<template>
  <div>
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
                  <!-- Controls row -->
                  <div
                    class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2"
                  >
                    <div>
                      <label>
                        <select
                          v-model.number="perPage"
                          class="form-select d-inline-block w-auto me-2"
                        >
                          <option :value="10">10</option>
                          <option :value="25">25</option>
                          <option :value="50">50</option>
                          <option :value="100">100</option>
                        </select>
                        entries per page
                      </label>
                    </div>
                    <div>
                      <input
                        v-model="search"
                        type="search"
                        class="form-control"
                        placeholder="Search..."
                      />
                    </div>
                  </div>
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
                        <tr v-for="user in paginatedUsers" :key="user.email">
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
                        <tr v-if="paginatedUsers.length === 0">
                          <td colspan="6" class="text-center">No data found</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!-- Showing X to Y of Z entries -->
                  <div
                    class="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2"
                  >
                    <div>
                      Showing {{ startEntry }} to {{ endEntry }} of
                      {{ filteredUsers.length }} entries
                    </div>
                    <!-- Pagination controls -->
                    <nav>
                      <ul class="pagination mb-0">
                        <li class="page-item" :class="{ disabled: page === 1 }">
                          <button
                            class="page-link"
                            @click="goToPage(page - 1)"
                            :disabled="page === 1"
                          >
                            &laquo;
                          </button>
                        </li>
                        <li
                          v-for="p in totalPages"
                          :key="p"
                          class="page-item"
                          :class="{ active: page === p }"
                        >
                          <button class="page-link" @click="goToPage(p)">
                            {{ p }}
                          </button>
                        </li>
                        <li
                          class="page-item"
                          :class="{ disabled: page === totalPages }"
                        >
                          <button
                            class="page-link"
                            @click="goToPage(page + 1)"
                            :disabled="page === totalPages"
                          >
                            &raquo;
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FooterComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAuth } from '../composables/useAuth';

const { requireAuth } = useAuth();

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
  {
    name: "Энхсайхан.Ж",
    avatar: "/assets/images/users/avatar-2.jpg",
    district: "Чингэлтэй",
    email: "enkhsaihan.j@mta.mn",
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

const search = ref("");
const page = ref(1);
const perPage = ref(10);

const filteredUsers = computed(() => {
  if (!search.value) return users;
  const s = search.value.toLowerCase();
  return users.filter(
    (u) =>
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.district.toLowerCase().includes(s) ||
      u.phone.includes(s) ||
      u.status.toLowerCase().includes(s)
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / perPage.value)
);

const paginatedUsers = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filteredUsers.value.slice(start, start + perPage.value);
});

const startEntry = computed(() =>
  filteredUsers.value.length === 0 ? 0 : (page.value - 1) * perPage.value + 1
);
const endEntry = computed(() =>
  Math.min(page.value * perPage.value, filteredUsers.value.length)
);

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
}

// Watchers to reset page if search or perPage changes
watch([search, perPage], () => {
  page.value = 1;
});

//  Authentication check
onMounted(() => {
  requireAuth();
});
</script>
