import Link from "next/link"
import { CheckCircle, ShieldAlert, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

function PaymentStatusUI({
  icon,
  iconColor,
  iconBg,
  title,
  message,
}: {
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  title: string
  message: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-4.83rem)] flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 text-center md:px-16">
      <div className={`rounded-full p-3 ${iconBg}`}>
        <div className={`${iconColor}`}>{icon}</div>
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p>{message}</p>
      <Button asChild>
        <Link href="/subscription">Return to subscription</Link>
      </Button>
    </div>
  )
}

export function PaymentSuccessUI({
  successMessage,
}: {
  successMessage: string
}) {
  return (
    <PaymentStatusUI
      icon={<CheckCircle />}
      iconColor="text-green-600"
      iconBg="bg-green-100"
      title="Payment Successful!"
      message={successMessage}
    />
  )
}

export function UnauthorizedAccessUI() {
  return (
    <PaymentStatusUI
      icon={<ShieldAlert />}
      iconColor="text-red-600"
      iconBg="bg-red-100"
      title="Unauthorized Access"
      message="This payment session belongs to another user account. If you believe this is a mistake, please contact our customer support."
    />
  )
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
  )
}
