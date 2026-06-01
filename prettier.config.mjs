/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  semi: false,
  trailingComma: "es5",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/actions/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/constants/(.*)$",
    "^@/hooks/(.*)$",
    "^@/lib/(.*)$",
    "^@/schemas/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]",
  ],
}

export default prettierConfig
