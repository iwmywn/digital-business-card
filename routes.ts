const authRoutes = ["/login", "/signup", "/forgot-password", "/email-handler"];
const loginRoute = "/login";
const DEFAULT_LOGIN_REDIRECT = "/home";
const maintenanceRoute = "/maintenance";
const privateRoute = "/private";
const ogRoute = "/opengraph-image.png";
const ignoredRoutes = ["/images/"];
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

export {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  maintenanceRoute,
  ogRoute,
  privateRoute,
  ignoredRoutes,
  loginRoute,
};
