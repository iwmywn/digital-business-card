"use client";

import { scrollToSection } from "@/components/landing/header-nav";
import { Button } from "@/components/ui/button";

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
  );
}
