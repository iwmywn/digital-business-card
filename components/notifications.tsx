"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import { FormButton } from "@/components/form-button";
import { notificationsSchema } from "@/schemas";

type NotificationFormValues = z.infer<typeof notificationsSchema>;

export function Notifications() {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      cardViewNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
    },
  });

  function onNotificationSubmit(values: NotificationFormValues) {
    toast.success("Notification preferences updated");
    console.log(values);
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Notification Preferences</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onNotificationSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="emailNotifications"
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
                      Email Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive email notifications about account activity.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardViewNotifications"
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
                      Get notified when someone views your digital business
                      card.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingEmails"
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
                      Marketing Emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about new features, tips, and promotions.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="securityAlerts"
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
                text="Save Changes"
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
