const cloudinaryName = "duobwq5xg";
const baseImgUrl = `https://res.cloudinary.com/${cloudinaryName}/image/upload`;

const basicId = "price_1RKWrNGLhvibmNX6gVIdO8tm";
const professionalId = "price_1RKWqsGLhvibmNX6JwNErxrI";

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "Create 1 digital business card",
      "Access to standard templates",
      "Basic QR code sharing",
    ],
    popular: false,
    priceId: "",
  },
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    features: [
      "Create up to 5 digital business cards",
      "Basic analytics to track card views",
      "Access to basic themes",
      "Customizable QR codes",
      "Choose from 3 professional fonts",
    ],
    popular: false,
    priceId: basicId,
  },
  {
    id: "professional",
    name: "Professional",
    price: 19.99,
    features: [
      "Create up to 15 digital business cards",
      "Advanced analytics with detailed insights",
      "Full access to all themes",
      "Custom domain support",
      "Priority customer support",
      "Remove platform branding",
      "Unlimited font options",
    ],
    popular: true,
    priceId: professionalId,
  },
];

export {
  baseImgUrl,
  subscriptionPlans,
  cloudinaryName,
  basicId,
  professionalId,
};
