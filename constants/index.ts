import * as fonts from "@/app/fonts";

const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
const baseImgUrl = `https://res.cloudinary.com/${cloudinaryName}/image/upload`;

const basicId = process.env.NEXT_PUBIC_BASIC_ID;
const professionalId = process.env.NEXT_PUBLIC_PROFESSION_ID;

const maxFreeCards = 1;
const maxBasicCards = 5;
const maxProfessionalCards = 10;

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "Create 1 digital business card",
      "Access standard themes",
      "Choose from 3 standard fonts",
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
      "View basic analytics on card performance",
      "Unlock additional themes",
      "Choose from 7 unique fonts",
    ],
    popular: false,
    priceId: basicId || "",
  },
  {
    id: "professional",
    name: "Professional",
    price: 19.99,
    features: [
      "Create up to 10 digital business cards",
      "Access advanced analytics with detailed insights",
      "Unlock the full theme library",
      "Use all available fonts",
      "Connect a custom domain (card & profile)",
      "Receive priority customer support",
      "Remove all platform branding",
    ],
    popular: true,
    priceId: professionalId || "",
  },
];

const defaultFont = "roboto";
const freeFontOptions = [
  { value: "roboto", label: "Roboto", className: fonts.roboto.className },
  {
    value: "opensans",
    label: "Open Sans",
    className: fonts.openSans.className,
  },
  {
    value: "montserrat",
    label: "Montserrat",
    className: fonts.montserrat.className,
  },
];
const basicFontOptions = [
  ...freeFontOptions,
  { value: "inter", label: "Inter", className: fonts.inter.className },
  { value: "saira", label: "Saira", className: fonts.saira.className },
  { value: "raleway", label: "Raleway", className: fonts.raleway.className },
  {
    value: "playfairDisplay",
    label: "Playfair Display",
    className: fonts.playfairDisplay.className,
  },
];
const allFontOptions = [
  ...basicFontOptions,
  { value: "nunito", label: "Nunito", className: fonts.nunito.className },
  { value: "lora", label: "Lora", className: fonts.lora.className },
  {
    value: "quicksand",
    label: "Quicksand",
    className: fonts.quicksand.className,
  },
  {
    value: "yanoneKaffeesatz",
    label: "Yanone Kaffeesatz",
    className: fonts.yanoneKaffeesatz.className,
  },
  { value: "dosis", label: "Dosis", className: fonts.dosis.className },
  { value: "bitter", label: "Bitter", className: fonts.bitter.className },
  {
    value: "crimsonPro",
    label: "Crimson Pro",
    className: fonts.crimsonPro.className,
  },
  {
    value: "spaceGrotesk",
    label: "Space Grotesk",
    className: fonts.spaceGrotesk.className,
  },
  { value: "oswald", label: "Oswald", className: fonts.oswald.className },
  { value: "yrsa", label: "Yrsa", className: fonts.yrsa.className },
  { value: "rem", label: "REM", className: fonts.rem.className },
  { value: "signika", label: "Signika", className: fonts.signika.className },
  {
    value: "leagueSpartan",
    label: "League Spartan",
    className: fonts.leagueSpartan.className,
  },
];

const defaultColor = "slate";
const freeColorOptions = [
  { value: "slate", label: "Slate", color: "bg-slate-400" },
  { value: "gray", label: "Gray", color: "bg-gray-400" },
  { value: "zinc", label: "Zinc", color: "bg-zinc-400" },
  { value: "neutral", label: "Neutral", color: "bg-neutral-400" },
  { value: "stone", label: "Stone", color: "bg-stone-400" },
];
const basicColorOptions = [
  ...freeColorOptions,
  { value: "red", label: "Red", color: "bg-red-400" },
  { value: "orange", label: "Orange", color: "bg-orange-400" },
  { value: "amber", label: "Amber", color: "bg-amber-400" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-400" },
  { value: "lime", label: "Lime", color: "bg-lime-400" },
  { value: "green", label: "Green", color: "bg-green-400" },
  { value: "emerald", label: "Emerald", color: "bg-emerald-400" },
];
const allColorOptions = [
  ...basicColorOptions,
  { value: "teal", label: "Teal", color: "bg-teal-400" },
  { value: "cyan", label: "Cyan", color: "bg-cyan-400" },
  { value: "sky", label: "Sky", color: "bg-sky-400" },
  { value: "blue", label: "Blue", color: "bg-blue-400" },
  { value: "indigo", label: "Indigo", color: "bg-indigo-400" },
  { value: "violet", label: "Violet", color: "bg-violet-400" },
  { value: "purple", label: "Purple", color: "bg-purple-400" },
  { value: "fuchsia", label: "Fuchsia", color: "bg-fuchsia-400" },
  { value: "pink", label: "Pink", color: "bg-pink-400" },
  { value: "rose", label: "Rose", color: "bg-rose-400" },
  {
    value: "gradient",
    label: "Gradient",
    color: "bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400",
  },
];

export {
  baseImgUrl,
  subscriptionPlans,
  cloudinaryName,
  basicId,
  professionalId,
  freeFontOptions,
  basicFontOptions,
  allFontOptions,
  freeColorOptions,
  basicColorOptions,
  allColorOptions,
  maxFreeCards,
  maxBasicCards,
  maxProfessionalCards,
  defaultFont,
  defaultColor,
};
