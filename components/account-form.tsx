"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { accountSchema, usernameSchema } from "@/schemas";
import { FormButton } from "@/components/form-button";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useUser } from "@/lib/swr";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { checkUsername, updateAccount } from "@/actions/setting";
import { useDebounce } from "@/hooks/use-debounce";
import { Loading } from "@/components/loading";

export type SettingsFormValues = z.infer<typeof accountSchema>;

export function AccountForm() {
  const { userResponse, user, mutate } = useUser();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: user?.username,
      phone: user?.phone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const debouncedUsername = useDebounce(
    useWatch({
      control: form.control,
      name: "username",
    }),
    500,
  );

  async function onSubmit(values: SettingsFormValues) {
    const { success, error } = await updateAccount(values);

    if (error || !success) {
      toast.error(error);
    } else {
      toast.success(success);
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      form.setValue("confirmPassword", "");
      if (userResponse?.user) {
        mutate({
          ...userResponse,
          user: {
            ...userResponse.user,
            username: values.username,
            phone: values.phone,
          },
        });
      }
    }
  }

  useEffect(() => {
    const username = debouncedUsername?.trim();

    if (!username) {
      setIsUsernameAvailable(null);
      form.clearErrors("username");
      return;
    }

    const parsedValue = usernameSchema.safeParse({ username });

    if (!parsedValue.success) {
      const errorMessages = parsedValue.error.errors
        .map((err) => err.message)
        .join(" ");

      form.setError("username", {
        type: "manual",
        message: errorMessages,
      });

      setIsUsernameAvailable(false);
      return;
    }

    setIsChecking(true);
    checkUsername(username)
      .then((res) => {
        if (res?.error) {
          form.setError("username", {
            type: "manual",
            message: res.error,
          });
          setIsUsernameAvailable(false);
        } else {
          form.clearErrors("username");
          setIsUsernameAvailable(true);
        }
      })
      .catch(() => {
        form.setError("username", {
          type: "manual",
          message: "Something went wrong! Please try again.",
        });
        setIsUsernameAvailable(null);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [debouncedUsername, form]);

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl">Account</CardTitle>
        <CardDescription>
          Update your username and change your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="e.g. iwmywn"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>

                    <div className="absolute top-2.5 right-2.5">
                      {isChecking ? (
                        <Loading className="border-primary border-t-primary-foreground/10" />
                      ) : isUsernameAvailable === true ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : isUsernameAvailable === false ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>

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
                    <PhoneInput id="phone" {...field} defaultCountry="VN" />
                  </FormControl>
                  <FormDescription>
                    This number is private and will not be displayed publicly.
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
                defaultValue={user?.email}
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
                      autoComplete="off"
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
