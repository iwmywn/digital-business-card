import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

interface FormLinkProps extends LinkProps {
  side?: "none" | "left" | "right" | "center";
  children: ReactNode;
  className?: string;
}

export function FormLink({
  href,
  side = "none",
  children,
  className,
  ...props
}: FormLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative w-fit text-sm after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[1px] after:origin-center after:scale-x-0 after:bg-black after:transition-all after:duration-500 hover:after:scale-x-100 dark:after:bg-white",
        side === "left" && "mr-auto",
        side === "right" && "ml-auto",
        side === "center" && "mx-auto",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
