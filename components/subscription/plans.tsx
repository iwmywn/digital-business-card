"use client";

import { ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePlanStatus } from "@/lib/hooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { CurrentPlan } from "@/components/subscription/current-plan";
import { SubscriptionManagement } from "@/components/subscription/management";
import { SubscriptionPlansSkeleton } from "@/components/skeletons";

export function SubscriptionPlans() {
  const { isError, isLoading } = usePlanStatus();

  useEffect(() => {
    if (isError) toast.error(isError);
  }, [isError]);

  if (isLoading) {
    return <SubscriptionPlansSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Subscription Plans
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose the perfect plan for your business needs
        </p>
      </div>

      <Alert className="bg-muted/50 border-muted-foreground/20">
        <ShieldCheck className="h-5 w-5" />
        <AlertTitle>Privacy First</AlertTitle>
        <AlertDescription>
          Our service only requires one-time registration and doesn&apos;t store
          your personal information. Your privacy is our priority.
        </AlertDescription>
      </Alert>

      <CurrentPlan />
      <SubscriptionManagement />
    </div>
  );
}
