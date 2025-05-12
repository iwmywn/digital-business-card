"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/actions/stripe";
import { switchToPlan } from "@/actions/plan";
import { subscriptionPlans } from "@/constants";
import { useSubscription, useUser } from "@/lib/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";

export function SubscriptionManagement() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { basic, professional } = useSubscription();
  const { userData, currentPlan, mutate } = useUser();
  const router = useRouter();

  async function handleSubscribe(priceId: string, planId: string) {
    setIsLoading((prev) => ({ ...prev, [planId]: true }));

    const { error, url } = await createCheckoutSession(priceId, planId);

    if (error || !url) {
      toast.error(error);
    } else {
      router.push(url);
    }
    setIsLoading((prev) => ({ ...prev, [planId]: false }));
  }

  async function handleSwitchPlan(planId: "free" | "basic" | "professional") {
    setIsLoading((prev) => ({ ...prev, [planId]: true }));

    const { error } = await switchToPlan(planId);

    if (error) {
      toast.error(error);
    } else {
      mutate({ ...userData, currentPlan: planId });
    }
    setIsLoading((prev) => ({ ...prev, [planId]: false }));
  }

  const formatExpirationDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex flex-wrap gap-6">
      {subscriptionPlans.map((plan) => {
        const isCurrentPlan = currentPlan === plan.id;
        const isAccessible =
          plan.id === "basic"
            ? basic.hasAccess
            : plan.id === "professional"
              ? professional.hasAccess
              : true;

        const expirationDate =
          plan.id === "basic"
            ? basic.expiresAt
            : plan.id === "professional"
              ? professional.expiresAt
              : null;

        return (
          <Card
            key={plan.id}
            className={`relative min-w-[17.5rem] flex-1 overflow-hidden transition-all duration-200 hover:shadow-md ${
              plan.popular && "border-primary/30"
            } ${isCurrentPlan && "ring-primary ring-2"}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground flex items-center gap-1 rounded-bl-lg px-3 py-1 text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
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
                    <CheckCircle2 className="text-primary mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="w-full">
                {isAccessible && expirationDate && (
                  <div className="bg-muted mb-4 rounded-md p-2 text-center text-xs">
                    You have access until{" "}
                    <span className="font-medium">
                      {formatExpirationDate(expirationDate)}
                    </span>
                  </div>
                )}

                {isCurrentPlan ? (
                  <Button className="w-full" disabled>
                    Current plan
                  </Button>
                ) : isAccessible ? (
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleSwitchPlan(
                        plan.id as "free" | "basic" | "professional",
                      )
                    }
                    disabled={isLoading[plan.id]}
                  >
                    {isLoading[plan.id] ? <Loading /> : "Switch to this plan"}
                  </Button>
                ) : (
                  plan.id !== "free" && (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(plan.priceId, plan.id)}
                      disabled={isLoading[plan.id]}
                    >
                      {isLoading[plan.id] ? <Loading /> : "Upgrade"}
                    </Button>
                  )
                )}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
