import { Spotlight } from "@/components/ui/spotlight"
import { CTASection } from "@/components/landing/cta-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"

export default function page() {
  return (
    <>
      <Spotlight />
      <div className="min-h-screen" data-vaul-drawer-wrapper>
        <Header />

        <main className="w-full px-6 md:px-8 lg:px-10">
          <HeroSection />

          <HowItWorksSection />

          <FeaturesSection />

          <PricingSection />

          <TestimonialsSection />

          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  )
}
