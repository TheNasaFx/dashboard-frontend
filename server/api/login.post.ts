import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  // Hardcoded credentials (replace with DB check in production)
  if (username === "magnate" && password === "123") {
    return {
      success: true,
      name: "Админ",
      avatar: "/assets/images/avatar.jpg",
    };
  } else {
    return {
      success: false,
      error: "Нэвтрэх нэр эсвэл нууц үг буруу байна.",
    };
  }
});
