"use client"

import { useEffect } from "react"
import { notificationSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { updateNotificationSettings } from "@/actions/setting"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { FormButton } from "@/components/form-button"
import { NotificationPreferencesSkeleton } from "@/components/skeletons"
import { useUser } from "@/lib/swr"

export type NotificationFormValues = z.infer<typeof notificationSchema>

export function NotificationSetting() {
  const { isUserError, isUserLoading } = useUser()

  useEffect(() => {
    if (isUserError && !isUserLoading) toast.error(isUserError)
  }, [isUserError, isUserLoading])

  if (isUserLoading) {
    return <NotificationPreferencesSkeleton />
  }

  return <NotificationForm />
}

function NotificationForm() {
  const { user, userResponse, mutate } = useUser()
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email: user?.notificationSettings.email,
      cardView: user?.notificationSettings.cardView,
      marketing: user?.notificationSettings.marketing,
      security: user?.notificationSettings.security,
    },
  })

  async function onNotificationSubmit(values: NotificationFormValues) {
    const { success, error } = await updateNotificationSettings(values)

    if (error || !success) {
      toast.error(error)
    } else {
      toast.success(success)
      if (userResponse?.user) {
        mutate({
          ...userResponse,
          user: { ...userResponse.user, notificationSettings: values },
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNotificationSubmit)}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>
                  Receive email notifications about account activity.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardView"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  Card View Notifications
                </FormLabel>
                <FormDescription>
                  Get notified when someone views your digital business card.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">Marketing Emails</FormLabel>
                <FormDescription>
                  Receive emails about new features, tips, and promotions.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="security"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">Security Alerts</FormLabel>
                <FormDescription>
                  Get notified about important security updates and unusual
                  account activity.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-row-reverse">
          <FormButton
            isSubmitting={form.formState.isSubmitting}
            text="Save changes"
          />
        </div>
      </form>
    </Form>
  )
}
