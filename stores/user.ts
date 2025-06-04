import { defineStore } from "pinia";
import { useFetch, navigateTo } from "#app";

interface UserState {
  isLoggedIn: boolean;
  name: string;
  avatar: string;
}

interface LoginResponse {
  success: boolean;
  name?: string;
  avatar?: string;
  error?: string;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    isLoggedIn: false,
    name: "",
    avatar: "/assets/images/avatar.jpg",
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        const { data } = await useFetch<LoginResponse>("/api/login", {
          method: "POST",
          body: { username, password },
        });

        if (data.value?.success) {
          this.isLoggedIn = true;
          this.name = data.value.name || "";
          this.avatar = data.value.avatar || "/assets/images/avatar.jpg";
          return true;
        }
        return false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.name = "";
      this.avatar = "/assets/images/avatar.jpg";
      navigateTo("/login");
    },
  },

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },
});
