<template>
  <apexchart
    type="polarArea"
    height="300"
    :options="chartOptions"
    :series="series"
  />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";

const series = [21, 15, 30, 18, 10];

const chartOptions = {
  chart: {
    type: "polarArea",
  },
  labels: ["POS", "Касс", "Интернэт", "Мобайл", "Бусад"],
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
