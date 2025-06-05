import { defineEventHandler, readBody, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  // TODO: Implement proper input validation and sanitization instead of just checking existence.
  // The PHP protect() function equivalent should be applied here.
  if (!username || !password) {
    // PHP original redirected with ?error=Хоосон
    return {
      success: false,
      message: "Нэвтрэх нэр эсвэл нууц үг хоосон байна.",
    };
  }

  // TODO: Replace this hardcoded check with actual authentication logic.
  // This should involve querying your database (based on mta2.sql) to verify credentials.
  // You will need to set up database connection and querying logic here.
  const isAuthenticated = username === "magnate" && password === "123"; // Placeholder logic

  if (isAuthenticated) {
    // Generate a simple token for now - in production this should be a proper JWT or session token
    const token = Buffer.from(`${username}-${Date.now()}`).toString("base64");

    setCookie(event, "auth_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      sameSite: "strict",
    });

    // Return user data that matches our store structure
    return {
      success: true,
      user: {
        isLoggedIn: true,
        name: "Админ", // This should come from your database
        avatar: "/assets/images/avatar.jpg", // This should come from your database
      },
      // Frontend will handle redirection to dashboard based on this success response.
    };
  } else {
    // PHP original redirected with ?error=Нэвтрэх нэр эсвэл нууц үг буруу байна.
    return {
      success: false,
      message: "Нэвтрэх нэр эсвэл нууц үг буруу байна.",
    };
  }
});
