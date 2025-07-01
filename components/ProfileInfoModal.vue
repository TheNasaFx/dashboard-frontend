<template>
  <div v-if="show" class="modal-backdrop" @click.self="close">
    <div class="modal-content-custom">
      <h3>Профайл мэдээлэл</h3>
      <div v-if="loading">Уншиж байна...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="info && Object.keys(info).length">
        <p><b>Овог нэр:</b> {{ info.lastName }} {{ info.firstName }}</p>
        <p><b>Албан тушаал:</b> {{ info.positionName }}</p>
        <p><b>Хэлтэс:</b> {{ info.departmentName }}</p>
        <p><b>Салбар:</b> {{ info.branchName }}</p>
        <!-- бусад мэдээлэл хүсвэл энд нэм -->
      </div>
      <div v-else>
        Мэдээлэл олдсонгүй
      </div>
      <button class="btn btn-secondary mt-2" @click="close">Хаах</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
  token: string;
  workerCode: string;
  onClose: () => void;
}>();

const info = ref<any>(null);
const loading = ref(false);
const error = ref("");

function close() {
  props.onClose();
}

async function fetchProfile() {
  loading.value = true;
  error.value = "";
  info.value = null;
  try {
    const res = await fetch(`http://localhost:8080/api/v1/proxy/worker-profile?workerCode=${props.workerCode}`, {
      headers: { Authorization: `Bearer ${props.token}` }
    });
    if (!res.ok) throw new Error("API алдаа: " + res.status);
    const data = await res.json();
    info.value = data.data ? data.data : {};
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.show,
  (val) => {
    if (val) fetchProfile();
  }
);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}
.modal-content-custom {
  background: #fff; border-radius: 10px; padding: 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.2);
  min-width: 320px; max-width: 90vw;
}
</style> 