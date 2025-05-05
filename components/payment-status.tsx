import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldAlert, XCircle } from "lucide-react";
import Link from "next/link";

function PaymentStatusUI({
  icon,
  iconColor,
  iconBg,
  title,
  message,
}: {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  message: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center p-6 text-center"
      style={{ minHeight: "calc(100vh - 4.83rem)" }}
    >
      <div className={`mb-4 rounded-full p-3 ${iconBg}`}>
        <div className={`${iconColor}`}>{icon}</div>
      </div>
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button asChild>
          <Link href="/subscription">Return to Subscription</Link>
        </Button>
      </div>
    </div>
  );
}

export function PaymentSuccessUI() {
  return (
    <PaymentStatusUI
      icon={<CheckCircle />}
      iconColor="text-green-600"
      iconBg="bg-green-100"
      title="Payment Successful!"
      message="Your subscription is active. Thank you for your payment."
    />
  );
}

export function UnauthorizedAccessUI() {
  return (
    <PaymentStatusUI
      icon={<ShieldAlert />}
      iconColor="text-red-600"
      iconBg="bg-red-100"
      title="Unauthorized Access"
      message="This payment session belongs to another user account. If you believe this is a mistake, please sign in with the correct account."
    />
  );
}

export function PaymentErrorUI({ errorMessage }: { errorMessage?: string }) {
  return (
    <PaymentStatusUI
      icon={<XCircle />}
      iconColor="text-red-600"
      iconBg="bg-red-100"
      title="Payment Verification Failed"
      message={
        <>
          If you believe this is a mistake and your payment was processed,
          please contact customer support with your transaction details.
          {errorMessage && ` (${errorMessage})`}
        </>
      }
    />
  );
}
