"use client";

import { forwardRef, Ref, useEffect, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import {
  User,
  Briefcase,
  Users,
  Building,
  Award,
  FileText,
  FileEdit,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { personalInformationSchema } from "@/schemas";

export type PersonalInformationValues = z.infer<
  typeof personalInformationSchema
>;

export const PersonalInformation = forwardRef(function PersonalInformation(
  {
    onSave,
    initialValues,
  }: {
    onSave: (data: PersonalInformationValues) => void;
    initialValues?: Partial<PersonalInformationValues>;
  },
  ref?: Ref<{ validate: () => Promise<boolean> }>,
) {
  const form = useForm<PersonalInformationValues>({
    resolver: zodResolver(personalInformationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: initialValues?.fullName || "",
      jobTitle: initialValues?.jobTitle || "",
      department: initialValues?.department || "",
      company: initialValues?.company || "",
      accreditations: initialValues?.accreditations || "",
      headline: initialValues?.headline || "",
      bio: initialValues?.bio || "",
    },
  });

  useImperativeHandle(ref, () => ({
    validate: () => form.trigger(),
  }));

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    onSave(watchedValues as PersonalInformationValues);
  }, [watchedValues, onSave]);

  return (
    <Card className="rounded-lg">
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="fullName"
                        className="flex items-center gap-2"
                      >
                        <User className="size-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
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
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="jobTitle"
                        className="flex items-center gap-2"
                      >
                        <Briefcase className="size-4" />
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="jobTitle"
                          placeholder="Marketing Director"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="department"
                        className="flex items-center gap-2"
                      >
                        <Users className="size-4" />
                        Department
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="department"
                          placeholder="Marketing"
                          {...field}
                          value={field.value || ""}
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
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="company"
                        className="flex items-center gap-2"
                      >
                        <Building className="size-4" />
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="company"
                          placeholder="Acme Inc."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="accreditations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="accreditations"
                    className="flex items-center gap-2"
                  >
                    <Award className="size-4" />
                    Accreditations
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="accreditations"
                      placeholder="MBA, CPA, etc."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="headline"
                    className="flex items-center gap-2"
                  >
                    <FileText className="size-4" />
                    Headline
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="headline"
                      placeholder="Digital marketing specialist with 5+ years of experience."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="bio" className="flex items-center gap-2">
                    <FileEdit className="size-4" />
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="bio"
                      placeholder="Write a short bio about yourself..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});
