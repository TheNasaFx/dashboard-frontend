<template>
  <form @submit.prevent="onSubmit" class="p-4 bg-white rounded shadow-sm">
    <div
      v-if="success"
      class="alert alert-success alert-dismissible"
      role="alert"
    >
      <button type="button" class="close" @click="success = ''">
        <span aria-hidden="true">&times;</span>
      </button>
      <strong>Амжилттай илгээлээ</strong>
    </div>
    <div v-if="error" class="alert alert-danger alert-dismissible" role="alert">
      <button type="button" class="close" @click="error = ''">
        <span aria-hidden="true">&times;</span>
      </button>
      <strong>Алдаа гарлаа</strong>
    </div>
    <div class="mb-3">
      <label class="form-label">Нэр</label>
      <input v-model="name" type="text" class="form-control" required />
    </div>
    <div class="mb-3">
      <label class="form-label">Имэйл</label>
      <input v-model="email" type="email" class="form-control" required />
    </div>
    <div class="mb-3">
      <label class="form-label">Гарчиг</label>
      <input v-model="subject" type="text" class="form-control" required />
    </div>
    <div class="mb-3">
      <label class="form-label">Мессеж</label>
      <textarea
        v-model="message"
        class="form-control"
        rows="4"
        required
      ></textarea>
    </div>
    <div class="d-grid">
      <button type="submit" class="btn btn-primary">Илгээх</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const success = ref("");
const error = ref("");

const onSubmit = () => {
  success.value = "";
  error.value = "";
  // Dummy logic: always success
  if (name.value && email.value && subject.value && message.value) {
    success.value = "Амжилттай илгээлээ";
    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
  } else {
    error.value = "Алдаа гарлаа";
  }
};
</script>
