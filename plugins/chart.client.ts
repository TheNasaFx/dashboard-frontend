import { Chart, registerables } from "chart.js";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  Chart.register(...registerables);
});
