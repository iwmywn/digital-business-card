"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { nav } from "@/components/app-sidebar";
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
import dynamic from "next/dynamic";

const other = [
  {
    title: "Settings",
    url: "/settings",
  },
  {
    title: "Payment Status",
    url: "/subscription/status",
  },
  {
    title: "Edit card",
    url: "/edit",
  },
  {
    title: "Notifications",
    url: "/notifications",
  },
];

export function Header() {
  const pathname = usePathname();

  const allNavItems = [...nav, ...other];
  const foundItem = allNavItems.find(
    (item) => item.url === pathname || pathname.startsWith(item.url),
  );

  const ColorDialog =
    process.env.NODE_ENV === "development"
      ? dynamic(
          () =>
            import("@/components/color-dialog").then((mod) => mod.ColorDialog),
          { ssr: false },
        )
      : () => null;

  return (
    <header className="bg-background/75 sticky top-0 z-50 flex shrink-0 items-center justify-between py-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {pathname === "/home" ? (
                <BreadcrumbPage>Home</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/home">Home</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {pathname !== "/home" && (
              <>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{foundItem?.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <ColorDialog />
        <ModeToggle />
      </div>
    </header>
  );
}
