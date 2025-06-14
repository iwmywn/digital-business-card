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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormLink } from "@/components/form-link";
import { useState, useEffect, useCallback, useRef } from "react";
import { ReCaptchaDialog } from "@/components/auth/recaptcha-dialog";
import { emailSchema } from "@/schemas";
import { FormButton } from "@/components/form-button";
import { forgotPassword } from "@/actions/auth";

export type EmailFormValues = z.infer<typeof emailSchema>;

export function ForgotPasswordForm() {
  const [isReCaptchaOpen, setIsReCaptchaOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const processForgotPassword = useCallback(
    async (values: EmailFormValues, token: string) => {
      if (isProcessingRef.current) return;

      isProcessingRef.current = true;
      setIsLoading(true);

      const { success, error } = await forgotPassword(values, token);

      if (error || !success) {
        toast.error(error);
      } else {
        toast.success(success);
        form.reset();
      }

      setIsLoading(false);
      setRecaptchaToken(null);
      isProcessingRef.current = false;
    },
    [form],
  );

  const onSubmit = useCallback(
    async (values: EmailFormValues) => {
      if (isProcessingRef.current) return;

      if (!recaptchaToken) {
        setIsReCaptchaOpen(true);
        return;
      }

      await processForgotPassword(values, recaptchaToken);
    },
    [recaptchaToken, processForgotPassword],
  );

  useEffect(() => {
    if (recaptchaToken && !isProcessingRef.current) {
      processForgotPassword(form.getValues(), recaptchaToken);
    }
  }, [recaptchaToken, form, processForgotPassword]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormButton
                  isSubmitting={isLoading || form.formState.isSubmitting}
                  text="Send reset link"
                />
                <FormLink href="/signin" side="center">
                  Back to sign in
                </FormLink>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ReCaptchaDialog
        open={isReCaptchaOpen}
        setOpen={setIsReCaptchaOpen}
        setRecaptchaToken={(token) => setRecaptchaToken(token)}
      />
    </>
  );
}
