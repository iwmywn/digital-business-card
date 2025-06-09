import * as fonts from "@/app/fonts";

const basicId = process.env.NEXT_PUBLIC_BASIC_ID;
const professionalId = process.env.NEXT_PUBLIC_PROFESSIONAL_ID;

const maxFreeCards = 1;
const maxBasicCards = 3;
const maxProfessionalCards = 5;

const maxFreeLinks = 10;
const maxBasicLinks = 25;
const maxProfessionalLinks = 45;

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
    value: "forest",
    label: "Forest",
    color: "bg-gradient-to-r from-lime-400 via-emerald-500 to-green-600",
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
    value: "dusk",
    label: "Dusk",
    color: "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500",
  },
  {
    value: "rainbow",
    label: "Rainbow",
    color:
      "bg-[linear-gradient(to_right,_#f87171,_#fb923c,_#facc15,_#4ade80,_#60a5fa,_#6366f1,_#a855f7)]",
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
    value: "jungle",
    label: "Jungle",
    color: "bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700",
  },
  {
    value: "coffee",
    label: "Coffee",
    color: "bg-gradient-to-r from-yellow-900 via-amber-800 to-orange-900",
  },
  {
    value: "rust",
    label: "Rust",
    color: "bg-gradient-to-r from-red-900 via-orange-800 to-amber-700",
  },
  {
    value: "velvet",
    label: "Velvet",
    color: "bg-gradient-to-r from-purple-900 via-rose-900 to-red-900",
  },
  {
    value: "deepsea",
    label: "Deep Sea",
    color: "bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-900",
  },
  {
    value: "mystic",
    label: "Mystic",
    color: "bg-gradient-to-r from-gray-700 via-purple-800 to-indigo-800",
  },
  {
    value: "space",
    label: "Space",
    color: "bg-gradient-to-r from-gray-800 via-purple-900 to-indigo-900",
  },
  {
    value: "galaxy",
    label: "Galaxy",
    color: "bg-gradient-to-r from-indigo-800 via-purple-900 to-black",
  },
  {
    value: "midnight",
    label: "Midnight",
    color: "bg-gradient-to-r from-gray-900 via-indigo-900 to-black",
  },
  {
    value: "ash",
    label: "Ash",
    color: "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800",
  },
  {
    value: "charcoal",
    label: "Charcoal",
    color: "bg-gradient-to-r from-zinc-700 via-gray-800 to-zinc-900",
  },
  {
    value: "noir",
    label: "Noir",
    color: "bg-gradient-to-r from-black via-zinc-800 to-neutral-800",
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
    price: 5.99,
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
    price: 9.99,
    features: [
      `Create up to ${maxProfessionalCards} digital business cards`,
      "Unlock the full theme library",
      "Use all available fonts",
      `Add up to ${maxProfessionalLinks} links`,
      "Access advanced analytics with detailed insights",
      "Set a custom card link",
      "Toggle card public/private visibility",
      "Receive priority customer support",
      "Use your own brand name",
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
