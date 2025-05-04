import { redirect } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";
import { verifyCheckoutSession } from "@/actions/stripe";

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

  const { success, error, alreadyProcessed } =
    await verifyCheckoutSession(sessionId);

  if (error || !success) {
    return <PaymentErrorUI />;
  }

  return <PaymentSuccessUI alreadyProcessed={alreadyProcessed} />;
}

function PaymentSuccessUI({
  alreadyProcessed,
}: {
  alreadyProcessed?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-green-100 p-3">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
      <p className="text-muted-foreground mb-6">
        {alreadyProcessed
          ? "Your payment has already been processed. No changes were made."
          : "Your subscription has been activated successfully."}
      </p>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button asChild>
          <Link href="/subscription">Return to Subscription</Link>
        </Button>
      </div>
    </div>
  );
}

function PaymentErrorUI() {
  return (
    <Card
      className="justify-center rounded-lg"
      style={{ minHeight: "calc(100vh - 4.83rem)" }}
    >
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <CardTitle className="text-2xl">Payment Verification Failed</CardTitle>
        <CardDescription className="text-red-500">
          We couldn&apos;t verify your payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
          <p className="text-center text-sm">
            The payment session is invalid or has expired.
          </p>
          <p className="mt-2 text-center text-sm">
            If you believe this is a mistake and your payment was processed,
            please contact customer support with your transaction details.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/subscription">Return to Subscription Plans</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/support">Contact Support</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
