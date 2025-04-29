"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, Save, Plus, Trash2, ImageIcon, LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const cardFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Card name must be at least 2 characters." }),
  tagline: z
    .string()
    .max(60, { message: "Tagline must not exceed 60 characters." })
    .optional(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  fontFamily: z.string(),
  isPublic: z.boolean(),
});

const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  jobTitle: z
    .string()
    .min(2, { message: "Job title must be at least 2 characters." }),
  company: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(250, { message: "Bio must not exceed 250 characters." })
    .optional(),
});

const socialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type CardFormValues = z.infer<typeof cardFormSchema>;
type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type SocialLinkValues = z.infer<typeof socialLinkSchema>;

const fontOptions = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "poppins", label: "Poppins" },
  { value: "montserrat", label: "Montserrat" },
  { value: "opensans", label: "Open Sans" },
];

const socialPlatforms = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "github", label: "GitHub" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "medium", label: "Medium" },
];

export function CreateCard() {
  const [activeTab, setActiveTab] = useState("design");
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinkValues[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const cardForm = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      name: "My Business Card",
      tagline: "Digital Marketing Specialist",
      primaryColor: "#ff4d4d",
      secondaryColor: "#333333",
      fontFamily: "inter",
      isPublic: true,
    },
  });

  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "John Doe",
      jobTitle: "Marketing Director",
      company: "TechGrowth Inc.",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      website: "https://johndoe.com",
      bio: "Digital marketing specialist with 5+ years of experience in growth hacking and conversion optimization.",
    },
  });

  const socialLinkForm = useForm<SocialLinkValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      url: "",
    },
  });

  function onCardSubmit(data: CardFormValues) {
    toast.success("Card design settings saved");
    console.log(data);
  }

  function onPersonalInfoSubmit(data: PersonalInfoValues) {
    toast.success("Personal information saved");
    console.log(data);
  }

  function onSocialLinkSubmit(data: SocialLinkValues) {
    setSocialLinks([...socialLinks, data]);
    socialLinkForm.reset({ platform: "", url: "" });
    toast.success("Social link added");
  }

  function removeSocialLink(index: number) {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
    toast.success("Social link removed");
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCardImage(e.target?.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  }

  function saveCard() {
    const cardData = {
      design: cardForm.getValues(),
      personalInfo: personalInfoForm.getValues(),
      socialLinks,
      image: cardImage,
    };

    console.log("Saving card:", cardData);
    toast.success("Business card saved successfully!");
  }

  const primaryColor = cardForm.watch("primaryColor");
  const secondaryColor = cardForm.watch("secondaryColor");
  const fontFamily = cardForm.watch("fontFamily");
  const cardName = cardForm.watch("name");
  const tagline = cardForm.watch("tagline");

  const fullName = personalInfoForm.watch("fullName");
  const jobTitle = personalInfoForm.watch("jobTitle");
  const company = personalInfoForm.watch("company");
  const email = personalInfoForm.watch("email");
  const phone = personalInfoForm.watch("phone");
  const website = personalInfoForm.watch("website");
  const bio = personalInfoForm.watch("bio");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {previewMode ? "Card Preview" : "Create New Card"}
          </h2>
          <p className="text-muted-foreground">
            {previewMode
              ? "Preview how your digital business card will look"
              : "Design your digital business card"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode ? "outline" : "default"}
            onClick={() => setPreviewMode(!previewMode)}
            className={cn(!previewMode && "bg-red-500 hover:bg-red-600")}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Back to Editor" : "Preview Card"}
          </Button>
          <Button onClick={saveCard} className="bg-red-500 hover:bg-red-600">
            <Save className="mr-2 h-4 w-4" />
            Save Card
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="flex justify-center py-8">
          <div
            className="w-full max-w-md overflow-hidden rounded-xl shadow-lg"
            style={{
              backgroundColor: secondaryColor,
              fontFamily: fontFamily || "Inter, sans-serif",
              color: "#ffffff",
            }}
          >
            {cardImage ? (
              <div className="h-48 overflow-hidden">
                <img
                  src={cardImage || "/placeholder.svg"}
                  alt="Card header"
                  className="w-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex h-48 items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <h2 className="text-3xl font-bold text-white">
                  {fullName || "Your Name"}
                </h2>
              </div>
            )}

            <div className="space-y-4 p-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">
                  {fullName || "Your Name"}
                </h2>
                <p className="text-lg opacity-90">{jobTitle || "Job Title"}</p>
                <p className="opacity-75">{company || "Company Name"}</p>
              </div>

              {bio && (
                <p className="border-t border-white/20 pt-3 text-sm opacity-90">
                  {bio}
                </p>
              )}

              <div className="space-y-2 border-t border-white/20 pt-3">
                {email && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✉️</span>
                    <span className="text-sm">{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📱</span>
                    <span className="text-sm">{phone}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌐</span>
                    <span className="text-sm">{website}</span>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 border-t border-white/20 pt-3">
                  {socialLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <span className="text-sm">
                        {link.platform.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="p-4 text-center text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {tagline || "Your Tagline Here"}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-4 pt-4">
                <Card className="rounded-lg">
                  <CardHeader>
                    <CardTitle>Card Design</CardTitle>
                    <CardDescription>
                      Customize the look and feel of your digital business card.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...cardForm}>
                      <form
                        onSubmit={cardForm.handleSubmit(onCardSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={cardForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="My Business Card"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This name is for your reference only and
                                won&apos;t be visible on the card.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={cardForm.control}
                          name="tagline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tagline</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your professional tagline"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                A short phrase that appears at the bottom of
                                your card.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            control={cardForm.control}
                            name="primaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Color</FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input
                                      type="color"
                                      {...field}
                                      className="h-8 w-12 p-1"
                                    />
                                  </FormControl>
                                  <Input
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="font-mono"
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={cardForm.control}
                            name="secondaryColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secondary Color</FormLabel>
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Input
                                      type="color"
                                      {...field}
                                      className="h-8 w-12 p-1"
                                    />
                                  </FormControl>
                                  <Input
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="font-mono"
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={cardForm.control}
                          name="fontFamily"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Font</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a font" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {fontOptions.map((font) => (
                                    <SelectItem
                                      key={font.value}
                                      value={font.value}
                                    >
                                      {font.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormLabel>Card Image</FormLabel>
                          <div className="flex items-center gap-4">
                            <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                              {cardImage ? (
                                <img
                                  src={cardImage || "/placeholder.svg"}
                                  alt="Card header"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="bg-muted flex h-full w-full items-center justify-center">
                                  <ImageIcon className="text-muted-foreground h-8 w-8" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <label
                                htmlFor="card-image"
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2 text-sm text-red-500 hover:underline">
                                  <ImageIcon className="h-4 w-4" />
                                  {cardImage ? "Change image" : "Upload image"}
                                </div>
                              </label>
                              <input
                                id="card-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                              {isUploading && (
                                <p className="text-muted-foreground text-xs">
                                  Uploading...
                                </p>
                              )}
                              {cardImage && (
                                <button
                                  type="button"
                                  onClick={() => setCardImage(null)}
                                  className="text-destructive flex items-center gap-2 text-sm hover:underline"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove image
                                </button>
                              )}
                            </div>
                          </div>
                          <FormDescription>
                            Upload an image for the header of your card.
                            Recommended size: 1200x600px.
                          </FormDescription>
                        </div>

                        <FormField
                          control={cardForm.control}
                          name="isPublic"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Public Card
                                </FormLabel>
                                <FormDescription>
                                  Make your card publicly accessible via a
                                  shareable link.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Design
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="personal" className="space-y-4 pt-4">
                <Card className="rounded-lg">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Add your personal and contact information to your digital
                      business card.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...personalInfoForm}>
                      <form
                        onSubmit={personalInfoForm.handleSubmit(
                          onPersonalInfoSubmit,
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={personalInfoForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your full name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            control={personalInfoForm.control}
                            name="jobTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your job title"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={personalInfoForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your company"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            control={personalInfoForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your email"
                                    type="email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={personalInfoForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your phone number"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={personalInfoForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={personalInfoForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell people a bit about yourself"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Brief professional description. Maximum 250
                                characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Information
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-4 pt-4">
                <Card className="rounded-lg">
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>
                      Add links to your social media profiles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...socialLinkForm}>
                      <form
                        onSubmit={socialLinkForm.handleSubmit(
                          onSocialLinkSubmit,
                        )}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            control={socialLinkForm.control}
                            name="platform"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Platform</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {socialPlatforms.map((platform) => (
                                      <SelectItem
                                        key={platform.value}
                                        value={platform.value}
                                      >
                                        {platform.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={socialLinkForm.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Link
                        </Button>
                      </form>
                    </Form>

                    {socialLinks.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-medium">Added Links</h3>
                        <div className="space-y-2">
                          {socialLinks.map((link, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-md border p-3"
                            >
                              <div className="flex items-center gap-2">
                                <LinkIcon className="text-muted-foreground h-4 w-4" />
                                <span className="font-medium">
                                  {link.platform}
                                </span>
                                <span className="text-muted-foreground max-w-[200px] truncate text-sm">
                                  {link.url}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSocialLink(index)}
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden lg:block">
            <Card className="sticky top-4 rounded-lg">
              <CardHeader>
                <CardTitle>Card Preview</CardTitle>
                <CardDescription>
                  See how your digital business card will look.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <div
                  className="w-full max-w-xs overflow-hidden rounded-xl shadow-lg"
                  style={{
                    backgroundColor: secondaryColor,
                    fontFamily: fontFamily || "Inter, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  {cardImage ? (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={cardImage || "/placeholder.svg"}
                        alt="Card header"
                        className="w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-32 items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <h2 className="text-xl font-bold text-white">
                        {fullName || "Your Name"}
                      </h2>
                    </div>
                  )}

                  <div className="space-y-3 p-4">
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold">
                        {fullName || "Your Name"}
                      </h2>
                      <p className="text-sm opacity-90">
                        {jobTitle || "Job Title"}
                      </p>
                      <p className="text-xs opacity-75">
                        {company || "Company Name"}
                      </p>
                    </div>

                    {bio && (
                      <p className="line-clamp-2 border-t border-white/20 pt-2 text-xs opacity-90">
                        {bio}
                      </p>
                    )}

                    <div className="space-y-1 border-t border-white/20 pt-2">
                      {email && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">✉️</span>
                          <span className="truncate text-xs">{email}</span>
                        </div>
                      )}
                      {phone && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">📱</span>
                          <span className="truncate text-xs">{phone}</span>
                        </div>
                      )}
                    </div>

                    {socialLinks.length > 0 && (
                      <div className="flex flex-wrap gap-2 border-t border-white/20 pt-2">
                        {socialLinks.slice(0, 4).map((link, index) => (
                          <div
                            key={index}
                            className="flex h-6 w-6 items-center justify-center rounded-full"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <span className="text-xs">
                              {link.platform.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        ))}
                        {socialLinks.length > 4 && (
                          <div
                            className="flex h-6 w-6 items-center justify-center rounded-full"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <span className="text-xs">
                              +{socialLinks.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="p-2 text-center text-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tagline || "Your Tagline Here"}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(true)}
                  className="w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Full Preview
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
