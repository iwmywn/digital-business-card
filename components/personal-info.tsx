"use client";

import { forwardRef, Ref, useEffect, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { personalInfoSchema } from "@/schemas";

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const PersonalInfo = forwardRef(function PersonalInfo(
  {
    onSave,
    initialValues,
  }: {
    onSave: (data: PersonalInfoValues) => void;
    initialValues?: Partial<PersonalInfoValues>;
  },
  ref: Ref<{ validate: () => Promise<boolean> }>,
) {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
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

  const formValues = form.watch();

  useImperativeHandle(ref, () => ({
    validate: () => form.trigger(),
  }));

  useEffect(() => {
    const hasChanged =
      formValues.fullName !== initialValues?.fullName ||
      formValues.jobTitle !== initialValues?.jobTitle ||
      formValues.department !== initialValues?.department ||
      formValues.company !== initialValues?.company ||
      formValues.accreditations !== initialValues?.accreditations ||
      formValues.headline !== initialValues?.headline ||
      formValues.bio !== initialValues?.bio;

    if (hasChanged) {
      onSave(formValues);
    }
  }, [formValues, onSave, initialValues]);

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
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
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
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Department
                      </FormLabel>
                      <FormControl>
                        <Input
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
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
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
                  <FormLabel className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Accreditations
                  </FormLabel>
                  <FormControl>
                    <Input
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
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Headline
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digital marketing specialist with 5+ years of experience"
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
                  <FormLabel className="flex items-center gap-2">
                    <FileEdit className="h-4 w-4" />
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
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
