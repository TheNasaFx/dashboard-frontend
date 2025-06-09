<template>
  <NuxtLayout>
    <template #sidebar>
      <TheMenu />
    </template>
    <div class="page-wrapper">
      <div class="page-content">
        <div class="container-fluid py-4">
          <div class="row mb-3">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex flex-wrap gap-2">
                    <div>
                      <select class="form-select">
                        <option>Дүүрэг</option>
                        <option>Баянгол</option>
                        <option>Баянзүрх</option>
                        <option>Чингэлтэй</option>
                        <option>Сүхбаатар</option>
                        <option>Сонгинохайрхан</option>
                        <option>Хан-Уул</option>
                        <option>Багахангай</option>
                        <option>Налайх</option>
                        <option>Багануур</option>
                        <option>Бүгд</option>
                      </select>
                    </div>
                    <div>
                      <select class="form-select">
                        <option>Хороо</option>
                        <option v-for="n in 20" :key="n">
                          {{ n }}-р хороо
                        </option>
                        <option>Бүгд</option>
                      </select>
                    </div>
                    <div>
                      <select class="form-select">
                        <option>Ү/а чиглэл</option>
                        <option>Худалдаа</option>
                        <option>Хүнс</option>
                        <option>Санхүү</option>
                        <option>Тээвэр</option>
                        <option>Эрүүл мэнд</option>
                        <option>Боловсрол</option>
                        <option>Бүгд</option>
                      </select>
                    </div>
                    <div>
                      <select class="form-select">
                        <option>Төрөл</option>
                        <option>Хувь хүн</option>
                        <option>Хуулийн этгээд</option>
                        <option>Бүгд</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <MapView />
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
import MapView from "../components/MapView.vue";
import TheMenu from "../components/TheMenu.vue";
import "../assets/js/baatars.js";
</script>
