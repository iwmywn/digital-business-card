import * as fonts from "@/app/fonts";

const basicId = process.env.NEXT_PUBLIC_BASIC_ID;
const professionalId = process.env.NEXT_PUBLIC_PROFESSION_ID;

const maxFreeCards = 1;
const maxBasicCards = 5;
const maxProfessionalCards = 10;

const maxFreeLinks = 5;
const maxBasicLinks = 15;
const maxProfessionalLinks = 30;

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
];
const allColorOptions = [
  ...basicColorOptions,
  {
    value: "ice",
    label: "Ice",
    color: "bg-gradient-to-r from-cyan-100 via-blue-200 to-indigo-200",
  },
  {
    value: "arctic",
    label: "Arctic",
    color: "bg-gradient-to-r from-blue-100 via-cyan-200 to-teal-300",
  },
  {
    value: "mojito",
    label: "Mojito",
    color: "bg-gradient-to-r from-green-300 via-lime-400 to-yellow-300",
  },
  {
    value: "mint",
    label: "Mint",
    color: "bg-gradient-to-r from-green-300 via-teal-400 to-emerald-500",
  },
  {
    value: "forest",
    label: "Forest",
    color: "bg-gradient-to-r from-lime-400 via-emerald-500 to-green-600",
  },
  {
    value: "aqua",
    label: "Aqua",
    color: "bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-500",
  },
  {
    value: "ocean",
    label: "Ocean",
    color: "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500",
  },
  {
    value: "aurora",
    label: "Aurora",
    color: "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600",
  },
  {
    value: "cottonCandy",
    label: "Cotton Candy",
    color: "bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300",
  },
  {
    value: "bubblegum",
    label: "Bubblegum",
    color: "bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600",
  },
  {
    value: "dusk",
    label: "Dusk",
    color: "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500",
  },
  {
    value: "rainbow",
    label: "Rainbow",
    color:
      "bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400",
  },
  {
    value: "sunset",
    label: "Sunset",
    color: "bg-gradient-to-r from-rose-400 via-red-400 to-orange-400",
  },
  {
    value: "flamingo",
    label: "Flamingo",
    color: "bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400",
  },
  {
    value: "fire",
    label: "Fire",
    color: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
  },
  {
    value: "lava",
    label: "Lava",
    color: "bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500",
  },
  {
    value: "berry",
    label: "Berry",
    color: "bg-gradient-to-r from-purple-700 via-pink-600 to-red-500",
  },
  {
    value: "twilight",
    label: "Twilight",
    color: "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500",
  },
  {
    value: "nebula",
    label: "Nebula",
    color: "bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-600",
  },
  {
    value: "space",
    label: "Space",
    color: "bg-gradient-to-r from-gray-800 via-purple-900 to-indigo-900",
  },
];

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      `Create ${maxFreeCards} digital business card`,
      "Access standard themes",
      `Choose from ${freeFontOptions.length} standard fonts`,
      `Add up to ${maxFreeLinks} links`,
    ],
    popular: false,
    priceId: "",
  },
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    features: [
      `Create up to ${maxBasicCards} digital business cards`,
      "Unlock additional themes",
      `Choose from ${basicFontOptions.length} unique fonts`,
      `Add up to ${maxBasicLinks} links`,
      "View basic analytics on card performance",
    ],
    popular: false,
    priceId: basicId || "",
  },
  {
    id: "professional",
    name: "Professional",
    price: 19.99,
    features: [
      `Create up to ${maxProfessionalCards} digital business cards`,
      "Unlock the full theme library",
      "Use all available fonts",
      `Add up to ${maxProfessionalLinks} links`,
      "Access advanced analytics with detailed insights",
      "Connect a custom card domain",
      "Receive priority customer support",
      "Remove all platform branding",
    ],
    popular: true,
    priceId: professionalId || "",
  },
];

export {
  subscriptionPlans,
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
  maxFreeLinks,
  maxBasicLinks,
  maxProfessionalLinks,
};
