import { subscriptionPlans } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative flex min-h-screen flex-col items-center justify-center py-16 md:py-20 lg:py-24"
    >
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg">
          Choose the plan that&apos;s right for you, from individual
          professionals to large teams.
        </p>
        <div className="mt-6 flex flex-col flex-wrap justify-center gap-6 min-[25rem]:flex-row">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              className={
                "hover:ring-primary relative max-w-sm flex-1 overflow-hidden shadow-sm transition-all duration-200 hover:ring-1 hover:ring-offset-1 min-[25rem]:min-w-[17.5rem]"
              }
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground flex items-center gap-1 rounded-bl-lg px-3 py-1 text-xs font-medium">
                    <Sparkles className="size-3" />
                    Popular
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {plan.name}
                </CardTitle>
                <CardDescription className="flex items-baseline">
                  <span className="text-base font-bold">
                    {plan.price === 0
                      ? "Free forever"
                      : `$${plan.price.toFixed(2)} / month`}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="text-primary mt-0.5 mr-2 size-4 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/signup">
                    {plan.id === "free" ? "Get Started" : "Upgrade"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
