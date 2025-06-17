import { LearnMoreButton } from "@/components/landing/learn-more-button";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="mb-1 flex min-h-screen flex-col items-center justify-center gap-12 px-4 md:px-6 lg:px-8">
      <h1 className="text-center text-[clamp(2.25rem,5vw+1rem,4.5rem)] leading-[1.1] font-black tracking-tight">
        Connect Instantly <br />
        with Digital Business Cards
      </h1>
      <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
        Share your contact information with a simple scan. Create customizable
        digital business cards that make networking effortless and leave a
        lasting impression.
      </p>
      <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <Link href="/signup">
            Create Your Card
            <ArrowRight />
          </Link>
        </Button>
        <LearnMoreButton />
      </div>
    </section>
  );
}
