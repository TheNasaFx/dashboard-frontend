<template>
  <apexchart type="pie" height="300" :options="chartOptions" :series="series" />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";

const series = [30, 25, 20, 15, 10];

const chartOptions = {
  chart: {
    type: "pie",
  },
  labels: ["ХХК", "ТББ", "ХЗХ", "ББСБ", "Бусад"],
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
