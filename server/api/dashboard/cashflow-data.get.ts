import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return {
    options: {
      xaxis: { categories: ["2024-01", "2024-02", "2024-03"] },
    },
    series: [
      { name: "Нийт дүн", data: [100000, 120000, 90000] },
      { name: "Гүйлгээний тоо", data: [5, 7, 4] },
    ],
  };
});
