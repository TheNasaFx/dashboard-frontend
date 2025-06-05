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
    data: [31, 40, 28, 51, 42, 109, 100],
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
