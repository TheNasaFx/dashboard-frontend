import { ref } from "vue";

export const useUser = () => {
  const name = ref<string | null>(null);
  const avatar = ref<string | null>(null);
  const logged = ref<boolean>(false);

  // LocalStorage-оос хэрэглэгчийн мэдээллийг унших
  const loadUser = () => {
    if (process.client) {
      name.value = localStorage.getItem("ms_name");
      avatar.value = localStorage.getItem("ms_avatar");
      logged.value = !!localStorage.getItem("ms_logged");
    }
  };

  // Хэрэглэгчийн мэдээллийг шинэчлэх
  const setUser = (user: { name: string; avatar: string; logged: boolean }) => {
    name.value = user.name;
    avatar.value = user.avatar;
    logged.value = user.logged;
    if (process.client) {
      localStorage.setItem("ms_name", user.name);
      localStorage.setItem("ms_avatar", user.avatar);
      localStorage.setItem("ms_logged", user.logged ? "1" : "");
    }
  };

  // Хэрэглэгчийн мэдээллийг устгах (logout)
  const clearUser = () => {
    name.value = null;
    avatar.value = null;
    logged.value = false;
    if (process.client) {
      localStorage.removeItem("ms_name");
      localStorage.removeItem("ms_avatar");
      localStorage.removeItem("ms_logged");
    }
  };

  return { name, avatar, logged, loadUser, setUser, clearUser };
};
