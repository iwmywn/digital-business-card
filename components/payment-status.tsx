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
    <div className="flex min-h-[calc(100vh-4.83rem)] flex-col items-center justify-center gap-2 px-6 text-center md:px-16">
      <div className={`rounded-full p-3 ${iconBg}`}>
        <div className={`${iconColor}`}>{icon}</div>
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p>{message}</p>
      <Button asChild>
        <Link href="/subscription">Return to Subscription</Link>
      </Button>
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
