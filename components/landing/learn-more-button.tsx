"use client"

import { Button } from "@/components/ui/button"
import { scrollToSection } from "@/components/landing/header-nav"

export function LearnMoreButton() {
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full sm:w-auto"
      onClick={() => scrollToSection("how-it-works")}
    >
      Learn More
    </Button>
  )
}
