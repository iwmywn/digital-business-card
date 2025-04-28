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

type EmailFormData = z.infer<typeof emailSchema>;

export function ForgotPasswordForm() {
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: EmailFormData) {
    if (!showCaptcha && !recaptchaToken) {
      setShowCaptcha(true);
      return;
    }

    try {
      const res = await fetch("/api/forgot-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      const message = await res.json();

      if (res.ok) {
        toast(message);
        form.reset();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Reset password error: ", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setRecaptchaToken(null);
      setShowCaptcha(false);
    }
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
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
