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

type PrivateFormData = z.infer<typeof tokenSchema>;

export function PrivateForm() {
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const form = useForm<PrivateFormData>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: "",
    },
  });

  async function onSubmit(data: PrivateFormData) {
    if (!showCaptcha && !recaptchaToken) {
      setShowCaptcha(true);
      return;
    }

    try {
      const res = await fetch("/api/private", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      if (res.ok) {
        toast.success("You have 20 mins for this session. Redirecting...");
        const searchParams = new URLSearchParams(window.location.search);
        const callbackUrl = searchParams.get("next") || "/login";

        form.reset();
        setTimeout(() => {
          window.location.href = callbackUrl;
        }, 3000);
      } else {
        const message = await res.json();
        toast.error(message);
      }
    } catch (error) {
      console.error("Verify token error: ", error);
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
          <CardTitle className="text-2xl">Secure Access</CardTitle>
          <CardDescription>
            Please contact{" "}
            <FormLink
              href="https://github.com/iwmywn"
              target="_blank"
              className="text-foreground/85"
            >
              the administrator
            </FormLink>{" "}
            to receive your access token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  isValid={form.formState.isValid}
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
