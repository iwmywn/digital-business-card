import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-2 peer-data-[state=collapsed]:pl-0">
        <div
          className="h-full overflow-y-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--primary-foreground)] p-2 pt-0 shadow-sm"
          style={{ maxHeight: "calc(100vh - 1rem)" }}
        >
          <Header />
          <section>{children}</section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
