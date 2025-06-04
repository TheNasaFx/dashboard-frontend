<template>
  <footer class="footer text-center text-sm-start d-print-none">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card mb-0 rounded-bottom-0">
            <div class="card-body">
              <p class="text-muted mb-0">
                ©
                {{ currentYear }}
                Нийслэлмийн Татварын Газар
                <span class="text-muted d-none d-sm-inline-block float-end">
                  Developed by
                  <i class="iconoir-heart-solid text-danger align-middle"></i>
                  <a
                    href="https://mindsymbol.com"
                    target="_blank"
                    class="text-muted"
                    >Майнд Симбол ХХК</a
                  >
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>

<style scoped>
/* Add any specific styles for the footer here if needed */
/* The PHP file seems to use Bootstrap classes, which should be handled by your main CSS */
</style>
