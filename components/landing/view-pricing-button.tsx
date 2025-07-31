"use client"

import { Button } from "@/components/ui/button"
import { scrollToSection } from "@/components/landing/header-nav"

export function ViewPricingButton() {
  return (
    <Button
      size="lg"
      variant="outline"
      onClick={() => scrollToSection("pricing")}
    >
      View Pricing
    </Button>
  )
}
