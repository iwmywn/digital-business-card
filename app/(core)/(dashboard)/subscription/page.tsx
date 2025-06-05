import type { Metadata } from "next";
import { SubscriptionManagement } from "@/components/subscription-management";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: "Manage your subscription plans.",
};

export default function page() {
  return <SubscriptionManagement />;
}
