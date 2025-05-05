"use client";

import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subscriptionPlans } from "@/constants";
import { useSubscription } from "@/lib/hooks";

export function CurrentPlan() {
  const { currentPlan } = useSubscription();
  const selectedPlan =
    subscriptionPlans.find((plan) => plan.id === currentPlan) ||
    subscriptionPlans[0];

  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              {selectedPlan.name} Plan
            </CardTitle>
            <CardDescription className="mt-1">
              {selectedPlan.price === 0
                ? "Free forever"
                : `$${selectedPlan.price.toFixed(2)} / month`}
            </CardDescription>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-6 w-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <h4 className="mb-2 font-medium">Included features:</h4>
          <ul className="grid gap-1">
            {selectedPlan.features.map((feature: string) => (
              <li key={feature} className="flex items-center text-sm">
                <CheckCircle2 className="text-primary mr-2 h-4 w-4 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
