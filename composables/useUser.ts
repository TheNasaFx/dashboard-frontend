import { ref } from "vue";

export const useUser = () => {
  const name = ref<string | null>(null);
  const avatar = ref<string | null>(null);
  const logged = ref<boolean>(false);
  const token = ref<string | null>(process.client ? localStorage.getItem("token") : null);
  const workerCode = ref<string | null>(process.client ? localStorage.getItem("workerCode") : null);

  // Хэрэглэгчийн мэдээллийг шинэчлэх
  const setUser = (user: { name: string; avatar: string; logged: boolean; token?: string; workerCode?: string }) => {
    name.value = user.name;
    avatar.value = user.avatar;
    logged.value = user.logged;
    if (user.token) {
      token.value = user.token;
      if (process.client) localStorage.setItem("token", user.token);
    }
    if (user.workerCode) {
      workerCode.value = user.workerCode;
      if (process.client) localStorage.setItem("workerCode", user.workerCode);
    }
  };

  // Хэрэглэгчийн мэдээллийг устгах (logout)
  const clearUser = () => {
    name.value = null;
    avatar.value = null;
    logged.value = false;
    token.value = null;
    workerCode.value = null;
    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("workerCode");
    }
  };

  return { name, avatar, logged, token, workerCode, setUser, clearUser };
};
