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
import { cardDomainSchema } from "@/schemas";
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
import { checkDomain, saveDomain } from "@/actions/card";
import { useCard } from "@/lib/swr";

export type DomainFormValues = z.infer<typeof cardDomainSchema>;

export function CustomDomainDialog({
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
  const form = useForm<DomainFormValues>({
    resolver: zodResolver(cardDomainSchema),
    defaultValues: {
      domain: card.dynamicSlug === card._id ? "" : card.dynamicSlug,
    },
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean | null>(
    null,
  );
  const debouncedDomain = useDebounce(form.watch("domain"), 500);
  const { cardResponse, mutate, cards } = useCard();

  async function onSubmit(values: DomainFormValues) {
    const { success, error } = await saveDomain(values, card._id);

    if (error || !success) {
      toast.error(error);
    } else {
      mutate({
        ...cardResponse,
        cards: cards.map((c) =>
          c._id === card._id
            ? {
                ...c,
                slug: debouncedDomain,
                dynamicSlug: debouncedDomain ?? c._id,
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
    const domain = debouncedDomain?.trim();

    if (!domain) {
      setIsDomainAvailable(null);
      form.clearErrors("domain");
      return;
    }

    const parsedValue = cardDomainSchema.safeParse({ domain });

    if (!parsedValue.success) {
      const errorMessages = parsedValue.error.errors
        .map((err) => err.message)
        .join(" ");

      form.setError("domain", {
        type: "manual",
        message: errorMessages,
      });

      setIsDomainAvailable(false);
      return;
    }

    setIsChecking(true);
    checkDomain(domain, card._id)
      .then((res) => {
        if (res?.error) {
          form.setError("domain", {
            type: "manual",
            message: res.error,
          });
          setIsDomainAvailable(false);
        } else {
          form.clearErrors("domain");
          setIsDomainAvailable(true);
        }
      })
      .catch(() => {
        form.setError("domain", {
          type: "manual",
          message: "Something went wrong! Please try again.",
        });
        setIsDomainAvailable(null);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [debouncedDomain, form, card._id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Card Domain</DialogTitle>
          <DialogDescription>
            Customize the domain of your card (e.g.{" "}
            https://eznect.vercel.app/card/
            <span className="text-foreground/85">your-custom-domain</span>)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="domain">Domain</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        id="domain"
                        placeholder="Domain"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>

                    <div className="absolute top-2.5 right-2.5">
                      {isChecking ? (
                        <Loading className="border-primary border-t-primary-foreground/10" />
                      ) : isDomainAvailable === true ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : isDomainAvailable === false ? (
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
