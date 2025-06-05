import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return [
    {
      id: 1,
      name: "Go.to market",
      type: "Үйлчилгээний төв",
      status: "active",
      image: "/uploads/floor1.jpg",
      address: "СБД, 11-р хороо, 7-р хороолол",
      taxpayerCount: 15,
      registrationProgress: 80,
      reportProgress: 60,
      lat: 47.9340869,
      lng: 106.9168521,
    },
    {
      id: 2,
      name: "Demo ХХК",
      type: "Дэлгүүр",
      status: "inactive",
      image: "/uploads/floor2.jpg",
      address: "БЗД, 12-р хороо, 8-р хороолол",
      taxpayerCount: 8,
      registrationProgress: 55,
      reportProgress: 40,
      lat: 47.92,
      lng: 106.92,
    },
  ];
});
