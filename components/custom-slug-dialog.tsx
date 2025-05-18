import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card as CardType } from "@/lib/definitions";
import { toast } from "sonner";
import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cardSlugSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle, XCircle } from "lucide-react";
import { FormButton } from "@/components/form-button";
import { checkSlug, updateSlug } from "@/actions/card";
import { useCard } from "@/lib/swr";

export type SlugFormValues = z.infer<typeof cardSlugSchema>;

export function CustomSlugDialog({
  card,
  open,
  setOpen,
}: {
  card: CardType & {
    editable: boolean;
    message?: string;
    dynamicSlug: string;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<SlugFormValues>({
    resolver: zodResolver(cardSlugSchema),
    defaultValues: {
      slug: card.dynamicSlug === card._id ? "" : card.dynamicSlug,
    },
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const debouncedSlug = useDebounce(form.watch("slug"), 500);
  const { cardResponse, mutate, cards } = useCard();

  async function onSubmit(values: SlugFormValues) {
    const { success, error } = await updateSlug(values, card._id);

    if (error || !success) {
      toast.error(error);
    } else {
      mutate({
        ...cardResponse,
        cards: cards.map((c) =>
          c._id === card._id
            ? {
                ...c,
                slug: debouncedSlug,
                dynamicSlug: debouncedSlug ?? c._id,
                updatedAt: new Date(),
              }
            : c,
        ),
      });
      setOpen(false);
      toast.success(success);
    }
  }

  useEffect(() => {
    const slug = debouncedSlug?.trim();

    if (!slug) {
      setIsSlugAvailable(null);
      form.clearErrors("slug");
      return;
    }

    const parsedValue = cardSlugSchema.safeParse({ slug });

    if (!parsedValue.success) {
      const errorMessages = parsedValue.error.errors
        .map((err) => err.message)
        .join(" ");

      form.setError("slug", {
        type: "manual",
        message: errorMessages,
      });

      setIsSlugAvailable(false);
      return;
    }

    setIsChecking(true);
    checkSlug(slug, card._id)
      .then((res) => {
        if (res?.error) {
          form.setError("slug", {
            type: "manual",
            message: res.error,
          });
          setIsSlugAvailable(false);
        } else {
          form.clearErrors("slug");
          setIsSlugAvailable(true);
        }
      })
      .catch(() => {
        form.setError("slug", {
          type: "manual",
          message: "Something went wrong! Please try again.",
        });
        setIsSlugAvailable(null);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [debouncedSlug, form, card._id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Customize Card Link</DialogTitle>
          <DialogDescription>
            Choose a unique identifier for your card URL.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="slug">Card Slug</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        id="slug"
                        placeholder="e.g. iwmywn"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>

                    <div className="absolute top-2.5 right-2.5">
                      {isChecking ? (
                        <Loading className="border-primary border-t-primary-foreground/10" />
                      ) : isSlugAvailable === true ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : isSlugAvailable === false ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormButton
              isSubmitting={form.formState.isSubmitting}
              text="Save Change"
              className="w-full"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
