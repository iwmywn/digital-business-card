"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const paymentFormSchema = z.object({
  cardName: z.string().min(2, { message: "Name on card is required." }),
  cardNumber: z.string().regex(/^\d{16}$/, {
    message: "Please enter a valid 16-digit card number.",
  }),
  expiryMonth: z.string().min(1, { message: "Expiry month is required." }),
  expiryYear: z.string().min(1, { message: "Expiry year is required." }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "Please enter a valid CVV." }),
  saveCard: z.boolean(),
});

const billingFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipCode: z.string().min(5, { message: "ZIP code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;
type BillingFormValues = z.infer<typeof billingFormSchema>;

// Mock data for invoices
const invoices = [
  {
    id: "INV-001",
    date: "2024-04-01",
    amount: 19.99,
    status: "paid",
    plan: "Professional Plan",
  },
  {
    id: "INV-002",
    date: "2024-03-01",
    amount: 19.99,
    status: "paid",
    plan: "Professional Plan",
  },
  {
    id: "INV-003",
    date: "2024-02-01",
    amount: 19.99,
    status: "paid",
    plan: "Professional Plan",
  },
  {
    id: "INV-004",
    date: "2024-01-01",
    amount: 9.99,
    status: "paid",
    plan: "Basic Plan",
  },
  {
    id: "INV-005",
    date: "2023-12-01",
    amount: 9.99,
    status: "paid",
    plan: "Basic Plan",
  },
];

// Mock data for subscription plans
const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "1 digital business card",
      "Basic analytics",
      "Standard templates",
      "QR code sharing",
    ],
    popular: false,
  },
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    features: [
      "5 digital business cards",
      "Advanced analytics",
      "Premium templates",
      "QR code customization",
      "Remove branding",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 19.99,
    features: [
      "Unlimited digital business cards",
      "Comprehensive analytics",
      "All premium templates",
      "Custom domain",
      "Priority support",
      "Team management",
    ],
    popular: true,
  },
];

export function PaymentManagement() {
  const [activeTab, setActiveTab] = useState("subscription");
  const [currentPlan, setCurrentPlan] = useState("professional");

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      saveCard: true,
    },
  });

  const billingForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  });

  function onPaymentSubmit(data: PaymentFormValues) {
    toast.success("Payment method updated successfully");
    console.log(data);
  }

  function onBillingSubmit(data: BillingFormValues) {
    toast.success("Billing information updated successfully");
    console.log(data);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  function changePlan(planId: string) {
    setCurrentPlan(planId);
    toast.success(
      `Subscription changed to ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
    );
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString(),
      label: month.toString().padStart(2, "0"),
    };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment & Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and billing information.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-6 pt-4">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the{" "}
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}{" "}
                plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-medium">
                    {
                      subscriptionPlans.find((plan) => plan.id === currentPlan)
                        ?.name
                    }{" "}
                    Plan
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Billed monthly • Next billing date: May 1, 2024
                  </p>
                </div>
                <div className="text-xl font-bold">
                  $
                  {subscriptionPlans
                    .find((plan) => plan.id === currentPlan)
                    ?.price.toFixed(2)}
                  /mo
                </div>
              </div>

              <div className="pt-4">
                <h4 className="mb-2 text-sm font-medium">Plan Features:</h4>
                <ul className="space-y-2">
                  {subscriptionPlans
                    .find((plan) => plan.id === currentPlan)
                    ?.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative overflow-hidden rounded-lg",
                  plan.popular && "border-red-500",
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-tl-none rounded-tr-lg rounded-br-none rounded-bl-lg bg-red-500">
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.price === 0
                      ? "Free forever"
                      : `$${plan.price.toFixed(2)} per month`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={cn(
                      "w-full",
                      plan.id === currentPlan
                        ? "bg-muted hover:bg-muted"
                        : "bg-red-500 hover:bg-red-600",
                    )}
                    disabled={plan.id === currentPlan}
                    onClick={() => changePlan(plan.id)}
                  >
                    {plan.id === currentPlan ? "Current Plan" : "Switch Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6 pt-4">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Add or update your payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted rounded-md p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Visa ending in 4242</p>
                      <p className="text-muted-foreground text-sm">
                        Expires 04/2025
                      </p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Add New Payment Method</h3>
                <p className="text-muted-foreground text-sm">
                  Add a new credit or debit card to your account.
                </p>
              </div>

              <Form {...paymentForm}>
                <form
                  onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={paymentForm.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={paymentForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={paymentForm.control}
                      name="expiryMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Month</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem
                                  key={month.value}
                                  value={month.value}
                                >
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="expiryYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Year</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="YYYY" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                  {year.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={paymentForm.control}
                    name="saveCard"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Save Card</FormLabel>
                          <FormDescription>
                            Save this card for future payments.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted/50 flex items-center rounded-lg p-4">
                    <Shield className="text-muted-foreground mr-2 h-5 w-5" />
                    <p className="text-muted-foreground text-sm">
                      Your payment information is encrypted and secure. We never
                      store your full card details.
                    </p>
                  </div>

                  <Button type="submit" className="bg-red-500 hover:bg-red-600">
                    Add Payment Method
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-lg md:col-span-2">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download your past invoices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-muted rounded-md p-2">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{invoice.plan}</p>
                          <p className="text-muted-foreground text-sm">
                            {formatDate(invoice.date)} • {invoice.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">
                          ${invoice.amount.toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Update your billing details.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...billingForm}>
                  <form
                    onSubmit={billingForm.handleSubmit(onBillingSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={billingForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={billingForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john.doe@example.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={billingForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={billingForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billingForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={billingForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billingForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="United States" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Update Billing Information
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
