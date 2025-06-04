import { defineEventHandler, getCookie, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  const protectedRoutes = ["/dashboard", "/users", "/entities", "/map"]; // TODO: Define your protected routes here
  const currentPath = event.req.url;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath?.startsWith(route)
  );

  if (isProtectedRoute) {
    // TODO: Implement your authentication check here.
    // This should check if the user is authenticated based on your login implementation (e.g., check for a specific cookie or token).
    // Replace this placeholder logic.
    const isAuthenticated = getCookie(event, "your-auth-cookie-name"); // Example: checking for a cookie

    if (!isAuthenticated) {
      // User is not authenticated and is trying to access a protected route.
      // Redirect them to the login page.
      // TODO: Update the login page path if it's different.
      await sendRedirect(event, "/login?error=Нэвтрэх шаардлагатай!");
    }
    // If isAuthenticated is true, the middleware will simply continue, allowing access to the route.
  }

  // If the route is not protected, the middleware simply continues.
});
