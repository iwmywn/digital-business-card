import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { verifyCheckoutSession } from "@/actions/stripe";
import {
  PaymentErrorUI,
  PaymentSuccessUI,
  UnauthorizedAccessUI,
} from "@/components/subscription/status";

export function generateMetadata(): Metadata {
  return { title: "Payment Status" };
}

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const param = await searchParams;
  const sessionId = param.session_id;
  if (!sessionId) {
    redirect("/subscription");
  }

  const { error } = await verifyCheckoutSession(sessionId);

  if (error) {
    if (error === "unauthorized_access") {
      return <UnauthorizedAccessUI />;
    }
    return <PaymentErrorUI errorMessage={error} />;
  }

  return <PaymentSuccessUI />;
}
