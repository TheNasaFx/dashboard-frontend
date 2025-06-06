import { ref, onMounted, onUnmounted } from "vue";

export const useSidebar = () => {
  const isCollapsed = ref(false);

  const changeSidebarSize = () => {
    if (window.innerWidth >= 310 && window.innerWidth <= 1440) {
      isCollapsed.value = true;
      document.body.setAttribute("data-sidebar-size", "collapsed");
    } else {
      isCollapsed.value = false;
      document.body.setAttribute("data-sidebar-size", "default");
    }
  };

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
    document.body.setAttribute(
      "data-sidebar-size",
      isCollapsed.value ? "collapsed" : "default"
    );
  };

  onMounted(() => {
    window.addEventListener("resize", changeSidebarSize);
    changeSidebarSize();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", changeSidebarSize);
  });

  return {
    isCollapsed,
    toggleSidebar,
  };
};
