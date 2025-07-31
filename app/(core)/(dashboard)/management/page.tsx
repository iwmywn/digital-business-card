import type { Metadata } from "next"

import { CardManagement } from "@/components/card/card-management"

export const metadata: Metadata = {
  title: "Card Management",
  description: "View and manage your digital business cards.",
}

export default function page() {
  return <CardManagement />
}
