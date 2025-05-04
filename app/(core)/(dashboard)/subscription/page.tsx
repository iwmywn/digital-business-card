import type { Metadata } from "next";
import { SubscriptionPlans } from "@/components/subscription/plans";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: "Manage your subscription plans.",
};

export default function page() {
  return <SubscriptionPlans />;
}
