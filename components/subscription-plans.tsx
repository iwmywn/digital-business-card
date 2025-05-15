"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/lib/swr";
import { useEffect } from "react";
import { toast } from "sonner";
import { CurrentPlan } from "@/components/current-plan";
import { SubscriptionManagement } from "@/components/subscription-management";
import { BillingHistory } from "@/components/billing-history";
import { SubscriptionPlansSkeleton } from "@/components/skeletons";

export function SubscriptionPlans() {
  const { isSubScriptionLoading, isSubscriptionError } = useSubscription();
  const [activeTab, setActiveTab] = useState<string>("plans");

  useEffect(() => {
    if (isSubscriptionError) toast.error(isSubscriptionError);
  }, [isSubscriptionError]);

  if (isSubScriptionLoading) {
    return <SubscriptionPlansSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Subscription Plans</h2>
        <p className="text-muted-foreground text-sm">
          Manage your subscription plans and billing history
        </p>
      </div>

      <Alert>
        <ShieldCheck />
        <AlertTitle>Secure Payments</AlertTitle>
        <AlertDescription>
          Our service only requires a one-time registration and doesn&apos;t
          store your card details on its servers. Your payment information is
          securely processed by Stripe, ensuring maximum protection for your
          financial data.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>
        <TabsContent value="plans" className="space-y-6 pt-4">
          <CurrentPlan />
          <SubscriptionManagement />
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <BillingHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
