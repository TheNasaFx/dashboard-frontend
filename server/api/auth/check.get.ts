import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, "auth_token");

  if (!authToken) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  // In a real app, you would validate the token here
  // For now, we'll just return the user data if the token exists
  return {
    success: true,
    user: {
      isLoggedIn: true,
      name: "Админ", // This should come from your database
      avatar: "/assets/images/avatar.jpg", // This should come from your database
    },
  };
});
