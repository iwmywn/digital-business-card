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
import { useState } from "react";
import ReCaptchaPopup from "@/components/recaptcha";
import { tokenSchema } from "@/schemas";
import { FormButton } from "@/components/form-button";
import { FormLink } from "@/components/form-link";
import { signInPrivate } from "@/actions/auth";
import { useRouter } from "next/navigation";

export type PrivateFormValues = z.infer<typeof tokenSchema>;

export function PrivateForm() {
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const form = useForm<PrivateFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: PrivateFormValues) {
    if (!showCaptcha && !recaptchaToken) {
      setShowCaptcha(true);
      return;
    }

    const { success, error } = await signInPrivate(values, recaptchaToken);

    if (error || !success) {
      toast.error(error);
    } else {
      toast.success(success);
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("next") || "/signin";

      form.reset();
      router.push(callbackUrl);
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
          <CardTitle className="text-xl">Secure Access</CardTitle>
          <CardDescription>
            Please contact{" "}
            <FormLink
              href="https://github.com/iwmywn"
              target="_blank"
              className="text-foreground/85"
              rel="noopener"
            >
              the administrator
            </FormLink>{" "}
            to receive your access token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="token">Token</FormLabel>
                      <FormControl>
                        <Input
                          id="token"
                          placeholder="w6k4SNxs6tUYqetKg7sSFCD/Ac/YUTDStuQgbF92+M8="
                          type="text"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormButton
                  isSubmitting={form.formState.isSubmitting}
                  text="Submit"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
