import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HTMLAttributes, ReactNode } from "react";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  title: string;
  message: string;
  children?: ReactNode;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  children,
  linkHref,
  linkLabel,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 text-center md:px-16",
        className,
      )}
      {...props}
    >
      <div className="bg-secondary rounded-full p-3">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-400">{message}</p>
      {linkHref && linkLabel && (
        <Button className="mt-2" asChild>
          <Link href={linkHref}>{linkLabel}</Link>
        </Button>
      )}
      {children && children}
    </div>
  );
}
