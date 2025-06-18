const landingRoute = "/";
const authRoutes = ["/signin", "/signup", "/forgot-password", "/email-handler"];
const signInRoute = "/signin";
const DEFAULT_SIGNIN_REDIRECT = "/home";
const maintenanceRoute = "/maintenance";
const privateRoute = "/private";
const ignoredRoutes = ["/opengraph-image.png", "/images/"];
const ogRoute = "/opengraph-image.png";
const protectedRoutes = [
  "/home",
  "/create",
  "/management",
  "/analytics",
  "/subscription",
  "/settings",
  "/edit",
  "/notifications",
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
  landingRoute,
};
