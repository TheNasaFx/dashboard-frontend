import { defineStore } from "pinia";
import { useFetch, navigateTo } from "#app";

interface UserState {
  isLoggedIn: boolean;
  name: string;
  avatar: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    isLoggedIn: boolean;
    name: string;
    avatar: string;
  };
  message?: string;
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
        const { data } = await useFetch<LoginResponse>("/api/auth/login", {
          method: "POST",
          body: { username, password },
        });

        if (data.value?.success && data.value.user) {
          this.isLoggedIn = data.value.user.isLoggedIn;
          this.name = data.value.user.name;
          this.avatar = data.value.user.avatar;
          await navigateTo("/dashboard");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },

    async logout() {
      try {
        await useFetch("/api/auth/logout", { method: "POST" });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        this.isLoggedIn = false;
        this.name = "";
        this.avatar = "/assets/images/avatar.jpg";
        await navigateTo("/login");
      }
    },

    // Initialize store state from cookie
    async initialize() {
      try {
        const { data } = await useFetch<LoginResponse>("/api/auth/check");
        if (data.value?.success && data.value.user) {
          this.isLoggedIn = data.value.user.isLoggedIn;
          this.name = data.value.user.name;
          this.avatar = data.value.user.avatar;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        this.isLoggedIn = false;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },
});
