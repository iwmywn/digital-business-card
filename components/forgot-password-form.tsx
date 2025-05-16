"use client";

import { z } from "zod";
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
import { useState } from "react";
import ReCaptchaPopup from "@/components/recaptcha";
import { emailSchema } from "@/schemas";
import { FormButton } from "@/components/form-button";
import { forgotPassword } from "@/actions/auth";

export type EmailFormValues = z.infer<typeof emailSchema>;

export function ForgotPasswordForm() {
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: EmailFormValues) {
    if (!showCaptcha && !recaptchaToken) {
      setShowCaptcha(true);
      return;
    }

    const { success, error } = await forgotPassword(values, recaptchaToken);

    if (error || !success) {
      toast.error(error);
    } else {
      toast.success(success);
      form.reset();
    }

    setRecaptchaToken(null);
    setShowCaptcha(false);
  }

  return (
    <>
      {showCaptcha && (
        <ReCaptchaPopup
          onClose={() => setShowCaptcha(false)}
          setRecaptchaToken={(token) => setRecaptchaToken(token)}
        />
      )}
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
                  isSubmitting={form.formState.isSubmitting}
                  text="Send Reset Link"
                />
                <FormLink href="/signin" side="center">
                  Back to sign in
                </FormLink>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
