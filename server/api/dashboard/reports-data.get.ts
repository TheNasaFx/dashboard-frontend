import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return {
    options: {
      xaxis: { categories: ["2024-01", "2024-02", "2024-03"] },
    },
    series: [{ name: "Бүртгэл", data: [10, 20, 30] }],
  };
});
