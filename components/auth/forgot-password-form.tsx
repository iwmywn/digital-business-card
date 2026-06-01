"use client"

import { useCallback, useState } from "react"
import { emailSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type * as z from "zod"

import { forgotPassword } from "@/actions/auth"
import {
  Form,
  FormButton,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormLink,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ReCaptchaDialog } from "@/components/auth/recaptcha-dialog"

export type EmailFormValues = z.infer<typeof emailSchema>

export function ForgotPasswordForm() {
  const [isReCaptchaOpen, setIsReCaptchaOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const processForgotPassword = useCallback(
    async (values: EmailFormValues, token: string) => {
      if (isLoading) return

      setIsLoading(true)

      const { success, error } = await forgotPassword(values, token)

      if (error || !success) {
        toast.error(error)
      } else {
        toast.success(success)
        form.reset()
      }

      setIsLoading(false)
    },
    [isLoading, form]
  )

  const onRecaptchaVerify = useCallback(
    (token: string) => {
      void processForgotPassword(form.getValues(), token)
    },
    [form, processForgotPassword]
  )

  function onSubmit() {
    if (isLoading) return
    setIsReCaptchaOpen(true)
  }

  return (
    <>
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
            <FormButton isSubmitting={isLoading || form.formState.isSubmitting}>
              Send reset link
            </FormButton>
            <FormLink href="/signin">Back to sign in</FormLink>
          </div>
        </form>
      </Form>

      <ReCaptchaDialog
        open={isReCaptchaOpen}
        setOpen={setIsReCaptchaOpen}
        onVerify={onRecaptchaVerify}
      />
    </>
  )
}
