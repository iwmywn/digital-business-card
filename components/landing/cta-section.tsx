import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ViewPricingButton } from "@/components/landing/view-pricing-button"

export function CTASection() {
  return (
    <section className="relative py-16 md:py-20 lg:py-24">
      <div className="relative flex flex-col items-center gap-6">
        <h2 className="text-center text-4xl font-black tracking-tight sm:text-5xl">
          Ready to Modernize Your Networking?
        </h2>
        <div className="flex flex-col justify-center gap-4 font-bold sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">
              Get Started for Free
              <ArrowRight />
            </Link>
          </Button>
          <ViewPricingButton />
        </div>
      </div>
    </section>
  )
}
