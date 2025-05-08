import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonProps } from "react-day-picker";
import { Loading } from "@/components/loading";

export function FormButton({
  isSubmitting,
  text,
  className,
  ...props
}: {
  isSubmitting: boolean;
  text: string;
  className?: string;
} & ButtonProps) {
  return (
    <Button
      className={cn(className)}
      disabled={isSubmitting}
      type="submit"
      {...props}
    >
      {isSubmitting ? <Loading /> : text}
    </Button>
  );
}
