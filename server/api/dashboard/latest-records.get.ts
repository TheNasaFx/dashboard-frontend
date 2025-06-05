import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return [
    {
      id: 1,
      taxpayerName: "Go.to market",
      registrationDate: "2024-06-01",
      invoiceNumber: "E123456",
      reportNumber: "R7890",
    },
    {
      id: 2,
      taxpayerName: "Demo ХХК",
      registrationDate: "2024-05-28",
      invoiceNumber: "E654321",
      reportNumber: "R4321",
    },
  ];
});
