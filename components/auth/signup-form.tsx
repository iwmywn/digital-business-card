"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { signUp } from "@/actions/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { PhoneInput } from "@/components/ui/phone-input"
import { ReCaptchaDialog } from "@/components/auth/recaptcha-dialog"
import { FormButton } from "@/components/form-button"
import { FormLink } from "@/components/form-link"
import { PrivacyPolicyDialog } from "@/components/policy/privacy-policy-dialog"
import { TermsOfServiceDialog } from "@/components/policy/terms-of-service-dialog"

export type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const router = useRouter()
  const [isReCaptchaOpen, setIsReCaptchaOpen] = useState<boolean>(false)
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const isProcessingRef = useRef<boolean>(false)
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const processSignUp = useCallback(
    async (values: SignUpFormValues, token: string) => {
      if (isProcessingRef.current) return

      isProcessingRef.current = true
      setIsLoading(true)

      const { success, error } = await signUp(values, token)

      if (error || !success) {
        toast.error(error)
      } else {
        toast.success(success)
        form.reset()
        router.push("/signin")
      }

      setIsLoading(false)
      setRecaptchaToken(null)
      isProcessingRef.current = false
    },
    [form, router]
  )

  const onSubmit = useCallback(
    async (values: SignUpFormValues) => {
      if (isProcessingRef.current) return

      if (!recaptchaToken) {
        setIsReCaptchaOpen(true)
        return
      }

      await processSignUp(values, recaptchaToken)
    },
    [recaptchaToken, processSignUp]
  )

  useEffect(() => {
    if (recaptchaToken && !isProcessingRef.current) {
      processSignUp(form.getValues(), recaptchaToken)
    }
  }, [recaptchaToken, form, processSignUp])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="fullName">Full Name</FormLabel>
                  <FormControl>
                    <Input id="fullName" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="phone">Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} defaultCountry="VN" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="password">Password</FormLabel>
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

            <div className="text-muted-foreground text-center text-sm">
              By signing up, you agree to our{" "}
              <FormLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsTermsOpen(true)
                }}
                className="text-foreground"
              >
                Terms of Service
              </FormLink>{" "}
              and{" "}
              <FormLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsPrivacyOpen(true)
                }}
                className="text-foreground"
              >
                Privacy Policy
              </FormLink>
              .
            </div>

            <FormButton
              isSubmitting={isLoading || form.formState.isSubmitting}
              text="Sign up"
            />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <FormLink href="/signin">Sign in</FormLink>
            </div>
          </div>
        </form>
      </Form>

      <ReCaptchaDialog
        open={isReCaptchaOpen}
        setOpen={setIsReCaptchaOpen}
        setRecaptchaToken={(token) => setRecaptchaToken(token)}
      />
      <TermsOfServiceDialog open={isTermsOpen} setOpen={setIsTermsOpen} />
      <PrivacyPolicyDialog open={isPrivacyOpen} setOpen={setIsPrivacyOpen} />
    </>
  )
}
