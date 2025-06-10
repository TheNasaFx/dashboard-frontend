<template>
  <apexchart type="bar" height="300" :options="chartOptions" :series="series" />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";

const series = [
  {
    name: "Татварын орлого",
    data: [320, 400, 350, 500, 420, 610, 700, 800, 900, 1000, 1100, 1200],
  },
];

const chartOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
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
  colors: ["#f46a6a"],
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
