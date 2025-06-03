import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: false,
    name: "",
    avatar: "/assets/images/avatar.jpg",
  }),
  actions: {
    login(name: string, avatar: string) {
      this.isLoggedIn = true;
      this.name = name;
      this.avatar = avatar;
    },
    logout() {
      this.isLoggedIn = false;
      this.name = "";
      this.avatar = "/assets/images/avatar.jpg";
    },
  },
});
