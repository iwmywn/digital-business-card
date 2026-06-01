"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { tokenSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type * as z from "zod"

import { signInPrivate } from "@/actions/auth"
import {
  Form,
  FormButton,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ReCaptchaDialog } from "@/components/auth/recaptcha-dialog"

export type PrivateFormValues = z.infer<typeof tokenSchema>

export function PrivateForm() {
  const [isReCaptchaOpen, setIsReCaptchaOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const form = useForm<PrivateFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: "",
    },
  })
  const router = useRouter()

  const processSignInPrivate = useCallback(
    async (values: PrivateFormValues, token: string) => {
      if (isLoading) return

      setIsLoading(true)

      const { success, error } = await signInPrivate(values, token)

      if (error || !success) {
        toast.error(error)
      } else {
        toast.success(success)
        const searchParams = new URLSearchParams(window.location.search)
        let callbackUrl = searchParams.get("next")

        if (window.location.hash) {
          callbackUrl = callbackUrl + window.location.hash
        }

        form.reset()
        router.push(callbackUrl || "/")
      }

      setIsLoading(false)
    },
    [isLoading, form, router]
  )

  const onRecaptchaVerify = useCallback(
    (token: string) => {
      void processSignInPrivate(form.getValues(), token)
    },
    [form, processSignInPrivate]
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
            <FormButton isSubmitting={isLoading || form.formState.isSubmitting}>
              Submit
            </FormButton>
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
