import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UserSkeleton() {
  return (
    <SidebarMenuButton size="lg" disabled>
      <Avatar className="h-8 w-8 rounded-lg">
        <Skeleton className="h-full w-full rounded-lg" />
      </Avatar>
      <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="ml-auto h-4 w-4" />
    </SidebarMenuButton>
  );
}

export function SubscriptionPlansSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex items-start gap-4">
        <Skeleton className="h-5 w-5 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-1/2" />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="min-w-[17.5rem] flex-1 space-y-4 rounded-lg border p-4 shadow-sm"
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-3 w-3/4" />
              ))}
            </div>
            <Skeleton className="mt-4 h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BillingHistorySkeleton() {
  return (
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
            <Skeleton className="absolute top-2.5 left-2.5 h-4 w-4" />
            <Skeleton className="h-9 w-full rounded-md pl-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="table-auto">
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
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-8 w-24 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
