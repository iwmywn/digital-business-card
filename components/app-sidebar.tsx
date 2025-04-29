"use client";

import * as React from "react";
import {
  User,
  BadgePlus,
  Kanban,
  ChartColumnIncreasing,
  CreditCard,
  CircleHelp,
  ReceiptText,
  GlobeLock,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export const nav = {
  navMain: [
    {
      title: "Information",
      url: "/info",
      icon: User,
    },
    {
      title: "Create Card",
      url: "/create",
      icon: BadgePlus,
    },
    {
      title: "Manage Cards",
      url: "/manage",
      icon: Kanban,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: ChartColumnIncreasing,
    },
    {
      title: "Payment Management",
      url: "/payment",
      icon: CreditCard,
    },
  ],
  navSecondary: [
    {
      title: "FAQ",
      url: "/faq",
      icon: CircleHelp,
    },
    {
      title: "Terms of Service",
      url: "/terms",
      icon: ReceiptText,
    },
    {
      title: "Privacy Policy",
      url: "/privacy",
      icon: GlobeLock,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="pr-0 group-data-[state=collapsed]:pr-[0.5625rem]"
      variant="floating"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Eznect Home">
              <Link href="/home">
                <Image
                  src="/images/logo.png"
                  alt="EZNECT"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EZNECT</span>
                  <span className="truncate text-xs">Premium</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Nav navMain={nav.navMain} navSecondary={nav.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
