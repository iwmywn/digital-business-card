"use client";

import { scrollToSection } from "@/components/landing/header-nav";
import { Button } from "@/components/ui/button";

export function ViewPricingButton() {
  return (
    <Button
      size="lg"
      variant="outline"
      onClick={() => scrollToSection("pricing")}
    >
      View Pricing
    </Button>
  );
}
