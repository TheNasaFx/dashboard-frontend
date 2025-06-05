<template>
  <apexchart type="pie" height="250" :options="chartOptions" :series="series" />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";

const series = [44, 55, 13, 43, 22];

const chartOptions = {
  chart: {
    type: "pie",
  },
  labels: ["Үйлчилгээ", "Худалдаа", "Хүнс", "Тээвэр", "Бусад"],
  colors: ["#556ee6", "#34c38f", "#f46a6a", "#f1b44c", "#50a5f1"],
  legend: {
    show: true,
    position: "bottom",
  },
};
</script>

<script lang="ts">
export default {
  components: {
    apexchart: VueApexCharts,
  },
};
</script>
