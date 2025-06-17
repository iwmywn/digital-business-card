import { Spotlight } from "@/components/ui/spotlight";
import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CTASection } from "@/components/landing/cta-section";
import { Foorter } from "@/components/landing/footer";

export function LandingPage() {
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

        <Foorter />
      </div>
    </>
  );
}
