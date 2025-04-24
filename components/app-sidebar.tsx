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

export const data = {
  user: {
    name: "iwmywn",
    email: "user@nextmail.com",
    avatar: "/avatars/iwmywn.jpeg",
  },
  nav: {
    navMain: [
      {
        title: "Information",
        url: "/info",
        icon: User,
        // isActive: true,
      },
      {
        title: "Create Card",
        url: "/create-card",
        icon: BadgePlus,
      },
      {
        title: "Manage Cards",
        url: "/manage-cards",
        icon: Kanban,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: ChartColumnIncreasing,
      },
      {
        title: "Payment Management",
        url: "/payments",
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
        url: "/terms-of-service",
        icon: ReceiptText,
      },
      {
        title: "Privacy Policy",
        url: "/privacy-policy",
        icon: GlobeLock,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="EZNECT"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EZNECT</span>
                  <span className="truncate text-xs">Free</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Nav navMain={data.nav.navMain} navSecondary={data.nav.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
