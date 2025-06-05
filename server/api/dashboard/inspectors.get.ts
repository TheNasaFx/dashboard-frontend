import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return [
    {
      id: 1,
      name: "Бат-Эрдэнэ",
      avatar: "/assets/images/users/default-avatar.jpg",
      count: 12,
    },
    {
      id: 2,
      name: "Сараа",
      avatar: "/assets/images/users/default-avatar.jpg",
      count: 8,
    },
  ];
});
