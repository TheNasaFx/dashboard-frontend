import { defineEventHandler, getCookie, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  const publicRoutes = ["/login"]; // Routes that do NOT require authentication (e.g., login, register)
  const protectedRoutes = ["/dashboard", "/users", "/entities", "/map"]; // Routes that DO require authentication
  const currentPath = event.req.url;

  // Log current path whenever middleware is triggered
  console.log(`Middleware triggered for path: ${currentPath}`);

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    currentPath?.startsWith(route)
  );

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath?.startsWith(route)
  );

  // Only apply authentication check if the route is a protected route
  if (isProtectedRoute) {
    console.log(`Checking authentication for protected route: ${currentPath}`);
    const isAuthenticated = getCookie(event, "auth_token"); // Check for the auth_token cookie

    // Log cookie value before redirect check
    console.log(
      "Auth cookie value (in protected route check):",
      isAuthenticated
    );

    if (!isAuthenticated) {
      // User is not authenticated and is trying to access a protected route.
      // Redirect them to the login page.
      console.log(
        `User not authenticated, redirecting ${currentPath} to /login`
      );
      await sendRedirect(event, "/login?error=Нэвтрэх шаардлагатай!");
    }
    // If isAuthenticated is true, middleware continues, allowing access to the protected route.
  } else if (!isPublicRoute) {
    // If the route is neither public nor protected, middleware continues without authentication check.
    // You might add different logic here for other types of routes if needed.
    console.log(
      `Route is neither public nor protected, continuing: ${currentPath}`
    );
  }
  // If the route is a public route, middleware continues without checking authentication.
});
