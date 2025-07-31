import type { Metadata } from "next"

import { CreateCard } from "@/components/card/create-card"

export const metadata: Metadata = {
  title: "Create Card",
  description: "Create a new digital business card.",
}

export default function page() {
  return <CreateCard />
}
