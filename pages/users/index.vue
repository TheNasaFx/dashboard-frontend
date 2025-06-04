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
                      <!-- Loop through users data from API -->
                      <tr v-for="user in users" :key="user.id">
                        <td class="d-flex align-items-center">
                          <div class="d-flex align-items-center">
                            <!-- TODO: Update image source if needed -->
                            <img
                              :src="
                                user.avatar ||
                                '/assets/images/users/default-avatar.jpg'
                              "
                              class="me-2 thumb-md align-self-center rounded"
                              :alt="user.name"
                            />
                            <div class="flex-grow-1 text-truncate">
                              <h6 class="m-0">{{ user.name }}</h6>
                              <p class="fs-12 text-muted mb-0">
                                {{ user.location }}
                              </p>
                            </div>
                            <!--end media body-->
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
                              user.isActive
                                ? 'text-success bg-success-subtle'
                                : 'text-secondary bg-secondary-subtle',
                            ]"
                            >{{ user.isActive ? "Active" : "Inactive" }}</span
                          >
                        </td>
                        <td class="text-end">
                          <!-- TODO: Add actual links/actions for Edit -->
                          <NuxtLink :to="`/users/${user.id}`" class="text-body">
                            <i class="las la-pen text-secondary fs-18"></i>
                          </NuxtLink>
                        </td>
                      </tr>
                      <!-- Placeholder row if no data -->
                      <tr v-if="users.length === 0">
                        <td colspan="6" class="text-center">
                          Хэрэглэгчид олдсонгүй.
                        </td>
                      </tr>
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
import { definePageMeta } from "nuxt/app";
import { ref, onMounted } from "vue";

definePageMeta({
  middleware: ["auth"],
});

// Define reactive state for users data
const users = ref([]); // Placeholder for user list data

// Fetch user data from API endpoint (e.g., /api/users)
const fetchUsers = async () => {
  // Implement fetch call to /api/users
  try {
    const userData = await $fetch("/api/users");
    // Assuming userData is an array of user objects
    users.value = userData;
  } catch (error) {
    console.error("Error fetching users data:", error);
    // TODO: Display an error message to the user
  }
};

// Fetch data when component is mounted
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
