import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FormButton({
  isSubmitting,
  text,
  className,
}: {
  isSubmitting: boolean;
  text: string;
  className?: string;
}) {
  return (
    <Button className={cn(className)} disabled={isSubmitting} type="submit">
      {isSubmitting ? (
        <div className="border-primary-foreground border-t-primary mx-auto h-4 w-4 animate-spin rounded-full border-4" />
      ) : (
        text
      )}
    </Button>
  );
}
