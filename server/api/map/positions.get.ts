import { defineEventHandler } from "h3";
import { query } from "../../../server/utils/db"; // Adjust path as needed
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  return [
    {
      id: 1,
      category: "Үйлчилгээ",
      lat: 47.9340869,
      lng: 106.9168521,
      image: "/uploads/floor1.jpg",
      name: "Go.to market",
      address: "СБД, 11-р хороо, 7-р хороолол",
    },
  ];
});
