"use client";

import {
  BadgePlus,
  Kanban,
  ChartColumnIncreasing,
  CreditCard,
} from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useSubscription, useUser } from "@/lib/swr";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { toast } from "sonner";

export const nav = [
  {
    title: "Create Card",
    url: "/create",
    icon: BadgePlus,
  },
  {
    title: "Card Management",
    url: "/management",
    icon: Kanban,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Subscription Plans",
    url: "/subscription",
    icon: CreditCard,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isSubScriptionLoading, isSubscriptionError } = useSubscription();
  const { user, isUserLoading, isUserError } = useUser();

  useEffect(() => {
    if (isUserError && !isUserLoading) toast.error(isUserError);
    if (isSubscriptionError && !isSubScriptionLoading)
      toast.error(isSubscriptionError);
  }, [isUserError, isSubscriptionError, isUserLoading, isSubScriptionLoading]);

  return (
    <Sidebar
      className="pr-0 group-data-[state=collapsed]:pr-[0.5625rem]"
      variant="floating"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenuButton size="lg" tooltip="Visiq Home" asChild>
          <Link href="/home">
            <Image
              src="/images/logo.png"
              alt="Visiq Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Visiq</span>
              {isSubScriptionLoading || isUserLoading ? (
                <Skeleton className="h-3 w-24" />
              ) : (
                <span className="truncate text-xs capitalize">
                  {user?.currentPlan}
                </span>
              )}
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <Nav nav={nav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
