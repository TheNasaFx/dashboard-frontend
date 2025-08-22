<template>
  <div>
    <TheMenu />
    <Sidebar id="main-sidebar" title="" icon="" href="/dashboard" />
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
          <!-- New Cards Section -->
          <div class="row g-3 mb-4 justify-content-center">
            <div class="col-12 col-sm-6 col-lg-3" v-for="card in cards" :key="card.title">
              <div class="card h-100 text-center p-3 shadow-sm" style="cursor:pointer;">
                <div class="mb-2" style="font-size:2.5rem;">
                  <i :class="card.icon"></i>
                </div>
                <div class="fw-bold mb-2">{{ card.title }}</div>
                <template v-if="card.title === 'Татвар төлөгч хайх'">
                  <div class="d-flex flex-column align-items-center">
                    <input
                      v-model="searchRegno"
                      @keyup.enter="searchTaxpayer"
                      type="text"
                      class="form-control mb-2"
                      style="max-width: 180px;"
                      placeholder="Регистрийн дугаар"
                    />
                    <button class="btn btn-primary w-100" @click="searchTaxpayer">Хайх</button>
                  </div>
                </template>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const searchRegno = ref('');
const router = useRouter();

function searchTaxpayer() {
  if (searchRegno.value.trim()) {
    router.push({ path: '/taxpayer', query: { regno: searchRegno.value.trim() } });
  }
}

const cards = [
  { title: 'Үйл ажиллагааны бүртгэл', icon: 'bi-shop' },
  { title: 'Татвар төлөгч хайх', icon: 'bi-search' },
  { title: 'Хөрөнгийн бүртгэл', icon: 'bi-gear' },
  { title: 'Ажлын тэмдэглэл', icon: 'bi-journal-plus' }
]
</script>

<script lang="ts">
export const middleware = 'auth';
</script>

