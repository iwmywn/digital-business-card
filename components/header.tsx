"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { data } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const allNavItems = [...data.nav.navMain, ...data.nav.navSecondary];
  const foundItem = allNavItems.find((item) => item.url === pathname);

  return (
    <header className="sticky top-0 z-100 flex shrink-0 items-center justify-between bg-(--primary-foreground)/75 py-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {pathname === "/" ? (
                <BreadcrumbPage>Home</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {pathname !== "/" && (
              <>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {foundItem ? foundItem.title : "Not found"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ModeToggle />
    </header>
  );
}
