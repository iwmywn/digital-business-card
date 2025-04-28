const authRoutes = ["/signin", "/signup", "/forgot-password", "/email-handler"];
const signInRoute = "/signin";
const DEFAULT_SIGNIN_REDIRECT = "/home";
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
  DEFAULT_SIGNIN_REDIRECT,
  protectedRoutes,
  maintenanceRoute,
  ogRoute,
  privateRoute,
  ignoredRoutes,
  signInRoute,
};
