import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return {
    labels: ["Үйлчилгээ", "Дэлгүүр", "Зочид буудал"],
    series: [60, 30, 10],
  };
});
