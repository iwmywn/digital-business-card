"use client"

import type { HTMLAttributes } from "react"
import { useMemo, useState } from "react"
import { Receipt, Search } from "lucide-react"
import { toast } from "sonner"

import { getPaymentHistoryDetails } from "@/actions/plan"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateIcon,
} from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ReceiptData } from "@/components/subscription/payment-receipt-dialog"
import { PaymentReceiptDialog } from "@/components/subscription/payment-receipt-dialog"
import { useDynamicHeightAuto } from "@/hooks/use-dynamic-height-auto"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useSubscription } from "@/lib/swr"
import { formatDate } from "@/lib/utils"

interface BillingHistoryProps extends HTMLAttributes<HTMLDivElement> {
  calculatedHeight: number
}

export function BillingHistory({
  calculatedHeight,
  ...props
}: BillingHistoryProps) {
  const isMobile = useMediaQuery("(max-width: 767px)")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [isReceiptLoading, setIsReceiptLoading] = useState<boolean>(false)
  const { paymentHistory } = useSubscription()
  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (query === "") return paymentHistory
    return paymentHistory.filter(
      (payment) =>
        payment.paymentIntentId.toLowerCase().includes(query) ||
        payment.planId.toLowerCase().includes(query) ||
        payment.status.toLowerCase().includes(query)
    )
  }, [searchQuery, paymentHistory])
  const { registerRef, calculatedHeight: calculatedBillingHistoryHeight } =
    useDynamicHeightAuto()

  const handleViewReceipt = async (paymentIntentId: string) => {
    setSelectedPayment(paymentIntentId)
    setIsReceiptLoading(true)

    const { data, error } = await getPaymentHistoryDetails(paymentIntentId)

    if (error || !data) {
      toast.error(error)
      setSelectedPayment(null)
    } else {
      setReceiptData(data)
    }

    setIsReceiptLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-400"
      case "processing":
        return "bg-yellow-400"
      case "requires_payment_method":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <>
      <Card className="rounded-lg" {...props}>
        <CardHeader ref={registerRef}>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-lg">Billing History</CardTitle>
              <CardDescription>
                View your payment history and receipts.
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-2.5 left-2.5 size-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <EmptyState
              className="border border-dashed"
              style={{
                minHeight: isMobile
                  ? "250px"
                  : `calc(100vh - ${calculatedHeight}px - ${calculatedBillingHistoryHeight}px - 13.9375rem)`,
              }}
            >
              <EmptyStateIcon>
                <Receipt />
              </EmptyStateIcon>
              <EmptyStateHeader>NO TRANSACTIONS FOUND</EmptyStateHeader>
              <EmptyStateDescription>
                {paymentHistory.length === 0
                  ? "You haven't made any payments yet."
                  : "We couldn't find any transactions matching your search. Try a different search term."}
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            <div
              className="overflow-auto [&>div]:overflow-x-visible!"
              style={{
                height: `calc(100vh - ${calculatedHeight}px - ${calculatedBillingHistoryHeight}px - 13.9375rem)`,
              }}
            >
              <Table>
                <TableHeader>
                  <TableRow className="[&_th]:bg-card [&_th]:sticky [&_th]:top-0">
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((payment) => (
                    <TableRow key={payment.paymentIntentId}>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell>{payment.paymentIntentId.slice(3)}</TableCell>
                      <TableCell className="capitalize">
                        {payment.planId} plan
                      </TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize ${getStatusColor(payment.status)}`}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleViewReceipt(payment.paymentIntentId)
                          }
                        >
                          View receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentReceiptDialog
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        isReceiptLoading={isReceiptLoading}
        receiptData={receiptData}
      />
    </>
  )
}
