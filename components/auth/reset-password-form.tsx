"use client";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPasswordSchema } from "@/schemas";
import { FormButton } from "@/components/form-button";
import { findEmailAndToken, resetPassword } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { FormLink } from "@/components/form-link";
import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import { X } from "lucide-react";

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({
  token,
  email,
}: {
  token: string | undefined;
  email: string | undefined;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    const { success, error } = await resetPassword(values, email, token);

    if (error || !success) {
      toast.error(error);
    } else {
      toast.success(success);
      form.reset();
      router.push("/signin");
    }
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { error } = await findEmailAndToken(email, token);

      if (error) {
        setMessage(error);
      }
      setIsLoading(false);
    })();
  }, [email, token]);

  if (isLoading)
    return (
      <Loading className="border-primary border-t-primary-foreground/10 size-8" />
    );
  if (message)
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-sm">
        <X className="size-[1.875rem]" />
        {message}
      </div>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="password">New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="********"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="********"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormButton
            isSubmitting={form.formState.isSubmitting}
            text="Reset password"
          />
          <FormLink href="/signin" side="center">
            Back to sign in
          </FormLink>
        </div>
      </form>
    </Form>
  );
}
