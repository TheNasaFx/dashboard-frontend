import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
  // Session-г localStorage эсвэл cookie-оос шалгана
  const isLogged = process.client ? localStorage.getItem("ms_logged") : null;
  const name = process.client ? localStorage.getItem("ms_name") : null;
  const avatar = process.client ? localStorage.getItem("ms_avatar") : null;

  if (!isLogged || !name || !avatar) {
    return navigateTo("/login?error=Нэвтрэх шаардлагатай!");
  }
  // Хэрэглэгчийн мэдээллийг state/composable-д хадгалахыг дараа нь хийнэ
});
