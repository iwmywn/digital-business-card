"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FormButton } from "@/components/form-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ImageIcon } from "lucide-react";
import { CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { checkEnv, cn, getCloudinaryUrl } from "@/lib/utils";
import { format } from "date-fns";
import { publicProfileSchema } from "@/schemas";
import { updateProfile } from "@/actions/setting";
import {
  ImageEditorDialog,
  ImageTransform,
} from "@/components/image-editor-dialog";
import { useUser } from "@/lib/swr";
import Image from "next/image";
import type { Image as ImageType } from "@/components/card/card-design";
import Link from "next/link";

export type ProfileFormValues = z.infer<typeof publicProfileSchema>;

export function InformationForm() {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [imageEditorOpen, setImageEditorOpen] = useState<boolean>(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [cloudinaryName, setCloudinaryName] = useState<string | null>(null);
  const { user, userResponse, mutate } = useUser();
  const [profileImage, setProfileImage] = useState<ImageType | undefined>(
    user?.profile?.profileImage,
  );
  const [coverImage, setCoverImage] = useState<ImageType | undefined>(
    user?.profile?.coverImage,
  );
  const [imageTransforms, setImageTransforms] = useState<{
    profile?: ImageTransform;
    cover?: ImageTransform;
  }>(user?.profile?.imageTransforms || {});
  const [currentImageType, setCurrentImageType] = useState<
    "profile" | "cover" | undefined
  >(undefined);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(publicProfileSchema),
    defaultValues: {
      fullName: user?.profile?.fullName,
      gender: user?.profile?.gender,
      dateOfBirth: user?.profile?.dateOfBirth,
      jobTitle: user?.profile?.jobTitle,
      company: user?.profile?.company,
      website: user?.profile?.website,
      bio: user?.profile?.bio,
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    const { success, error } = await updateProfile(
      {
        ...values,
        profileImage,
        coverImage,
      },
      imageTransforms,
    );

    if (error || !success) {
      toast.error(error);
    } else {
      toast.success(success);
      if (userResponse?.user) {
        mutate({
          ...userResponse,
          user: {
            ...userResponse.user,
            profile: { ...values, profileImage, coverImage, imageTransforms },
          },
        });
      }
    }
  }

  const handleImageClick = (type: "profile" | "cover") => {
    let currentImage;
    if (type === "profile") currentImage = profileImage;
    if (type === "cover") currentImage = coverImage;

    if (currentImage) {
      setCurrentImageType(type);
      setTempImage(currentImage[1]);
      setCloudinaryName(currentImage[0]);
      setImageEditorOpen(true);
    } else {
      setCloudinaryName(null);
      document.getElementById(`${type}-image`)?.click();
    }
  };

  function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover",
  ) {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit!");
      fileInput.value = "";
      return;
    }

    if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
      toast.error("Only JPG, JPEG and PNG images are allowed!");
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      setCurrentImageType(type);
      setTempImage(result);
      setImageEditorOpen(true);

      fileInput.value = "";
    };
    reader.onerror = () => {
      toast.error(`Failed to upload ${type} image!`);
      fileInput.value = "";
    };
    reader.readAsDataURL(file);
  }

  const handleSaveImage = (transform: ImageTransform, type?: string) => {
    if (!tempImage || !type) return;

    const { cloudinaryName: cloudinaryNameEnv } = checkEnv({
      cloudinaryName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    });

    if (type === "profile")
      setProfileImage([cloudinaryName ?? cloudinaryNameEnv, tempImage]);
    if (type === "cover")
      setCoverImage([cloudinaryName ?? cloudinaryNameEnv, tempImage]);

    setImageTransforms((prev) => ({
      ...prev,
      [type]: transform,
    }));

    toast.info(
      `${type.charAt(0).toUpperCase() + type.slice(1)} image updated.`,
    );
    setImageEditorOpen(false);
  };

  const handleDeleteImage = (type?: string) => {
    if (!type) return;

    if (type === "profile") setProfileImage(undefined);
    if (type === "cover") setCoverImage(undefined);

    const newTransforms = { ...imageTransforms };
    delete newTransforms[type as keyof typeof newTransforms];
    setImageTransforms(newTransforms);
    setCloudinaryName(null);

    toast.info(
      `${type.charAt(0).toUpperCase() + type.slice(1)} image removed.`,
    );
    setImageEditorOpen(false);
  };

  const getImageUrl = (type: "profile" | "cover") => {
    const transform = imageTransforms[type];

    let imageUrl;

    if (type === "profile") imageUrl = profileImage;
    if (type === "cover") imageUrl = coverImage;

    return getCloudinaryUrl(imageUrl, transform);
  };

  useEffect(() => {
    setProfileImage(user?.profile?.profileImage);
    setCoverImage(user?.profile?.coverImage);
    setImageTransforms(user?.profile?.imageTransforms ?? {});
  }, [user]);

  return (
    <>
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl">Public Profile</CardTitle>
          <CardDescription>Update your profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-12">
              <div className="flex w-40 flex-col items-center gap-2">
                <p className="text-sm">Profile Picture</p>
                <div
                  className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                  onClick={() => handleImageClick("profile")}
                >
                  {profileImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={getImageUrl("profile")}
                        alt="Profile picture"
                        fill
                        sizes="80px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                      <ImageIcon className="size-8 text-gray-400" />
                      <span className="mt-1 text-center text-xs text-gray-500">
                        Click to upload
                      </span>
                    </div>
                  )}
                </div>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/jpg,.jpg,image/jpeg,.jpeg,image/png,.png"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "profile")}
                />
                <p className="text-muted-foreground text-center text-xs">
                  {profileImage ? "Click to edit" : "Square, 400x400px"}
                </p>
              </div>

              <div className="flex w-40 flex-col items-center gap-2">
                <p className="text-sm">Cover Photo</p>
                <div
                  className="relative flex h-20 w-40 cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                  onClick={() => handleImageClick("cover")}
                >
                  {coverImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={getImageUrl("cover")}
                        alt="Cover photo"
                        fill
                        sizes="160px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                      <ImageIcon className="size-8 text-gray-400" />
                      <span className="mt-1 text-center text-xs text-gray-500">
                        Click to upload
                      </span>
                    </div>
                  )}
                </div>
                <input
                  id="cover-image"
                  type="file"
                  accept="image/jpg,.jpg,image/jpeg,.jpeg,image/png,.png"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "cover")}
                />
                <p className="text-muted-foreground text-center text-xs">
                  {profileImage ? "Click to edit" : "800x400px, 2:1 ratio"}
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
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
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel htmlFor="dateOfBirth">
                            Date Of Birth
                          </FormLabel>
                          <Popover
                            open={showCalendar}
                            onOpenChange={setShowCalendar}
                          >
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
                                    format(new Date(field.value), "MM/dd/yyyy")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-2"
                              align="start"
                            >
                              <CalendarComponent
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(day) => {
                                  field.onChange(
                                    day ? format(day, "MM/dd/yyyy") : undefined,
                                  );
                                  setShowCalendar(false);
                                }}
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
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                              placeholder="https://example.com"
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

                <div className="flex flex-row-reverse gap-2">
                  <FormButton
                    isSubmitting={form.formState.isSubmitting}
                    text="Save changes"
                  />
                  <Button asChild>
                    <Link
                      href={`/profile/${user?.username || user?._id}`}
                      target="_blank"
                    >
                      View public profile
                    </Link>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <ImageEditorDialog
        open={imageEditorOpen}
        onOpenChange={setImageEditorOpen}
        imageType={currentImageType}
        imageUrl={tempImage}
        cloudinaryName={cloudinaryName}
        initialTransform={
          currentImageType ? imageTransforms[currentImageType] : undefined
        }
        onSave={handleSaveImage}
        onDelete={handleDeleteImage}
      />
    </>
  );
}
