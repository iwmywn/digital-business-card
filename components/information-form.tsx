"use client";

import { useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PhoneInput } from "@/components/ui/phone-input";
import { FormButton } from "@/components/form-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { publicProfileSchema } from "@/schemas";

type ProfileFormValues = z.infer<typeof publicProfileSchema>;

export function InformationForm() {
  const [profileImage, setProfileImage] = useState<string | null>(
    "/avatars/iwmywn.jpeg",
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(publicProfileSchema),
    defaultValues: {
      fullName: "Hoàng Anh Tuấn",
      email: "public@nextmail.com",
      bio: "Software engineer with strong skills in full-stack development, cloud computing, and system design.",
      jobTitle: "Software Engineer",
      company: "NextTech Solutions",
      website: "https://iwmywn.github.io",
      phone: "+84921255645",
      gender: "male",
      dateOfBirth: new Date(2003, 7, 24),
    },
  });

  function onProfileSubmit(values: ProfileFormValues) {
    toast.success("Profile updated successfully");
    console.log(values);
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Public Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage || undefined} alt="Profile" />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center">
              <label
                htmlFor="picture"
                className="cursor-pointer text-sm hover:underline"
              >
                Change picture
              </label>
              <input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-muted-foreground text-xs">Uploading...</p>
              )}
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onProfileSubmit)}
              className="w-full space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="fullName">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            id="fullName"
                            placeholder="Your name"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="Your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="gender">Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="gender" className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">
                              Non-binary
                            </SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel htmlFor="dateOfBirth">
                          Date Of Birth
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                id="dateOfBirth"
                                variant={"outline"}
                                className={cn(
                                  "truncate pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MM/dd/yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
                        <FormControl>
                          <Input
                            id="jobTitle"
                            placeholder="Your job title"
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
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="company">Company</FormLabel>
                        <FormControl>
                          <Input
                            id="company"
                            placeholder="Your company"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="website">Website</FormLabel>
                        <FormControl>
                          <Input
                            id="website"
                            placeholder="https://iwmywn.github.io"
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
                          <PhoneInput
                            id="phone"
                            {...field}
                            defaultCountry="VN"
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
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        id="bio"
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
        </div>
      </CardContent>
    </Card>
  );
}
