import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
} & React.ComponentProps<"button">) {
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
