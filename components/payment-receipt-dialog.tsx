"use client";

import { CreditCard, FileText, MapPin, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type Stripe from "stripe";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetStateAction } from "react";
import { PaymentReceiptDialogSkeleton } from "@/components/skeletons";
import { formatDate } from "@/lib/utils";

export interface ReceiptData {
  paymentIntent: {
    id: string;
    amount: number;
    status: Stripe.PaymentIntent.Status;
    created: string;
  };
  customer: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  paymentMethod: {
    type: string;
    card: {
      brand: string;
      last4: string;
      expMonth: string;
      expYear: string;
    };
  };
  lineItems: {
    description: string | null;
    quantity: number | null;
    amount: number;
  }[];
}

interface PaymentReceiptProps {
  selectedPayment: string | null;
  setSelectedPayment: (value: SetStateAction<string | null>) => void;
  isReceiptLoading: boolean;
  receiptData: ReceiptData | null;
}

export function PaymentReceiptDialog({
  selectedPayment,
  setSelectedPayment,
  isReceiptLoading,
  receiptData,
}: PaymentReceiptProps) {
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
      <Dialog
        open={selectedPayment !== null}
        onOpenChange={(open) => !open && setSelectedPayment(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {isReceiptLoading ? (
            <PaymentReceiptDialogSkeleton />
          ) : (
            receiptData && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl max-sm:justify-center">
                    Payment Receipt
                    <Badge
                      className={`capitalize ${getStatusColor(receiptData.paymentIntent.status)}`}
                    >
                      {receiptData.paymentIntent.status}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Details of your subscription payment.
                  </DialogDescription>
                </DialogHeader>

                <Card className="rounded-lg text-sm">
                  <CardHeader>
                    <div>
                      <p>
                        Transaction ID: {receiptData.paymentIntent.id.slice(3)}
                      </p>
                      <p>
                        Date:{" "}
                        {formatDate(receiptData.paymentIntent.created, true)}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <h3 className="font-medium">Customer Information</h3>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Email</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>{receiptData.customer.name}</TableCell>
                            <TableCell className="text-right">
                              {receiptData.customer.email}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <h3 className="font-medium">Billing Address</h3>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Address</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="whitespace-normal">
                              {receiptData.customer.address.line1 && (
                                <span>
                                  {receiptData.customer.address.line1},{" "}
                                </span>
                              )}

                              {receiptData.customer.address.line2 && (
                                <span>
                                  {receiptData.customer.address.line2},{" "}
                                </span>
                              )}

                              {receiptData.customer.address.city && (
                                <span>
                                  {receiptData.customer.address.city},{" "}
                                </span>
                              )}

                              {receiptData.customer.address.state && (
                                <span>
                                  {receiptData.customer.address.state},{" "}
                                </span>
                              )}

                              {receiptData.customer.address.postal_code && (
                                <span>
                                  {receiptData.customer.address.postal_code}
                                  ,{" "}
                                </span>
                              )}

                              {receiptData.customer.address.country && (
                                <span>
                                  {receiptData.customer.address.country}.
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <h3 className="font-medium">Payment Method</h3>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Card</TableHead>
                            <TableHead className="text-right">
                              Expiration
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="capitalize">
                              {receiptData.paymentMethod.card.brand} ••••{" "}
                              {receiptData.paymentMethod.card.last4}
                            </TableCell>
                            <TableCell className="text-right">
                              {receiptData.paymentMethod.card.expMonth}-
                              {receiptData.paymentMethod.card.expYear}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <h3 className="font-medium">Order Summary</h3>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50%]">Item</TableHead>
                            <TableHead className="text-center">
                              Quantity
                            </TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {receiptData.lineItems.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-center">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                ${item.amount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell />
                            <TableCell className="text-center">Total</TableCell>
                            <TableCell className="text-right">
                              ${receiptData.paymentIntent.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col items-start gap-2 text-xs text-gray-500">
                    <p>
                      If you have any questions about this receipt, please
                      contact our customer support.
                    </p>
                    <p>Thank you for your business!</p>
                  </CardFooter>
                </Card>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
