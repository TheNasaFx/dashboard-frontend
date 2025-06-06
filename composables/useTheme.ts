import { ref, onMounted, watch } from "vue";

export const useTheme = () => {
  const isDark = ref(false);

  // Theme-г аль болох эрт оноох
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      isDark.value = savedTheme === "dark";
      document.documentElement.setAttribute(
        "data-bs-theme",
        isDark.value ? "dark" : "light"
      );
    } else {
      // System theme-ийг автоматаар оноох
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      isDark.value = prefersDark;
      document.documentElement.setAttribute(
        "data-bs-theme",
        prefersDark ? "dark" : "light"
      );
    }
  }

  onMounted(() => {
    // Энэ хэсэг одоо зөвхөн fallback
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      isDark.value = savedTheme === "dark";
      document.documentElement.setAttribute(
        "data-bs-theme",
        isDark.value ? "dark" : "light"
      );
    }
  });

  // Theme солих function
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.setAttribute(
      "data-bs-theme",
      isDark.value ? "dark" : "light"
    );
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  };

  // Theme өөрчлөгдөх бүрт localStorage-д хадгалах
  watch(isDark, (val) => {
    localStorage.setItem("theme", val ? "dark" : "light");
  });

  return {
    isDark,
    toggleTheme,
  };
};
