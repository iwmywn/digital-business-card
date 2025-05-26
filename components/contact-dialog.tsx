"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FormButton } from "@/components/form-button";
import { contactSchema } from "@/schemas";
import { PhoneInput } from "@/components/ui/phone-input";
import { submitContact } from "@/actions/support-requests";
import { Dispatch, SetStateAction } from "react";

const departments = [
  { value: "support", label: "Technical Support" },
  { value: "sales", label: "Sales Team" },
  { value: "billing", label: "Billing Department" },
  { value: "partnership", label: "Partnership Opportunities" },
  { value: "feedback", label: "Product Feedback" },
];

export type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: undefined,
      department: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    const { success, error } = await submitContact(values);

    if (error || !success) {
      toast.error(error);
    } else {
      form.reset();
      setOpen(false);
      toast.success(success);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[85vh] overflow-y-auto"
        onWheel={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Contact Us</DialogTitle>
          <DialogDescription>
            We&apos;d love to hear from you. Please fill out the form below and
            our team will get in touch with you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <FormControl>
                        <Input
                          id="firstName"
                          placeholder="First Name"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          id="lastName"
                          placeholder="Last Name"
                          {...field}
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
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="company">Company Name</FormLabel>
                  <FormControl>
                    <Input id="company" placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Business Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="Business Email"
                          type="email"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="phone">Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput id="phone" {...field} defaultCountry="VN" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="department">
                    Who do you want to talk to?
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="department" className="w-full">
                        <SelectValue placeholder="Select department..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem
                          key={department.value}
                          value={department.value}
                        >
                          {department.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="message">
                    What did you want to talk to us about?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormButton
              isSubmitting={form.formState.isSubmitting}
              text="Submit"
              className="w-full"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
