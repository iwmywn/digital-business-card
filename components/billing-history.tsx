"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Loader2, Receipt, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentReceipt } from "@/components/payment-receipt";
import { getPaymentHistoryDetails } from "@/actions/user";
import { toast } from "sonner";
import { ReceiptData } from "@/components/payment-receipt";
import { useSubscription } from "@/lib/hooks";

export function BillingHistory() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isReceiptLoading, setIsReceiptLoading] = useState<boolean>(false);
  const { paymentHistory } = useSubscription();
  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") return paymentHistory;
    return paymentHistory.filter(
      (payment) =>
        payment.paymentIntentId.toLowerCase().includes(query) ||
        payment.planId.toLowerCase().includes(query) ||
        payment.status.toLowerCase().includes(query),
    );
  }, [searchQuery, paymentHistory]);

  const handleViewReceipt = async (paymentIntentId: string) => {
    setSelectedPayment(paymentIntentId);
    setIsReceiptLoading(true);

    try {
      const result = await getPaymentHistoryDetails(paymentIntentId);
      if (result.data) {
        setReceiptData(result.data);
      } else {
        toast.error(result.error || "Failed to load receipt details");
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error("Error fetching receipt details:", error);
      toast.error("An error occurred while loading receipt details");
      setSelectedPayment(null);
    } finally {
      setIsReceiptLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-400";
      case "processing":
        return "bg-yellow-400";
      case "requires_payment_method":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <>
      <Card className="rounded-lg">
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your payment history and receipts
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
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
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
              <Receipt className="h-10 w-10 text-gray-400" />
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-sm text-gray-500">
                {paymentHistory.length === 0
                  ? "You haven't made any payments yet."
                  : "No transactions match your search criteria."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell>{payment.paymentIntentId}</TableCell>
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
                        View Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={selectedPayment !== null}
        onOpenChange={(open) => !open && setSelectedPayment(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Payment Receipt</DialogTitle>
            <DialogDescription>
              Details of your subscription payment
            </DialogDescription>
          </DialogHeader>
          {isReceiptLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            receiptData && <PaymentReceipt receiptData={receiptData} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
