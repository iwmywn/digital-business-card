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
import { useSubscription, useUser } from "@/lib/swr";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { formatDate } from "@/lib/utils";

export function SubscriptionPlans() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { basic, professional } = useSubscription();
  const { userResponse, user, mutate } = useUser();
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
      if (userResponse?.user) {
        mutate({
          ...userResponse,
          user: { ...userResponse.user, currentPlan: planId },
        });
      }
    }
    setIsLoading((prev) => ({ ...prev, [planId]: false }));
  }

  return (
    <div className="flex flex-col flex-wrap gap-6 min-[25rem]:flex-row">
      {subscriptionPlans.map((plan) => {
        const isCurrentPlan = user?.currentPlan === plan.id;
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
            className={`relative flex-1 overflow-hidden shadow-sm transition-all duration-200 min-[25rem]:min-w-[17.5rem] ${isCurrentPlan ? "ring-primary ring-1 ring-offset-1" : "hover:ring-primary hover:ring-1 hover:ring-offset-1"}`}
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
                    <CheckCircle2 className="text-primary mt-0.5 mr-2 size-4 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="w-full">
                {isAccessible && expirationDate && (
                  <div className="bg-muted mb-4 rounded-md p-2 text-center text-xs">
                    You have access until {formatDate(expirationDate, true)}
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
