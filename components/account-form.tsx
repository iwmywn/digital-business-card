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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { accountSchema } from "@/schemas";
import { FormButton } from "@/components/form-button";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";

type SettingsFormValues = z.infer<typeof accountSchema>;

export function AccountForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: "iwmywn",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onAccountSubmit(data: SettingsFormValues) {
    toast.success("Account settings updated successfully");
    console.log(data);
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Account</CardTitle>
        <CardDescription>
          Update your username and change your password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onAccountSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input id="username" placeholder="Username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </FormDescription>
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
                  <FormDescription>
                    This number may appear on your public profile, or stay
                    private depending on your settings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                readOnly
                defaultValue="user@nextmail.com"
              />
              <FormDescription>
                This email is linked to your account and cannot be changed.
              </FormDescription>
              <FormMessage />
            </FormItem>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-muted-foreground text-sm">
                Update your password to keep your account secure.
              </p>
            </div>

            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="currentPassword">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="currentPassword"
                      placeholder="********"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="newPassword">New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="newPassword"
                          placeholder="********"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm New Password
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
              </div>
            </div>

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
