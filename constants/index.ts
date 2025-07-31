import * as fonts from "@/app/fonts"

const basicId = process.env.NEXT_PUBLIC_BASIC_ID
const professionalId = process.env.NEXT_PUBLIC_PROFESSIONAL_ID

const maxFreeCards = 1
const maxBasicCards = 3
const maxProfessionalCards = 5

const maxFreeLinks = 10
const maxBasicLinks = 25
const maxProfessionalLinks = 45

const defaultFont = "roboto"
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
]
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
]
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
]

const defaultColor = "slate"
const freeColorOptions = [
  { value: "slate", label: "Slate", color: "bg-slate-400" },
  { value: "gray", label: "Gray", color: "bg-gray-400" },
  { value: "zinc", label: "Zinc", color: "bg-zinc-400" },
  { value: "neutral", label: "Neutral", color: "bg-neutral-400" },
  { value: "stone", label: "Stone", color: "bg-stone-400" },
]
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
]
const allColorOptions = [
  ...basicColorOptions,
  {
    value: "forest",
    label: "Forest",
    color:
      "bg-[linear-gradient(to_right,theme(colors.lime.400),theme(colors.emerald.500),theme(colors.green.600))]",
  },
  {
    value: "ocean",
    label: "Ocean",
    color:
      "bg-[linear-gradient(to_right,theme(colors.cyan.400),theme(colors.blue.500),theme(colors.indigo.500))]",
  },
  {
    value: "aurora",
    label: "Aurora",
    color:
      "bg-[linear-gradient(to_right,theme(colors.green.300),theme(colors.blue.500),theme(colors.purple.600))]",
  },
  {
    value: "dusk",
    label: "Dusk",
    color:
      "bg-[linear-gradient(to_right,theme(colors.indigo.400),theme(colors.purple.500),theme(colors.pink.500))]",
  },
  {
    value: "rainbow",
    label: "Rainbow",
    color:
      "bg-[linear-gradient(to_right,theme(colors.red.400),theme(colors.orange.400),theme(colors.yellow.300),theme(colors.emerald.400),theme(colors.blue.400),theme(colors.indigo.500),theme(colors.purple.500))]",
  },
  {
    value: "sunset",
    label: "Sunset",
    color:
      "bg-[linear-gradient(to_right,theme(colors.rose.400),theme(colors.red.400),theme(colors.orange.400))]",
  },
  {
    value: "flamingo",
    label: "Flamingo",
    color:
      "bg-[linear-gradient(to_right,theme(colors.pink.400),theme(colors.red.400),theme(colors.yellow.400))]",
  },
  {
    value: "lava",
    label: "Lava",
    color:
      "bg-[linear-gradient(to_right,theme(colors.red.600),theme(colors.orange.600),theme(colors.yellow.500))]",
  },
  {
    value: "berry",
    label: "Berry",
    color:
      "bg-[linear-gradient(to_right,theme(colors.purple.700),theme(colors.pink.600),theme(colors.red.500))]",
  },
  {
    value: "twilight",
    label: "Twilight",
    color:
      "bg-[linear-gradient(to_right,theme(colors.violet.500),theme(colors.indigo.500),theme(colors.blue.500))]",
  },
  {
    value: "nebula",
    label: "Nebula",
    color:
      "bg-[linear-gradient(to_right,theme(colors.purple.800),theme(colors.indigo.700),theme(colors.blue.600))]",
  },
  {
    value: "jungle",
    label: "Jungle",
    color:
      "bg-[linear-gradient(to_right,theme(colors.green.900),theme(colors.emerald.800),theme(colors.lime.700))]",
  },
  {
    value: "coffee",
    label: "Coffee",
    color:
      "bg-[linear-gradient(to_right,theme(colors.yellow.900),theme(colors.amber.800),theme(colors.orange.900))]",
  },
  {
    value: "rust",
    label: "Rust",
    color:
      "bg-[linear-gradient(to_right,theme(colors.red.900),theme(colors.orange.800),theme(colors.amber.700))]",
  },
  {
    value: "velvet",
    label: "Velvet",
    color:
      "bg-[linear-gradient(to_right,theme(colors.purple.900),theme(colors.rose.900),theme(colors.red.900))]",
  },
  {
    value: "deepsea",
    label: "Deep Sea",
    color:
      "bg-[linear-gradient(to_right,theme(colors.cyan.900),theme(colors.blue.900),theme(colors.indigo.900))]",
  },
  {
    value: "mystic",
    label: "Mystic",
    color:
      "bg-[linear-gradient(to_right,theme(colors.gray.700),theme(colors.purple.800),theme(colors.indigo.800))]",
  },
  {
    value: "space",
    label: "Space",
    color:
      "bg-[linear-gradient(to_right,theme(colors.gray.800),theme(colors.purple.900),theme(colors.indigo.900))]",
  },
  {
    value: "galaxy",
    label: "Galaxy",
    color:
      "bg-[linear-gradient(to_right,theme(colors.indigo.800),theme(colors.purple.900),black)]",
  },
  {
    value: "midnight",
    label: "Midnight",
    color:
      "bg-[linear-gradient(to_right,theme(colors.gray.900),theme(colors.indigo.900),black)]",
  },
  {
    value: "ash",
    label: "Ash",
    color:
      "bg-[linear-gradient(to_right,theme(colors.gray.600),theme(colors.gray.700),theme(colors.gray.800))]",
  },
  {
    value: "charcoal",
    label: "Charcoal",
    color:
      "bg-[linear-gradient(to_right,theme(colors.zinc.700),theme(colors.gray.800),theme(colors.zinc.900))]",
  },
  {
    value: "noir",
    label: "Noir",
    color:
      "bg-[linear-gradient(to_right,black,theme(colors.zinc.800),theme(colors.neutral.800))]",
  },
]

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
]

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
}
