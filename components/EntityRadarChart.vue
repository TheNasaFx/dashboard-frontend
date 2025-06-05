<template>
  <apexchart
    type="radar"
    height="300"
    :options="chartOptions"
    :series="series"
  />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";

const series = [
  {
    name: "Зөвлөгөө өгөх явц",
    data: [80, 90, 70, 60, 85, 75],
  },
];

const chartOptions = {
  chart: {
    type: "radar",
  },
  xaxis: {
    categories: [
      "Төлөвлөгөө",
      "Бэлтгэл",
      "Гүйцэтгэл",
      "Тайлан",
      "Шалгалт",
      "Дүгнэлт",
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
