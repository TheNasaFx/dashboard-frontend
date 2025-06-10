<template>
  <apexchart
    type="line"
    height="300"
    :options="chartOptions"
    :series="series"
  />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";

const series = [
  {
    name: "Татвар бүрдүүлэлт",
    data: [120, 150, 170, 140, 180, 200, 220, 240, 260, 280, 300, 320],
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
  colors: ["#556ee6"],
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
