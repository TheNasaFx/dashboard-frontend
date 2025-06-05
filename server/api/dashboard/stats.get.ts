import { defineEventHandler } from "h3";
import { query } from "../../utils/db"; // Corrected path

export default defineEventHandler(async (event) => {
  // Статик утгуудыг шууд буцаана
  return {
    registrationPercentage: 76,
    uncertainPercentage: 23,
    otherPercentage: 1,
    eInvoiceCount: 865,
    reportsSubmitted: 3365,
    taxDebtCount: 65,
    vatPayerCount: 2365,
    totalTaxpayers: 5000, // эсвэл хүссэн тоо
    recentRegistrations: [
      {
        id: 1,
        taxpayerName: "Дэмо ХХК",
        registrationDate: "2024-06-01",
        invoiceNumber: "INV-001",
        reportNumber: "REP-001",
        status: "Баталгаажсан",
      },
      {
        id: 2,
        taxpayerName: "Go.to market",
        registrationDate: "2024-06-02",
        invoiceNumber: "INV-002",
        reportNumber: "REP-002",
        status: "Хүлээгдэж буй",
      },
    ],
    inspectors: [
      {
        id: 1,
        name: "Бат-Эрдэнэ",
        status: "active",
        lastActive: "2024-06-04 10:00",
        avatar: "/assets/images/users/default-avatar.jpg",
        count: 12,
      },
      {
        id: 2,
        name: "Сараа",
        status: "inactive",
        lastActive: "2024-06-03 09:00",
        avatar: "/assets/images/users/default-avatar2.jpg",
        count: 8,
      },
    ],
  };
});
