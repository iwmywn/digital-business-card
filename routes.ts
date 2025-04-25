const authRoutes = ["/login", "/signup", "/forgot-password", "/email-handler"];
const DEFAULT_LOGIN_REDIRECT = "/home";
const protectedRoutes = [
  "/analytics",
  "/create",
  "/faq",
  "/home",
  "/info",
  "/manage",
  "/payments",
  "/privacy",
  "/tos",
];
const maintenanceRoute = "/maintenance";

export {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  maintenanceRoute,
};
