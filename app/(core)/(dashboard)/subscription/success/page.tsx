import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";
import { verifyCheckoutSession } from "@/actions/stripe";

export function generateMetadata(): Metadata {
  return { title: "Payment Success" };
}

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const param = await searchParams;
  const session_id = param.session_id;
  if (!session_id) {
    redirect("/subscription");
  }

  const { success, error } = await verifyCheckoutSession(session_id);

  if (error || !success) {
    redirect("/subscription?error=invalid_session");
  }

  return (
    <Card
      className="justify-center rounded-lg"
      style={{ minHeight: "calc(100vh - 4.83rem)" }}
    >
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Payment Successful</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-center text-sm">
            Your subscription is now active. You can now enjoy all the premium
            features of your plan.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/subscription">Return to Subscription Plans</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
