"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContactDialog } from "@/components/contact-dialog";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavProps {
  navMain: NavItem[];
  navSecondary: NavItem[];
}

export function Nav({ navMain, navSecondary }: NavProps) {
  const pathname = usePathname();

  const renderMenu = (
    items: NavItem[],
    size?: "default" | "sm" | "lg" | null,
  ) => (
    <>
      {items.map((item) => {
        const isActive = pathname === item.url;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              size={size}
              tooltip={item.title}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>{renderMenu(navMain)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            {renderMenu(navSecondary)}
            <ContactDialog />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
