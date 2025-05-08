import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface NotFoundUIProps {
  icon: ReactNode;
  title: string;
  message: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}

export function NotFoundUI({
  icon,
  title,
  message,
  linkHref,
  linkLabel,
  className,
}: NotFoundUIProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg px-6 py-12 text-center md:px-16",
        className,
      )}
    >
      <div className="bg-secondary rounded-full p-3">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-400">{message}</p>
      {linkHref && linkLabel && (
        <Button asChild>
          <Link href={linkHref} className="mt-2">
            {linkLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
