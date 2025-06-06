import { onMounted } from "vue";

export const useVerticalMenu = () => {
  const initVerticalMenu = () => {
    const navCollapse = document.querySelectorAll(".navbar-nav li .collapse");
    const navToggle = document.querySelectorAll(
      ".navbar-nav li [data-bs-toggle='collapse']"
    );

    navToggle.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });

    navCollapse.forEach((collapse) => {
      collapse.addEventListener("show.bs.collapse", (event) => {
        const target = event.target as HTMLElement;
        const parent = target.closest(".collapse.show");
        document
          .querySelectorAll(".navbar-nav .collapse.show")
          .forEach((element) => {
            if (element !== target && element !== parent) {
              const collapseInstance = new window.bootstrap.Collapse(element);
              collapseInstance.hide();
            }
          });
      });
    });
  };

  onMounted(() => {
    initVerticalMenu();
  });
};
