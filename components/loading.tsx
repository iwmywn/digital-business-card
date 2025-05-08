import { cn } from "@/lib/utils";

export function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-primary-foreground border-t-primary/10 mx-auto h-4 w-4 animate-spin rounded-full border-4",
        className,
      )}
    />
  );
}
