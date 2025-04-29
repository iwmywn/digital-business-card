import type { Metadata } from "next";
import { PaymentManagement } from "@/components/payment-management";

export const metadata: Metadata = {
  title: "Payment & Billing",
  description:
    "Manage your subscription, payment methods, and billing information.",
};

export default function PaymentPage() {
  return <PaymentManagement />;
}
