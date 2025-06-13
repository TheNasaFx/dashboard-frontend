<template>
  <apexchart
    type="line"
    height="250"
    :options="chartOptions"
    :series="series"
  />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";

const series = [
  {
    name: "Татвар бүрдүүлэлт",
    data: [31, 40, 28, 51, 42, 109, 100, 80, 135, 110, 150, 50],
  },
];

const chartOptions = {
  chart: {
    type: "line",
    toolbar: { show: false },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    categories: [
      "1-р сар",
      "2-р сар",
      "3-р сар",
      "4-р сар",
      "5-р сар",
      "6-р сар",
      "7-р сар",
      "8-р сар",
      "9-р сар",
      "10-р сар",
      "11-р сар",
      "12-р сар",
    ],
  },
  colors: ["#34c38f"],
  legend: {
    show: false,
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
