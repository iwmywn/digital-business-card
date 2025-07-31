"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { tokenSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { signInPrivate } from "@/actions/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ReCaptchaDialog } from "@/components/auth/recaptcha-dialog"
import { FormButton } from "@/components/form-button"

export type PrivateFormValues = z.infer<typeof tokenSchema>

export function PrivateForm() {
  const [isReCaptchaOpen, setIsReCaptchaOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const isProcessingRef = useRef<boolean>(false)
  const form = useForm<PrivateFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: "",
    },
  })
  const router = useRouter()

  const processSignInPrivate = useCallback(
    async (values: PrivateFormValues, token: string) => {
      if (isProcessingRef.current) return

      isProcessingRef.current = true
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
      setRecaptchaToken(null)
      isProcessingRef.current = false
    },
    [form, router]
  )

  const onSubmit = useCallback(
    async (values: PrivateFormValues) => {
      if (isProcessingRef.current) return

      if (!recaptchaToken) {
        setIsReCaptchaOpen(true)
        return
      }

      await processSignInPrivate(values, recaptchaToken)
    },
    [recaptchaToken, processSignInPrivate]
  )

  useEffect(() => {
    if (recaptchaToken && !isProcessingRef.current) {
      processSignInPrivate(form.getValues(), recaptchaToken)
    }
  }, [recaptchaToken, form, processSignInPrivate])

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
            <FormButton
              isSubmitting={isLoading || form.formState.isSubmitting}
              text="Submit"
            />
          </div>
        </form>
      </Form>

      <ReCaptchaDialog
        open={isReCaptchaOpen}
        setOpen={setIsReCaptchaOpen}
        setRecaptchaToken={(token) => setRecaptchaToken(token)}
      />
    </>
  )
}
