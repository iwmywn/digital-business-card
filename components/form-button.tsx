import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonProps } from "react-day-picker";

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
      {isSubmitting ? (
        <div className="border-primary-foreground border-t-primary mx-auto h-4 w-4 animate-spin rounded-full border-4" />
      ) : (
        text
      )}
    </Button>
  );
}
