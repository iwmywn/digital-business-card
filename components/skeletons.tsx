import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@radix-ui/react-avatar";

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
