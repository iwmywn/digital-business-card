const baseImgUrl = "https://res.cloudinary.com/duobwq5xg/image/upload";

const basicId = "price_1RKWrNGLhvibmNX6gVIdO8tm";
const professionalId = "price_1RKWqsGLhvibmNX6JwNErxrI";

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "1 digital business card",
      "Basic analytics",
      "Standard templates",
      "QR code sharing",
    ],
    popular: false,
    priceId: "",
  },
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    features: [
      "5 digital business cards",
      "Advanced analytics",
      "Premium templates",
      "QR code customization",
      "Remove branding",
    ],
    popular: false,
    priceId: basicId,
  },
  {
    id: "professional",
    name: "Professional",
    price: 19.99,
    features: [
      "Unlimited digital business cards",
      "Comprehensive analytics",
      "All premium templates",
      "Custom domain",
      "Priority support",
      "Team management",
    ],
    popular: true,
    priceId: professionalId,
  },
];

export { baseImgUrl, subscriptionPlans, basicId, professionalId };
