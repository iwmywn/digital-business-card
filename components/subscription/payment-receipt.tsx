"use client";

import { format } from "date-fns";
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

export function PaymentReceipt({ receiptData }: { receiptData: ReceiptData }) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM dd, yyyy 'at' h:mm a");
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
    <Card className="rounded-lg text-sm">
      <CardHeader>
        <div className="">
          <p>Transaction ID: {receiptData.paymentIntent.id}</p>
          <p>Date: {formatDate(receiptData.paymentIntent.created)}</p>
        </div>
        <Badge
          className={`capitalize ${getStatusColor(receiptData.paymentIntent.status)}`}
        >
          {receiptData.paymentIntent.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <h3 className="font-medium">Customer Information</h3>
            </div>
            <div className="rounded-md border p-3">
              <p>{receiptData.customer.name}</p>
              <p>{receiptData.customer.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <h3 className="font-medium">Billing Address</h3>
            </div>
            <div className="rounded-md border p-3">
              <p>{receiptData.customer.address.line1}</p>
              {receiptData.customer.address.line2 && (
                <p>{receiptData.customer.address.line2}</p>
              )}
              <p>
                {receiptData.customer.address.city},{" "}
                {receiptData.customer.address.state}{" "}
                {receiptData.customer.address.postal_code}
              </p>
              <p>{receiptData.customer.address.country}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <h3 className="font-medium">Payment Method</h3>
          </div>
          <div className="rounded-md border p-3">
            <p className="capitalize">
              {receiptData.paymentMethod.card.brand} ••••{" "}
              {receiptData.paymentMethod.card.last4}
            </p>
            <p>
              Expires: {receiptData.paymentMethod.card.expMonth}/
              {receiptData.paymentMethod.card.expYear}
            </p>
          </div>
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
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receiptData.lineItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
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
          If you have any questions about this receipt, please contact our
          customer support.
        </p>
        <p>Thank you for your business!</p>
      </CardFooter>
    </Card>
  );
}
