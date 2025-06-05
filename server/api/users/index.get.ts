import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return [
    {
      id: 1,
      name: "Бат-Эрдэнэ",
      email: "bat@tax.mn",
      phone: "99112233",
      lastLogin: "2024-06-04 10:00",
      isActive: true,
      avatar: "/assets/images/users/default-avatar.jpg",
      location: "Улаанбаатар",
    },
    {
      id: 2,
      name: "Сараа",
      email: "saraa@tax.mn",
      phone: "99113344",
      lastLogin: "2024-06-03 09:00",
      isActive: false,
      avatar: "/assets/images/users/default-avatar2.jpg",
      location: "Дархан",
    },
  ];
});
