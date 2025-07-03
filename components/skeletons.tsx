"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDynamicHeightAuto } from "@/hooks/use-dynamic-height-auto";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";

export function ThemeToggleSkeleton() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="size-7 rounded-sm" />
      ))}
    </>
  );
}

export function UserSkeleton() {
  return (
    <SidebarMenuButton size="lg" disabled>
      <Avatar className="size-8 rounded-lg">
        <Skeleton className="h-full w-full rounded-lg" />
      </Avatar>
      <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="ml-auto size-4" />
    </SidebarMenuButton>
  );
}

export function CardSkeleton() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-xl shadow-sm">
        <Skeleton className="relative aspect-2/1 w-full rounded-none" />
        <div className="bg-background/15 relative space-y-4 p-6">
          <Skeleton className="absolute top-[-3.125rem] left-6 h-25 w-25 rounded-full shadow-md" />
          <Skeleton className="absolute -top-8 right-6 h-16 w-16 rounded-lg shadow-md" />

          <div className="mt-10 w-full space-y-2">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-5 w-1/2 rounded" />
            <Skeleton className="h-5 w-1/3 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>

          <Separator className="bg-primary-foreground/5" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
          </div>

          <Separator className="bg-primary-foreground/5" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>

          <Separator className="bg-primary-foreground/5" />

          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="w-full space-y-1">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/10 flex items-center justify-between px-4 py-3">
          <Skeleton className="bg-primary/10 h-4 w-1/4 rounded" />
          <div className="flex gap-2">
            <Skeleton className="bg-primary/10 size-8 rounded-md" />
            <Skeleton className="bg-primary/10 size-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreateCardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>

          <Card className="rounded-lg">
            <CardContent>
              <Skeleton className="mb-3 h-5 w-28" />

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton
                        className={`${
                          i === 0
                            ? "h-20 w-20 rounded-md"
                            : i === 1
                              ? "h-20 w-20 rounded-full"
                              : "h-20 w-40 rounded-md"
                        }`}
                      />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6 space-y-3">
                <Skeleton className="h-5 w-20" />
                <div className="flex flex-wrap gap-3">
                  {[...Array(23)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-12 rounded-md" />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-[3.75rem] space-y-4">
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardManagementSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full rounded-md sm:w-40" />
      </div>

      <div className="flex items-center">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-lg pt-0">
            <div className="h-52">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { registerRef, calculatedHeight } = useDynamicHeightAuto();

  return (
    <div className="space-y-6">
      <div
        ref={registerRef}
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-9 rounded-md sm:w-[180px]" />
          <Skeleton className="h-9 rounded-md sm:w-[180px]" />
        </div>
      </div>

      <div ref={registerRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card className="rounded-lg" key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-4 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-lg">
        <CardHeader ref={registerRef}>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton
            className="w-full rounded-md"
            style={{
              height: isMobile
                ? "250px"
                : `calc(100vh - ${calculatedHeight}px - 12.4375rem)`,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function SubscriptionPlansSkeleton() {
  const { registerRef, calculatedHeight } = useDynamicHeightAuto();
  return (
    <div className="space-y-6">
      <div ref={registerRef} className="space-y-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div ref={registerRef} className="flex items-start gap-4">
        <Skeleton className="size-5 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div ref={registerRef} className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-1/2" />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex min-w-[17.5rem] flex-1 flex-col space-y-4 rounded-lg border p-4 shadow-sm"
            style={{
              minHeight: `calc(100vh - ${calculatedHeight}px - 9.4375rem)`,
            }}
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              {[...Array(6)].map((_, j) => (
                <Skeleton key={j} className="h-3 w-3/4" />
              ))}
            </div>
            <Skeleton className="mt-auto h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentReceiptDialogSkeleton() {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </DialogTitle>
        <DialogDescription asChild>
          <div>
            <Skeleton className="h-4 w-64" />
          </div>
        </DialogDescription>
      </DialogHeader>

      <Card className="rounded-lg text-sm">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="ml-auto h-4 w-24" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-36" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-1 h-4 w-full" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="ml-auto h-4 w-24" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-center">
                    <Skeleton className="mx-auto h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-6" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-12" />
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell />
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 text-xs text-gray-500">
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-3 w-40" />
        </CardFooter>
      </Card>
    </>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <InformationSkeleton />
      <AccountSkeleton />
      <NotificationPreferencesSkeleton />
    </div>
  );
}

function InformationSkeleton() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-12">
            <div className="flex w-40 flex-col items-center gap-2">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex w-40 flex-col items-center gap-2">
              <Skeleton className="h-20 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-24 w-full" />

            <div className="flex flex-row-reverse gap-2">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountSkeleton() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />

          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />

          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>

          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="flex flex-row-reverse">
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationPreferencesSkeleton() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-row items-start space-x-3 rounded-md border p-4"
          >
            <Skeleton className="size-5 rounded-sm" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        ))}
        <div className="flex flex-row-reverse">
          <Skeleton className="h-10 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-xl overflow-hidden rounded-lg border-none pt-0">
        <div className="bg-foreground/15 aspect-2/1">
          <Skeleton className="h-full w-full" />
        </div>

        <CardHeader className="relative pt-0 pb-0">
          <div className="-mt-16 flex flex-col items-center md:-mt-20">
            <Skeleton className="h-32 w-32 rounded-full md:h-40 md:w-40" />

            <div className="mt-4 space-y-2 text-center">
              <div className="mx-auto h-6 w-48 rounded-md">
                <Skeleton className="mx-auto h-6 w-48" />
              </div>
              <div className="mx-auto h-4 w-32">
                <Skeleton className="mx-auto h-4 w-32" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-2 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Separator className="bg-primary-foreground/5" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
