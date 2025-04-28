import { Button } from "@/components/ui/button";

export function FormButton({
  isSubmitting,
  text,
}: {
  isSubmitting: boolean;
  text: string;
}) {
  return (
    <Button disabled={isSubmitting} type="submit">
      {isSubmitting ? (
        <div className="border-primary-foreground border-t-primary mx-auto h-4 w-4 animate-spin rounded-full border-4" />
      ) : (
        text
      )}
    </Button>
  );
}
