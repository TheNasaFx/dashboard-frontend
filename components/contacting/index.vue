<template>
  <form @submit.prevent="onSubmit">
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
      <strong>{{ error }}</strong>
    </div>
    <input
      v-model="name"
      placeholder="Нэр"
      required
      class="form-control mb-2"
    />
    <input
      v-model="email"
      placeholder="Имэйл"
      required
      class="form-control mb-2"
    />
    <input
      v-model="subject"
      placeholder="Гарчиг"
      required
      class="form-control mb-2"
    />
    <textarea
      v-model="message"
      placeholder="Мессеж"
      required
      class="form-control mb-2"
    ></textarea>
    <button type="submit" class="btn btn-primary">Илгээх</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const error = ref("");
const success = ref("");

function onSubmit() {
  if (!name.value || !email.value || !subject.value || !message.value) {
    error.value = "Бүх талбарыг бөглөнө үү!";
    success.value = "";
    return;
  }
  // TODO: Replace with real API call
  success.value = "Амжилттай илгээлээ";
  error.value = "";
  name.value = email.value = subject.value = message.value = "";
}
</script>
