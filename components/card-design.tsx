"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ImageEditorDialog,
  type ImageTransform,
} from "@/components/image-editor-dialog";
import { useUser } from "@/lib/swr";
import * as constants from "@/constants";
import { getCloudinaryUrl } from "@/lib/utils";
import { checkEnv } from "@/lib/utils";
import { brandNameSchema } from "@/schemas";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// ['cloudinary image name', 'image path']
export type Image = [string, string];

type BrandNameValue = z.infer<typeof brandNameSchema>;

export interface CardDesignValues {
  cardColor: string;
  fontFamily: string;
  logoImage?: Image;
  profileImage?: Image;
  coverImage?: Image;
  imageTransforms?: {
    logo?: ImageTransform;
    profile?: ImageTransform;
    cover?: ImageTransform;
  };
  brandName?: string;
}

export const CardDesign = forwardRef(function CardDesign(
  {
    onSave,
    initialValues,
  }: {
    onSave: (data: CardDesignValues) => void;
    initialValues: CardDesignValues;
  },
  ref: Ref<{ validate: () => Promise<boolean> }>,
) {
  const { user } = useUser();
  const [logoImage, setLogoImage] = useState<Image | undefined>(
    initialValues?.logoImage,
  );
  const [profileImage, setProfileImage] = useState<Image | undefined>(
    initialValues?.profileImage,
  );
  const [coverImage, setCoverImage] = useState<Image | undefined>(
    initialValues?.coverImage,
  );
  const [cardColor, setCardColor] = useState<string>(initialValues?.cardColor);
  const [fontFamily, setFontFamily] = useState<string>(
    initialValues?.fontFamily,
  );
  const [imageTransforms, setImageTransforms] = useState<{
    logo?: ImageTransform;
    profile?: ImageTransform;
    cover?: ImageTransform;
  }>(initialValues?.imageTransforms || {});
  const [imageEditorOpen, setImageEditorOpen] = useState<boolean>(false);
  const [currentImageType, setCurrentImageType] = useState<
    "logo" | "profile" | "cover" | undefined
  >(undefined);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [cloudinaryName, setCloudinaryName] = useState<string | null>(null);
  const form = useForm<BrandNameValue>({
    resolver: zodResolver(brandNameSchema),
    mode: "onChange",
    defaultValues: {
      brandName: initialValues?.brandName || "",
    },
  });

  const formValue = form.watch();

  useImperativeHandle(ref, () => ({
    validate: () => form.trigger(),
  }));

  const fontOptions =
    user?.currentPlan === "free"
      ? constants.freeFontOptions
      : user?.currentPlan === "basic"
        ? constants.basicFontOptions
        : constants.allFontOptions;

  const colorOptions =
    user?.currentPlan === "free"
      ? constants.freeColorOptions
      : user?.currentPlan === "basic"
        ? constants.basicColorOptions
        : constants.allColorOptions;

  useEffect(() => {
    onSave({
      cardColor,
      fontFamily,
      logoImage,
      profileImage,
      coverImage,
      imageTransforms,
      brandName: formValue.brandName,
    });
  }, [
    cardColor,
    fontFamily,
    logoImage,
    profileImage,
    coverImage,
    imageTransforms,
    formValue.brandName,
    initialValues.brandName,
    onSave,
  ]);

  const handleImageClick = (type: "logo" | "profile" | "cover") => {
    let currentImage;
    if (type === "logo") currentImage = logoImage;
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
    type: "logo" | "profile" | "cover",
  ) {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit!");
      fileInput.value = "";
      return;
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (!allowedExtensions.includes(fileExtension)) {
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

    if (type === "logo")
      setLogoImage([cloudinaryName ?? cloudinaryNameEnv, tempImage]);
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

    if (type === "logo") setLogoImage(undefined);
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

  const getImageUrl = (type: "logo" | "profile" | "cover") => {
    const transform = imageTransforms[type];

    let imageUrl;

    if (type === "logo") imageUrl = logoImage;
    if (type === "profile") imageUrl = profileImage;
    if (type === "cover") imageUrl = coverImage;

    return getCloudinaryUrl(imageUrl, transform);
  };

  const selectedFont =
    fontOptions.find((font) => font.value === fontFamily) || fontOptions[0];

  return (
    <>
      <Card className="rounded-lg">
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base leading-none font-semibold">
              Add Images
            </Label>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3">
                <Label className="text-sm">Company Logo</Label>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                    onClick={() => handleImageClick("logo")}
                  >
                    {logoImage ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={getImageUrl("logo")}
                          alt="Company logo"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-2">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="mt-1 text-center text-xs text-gray-500">
                          Click to upload
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    id="logo-image"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "logo")}
                  />
                  <p className="text-muted-foreground text-center text-xs">
                    {logoImage ? "Click to edit" : "Square, 400x400px"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <Label className="text-sm">Profile Picture</Label>
                <div className="flex flex-col items-center gap-2">
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
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="mt-1 text-center text-xs text-gray-500">
                          Click to upload
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "profile")}
                  />
                  <p className="text-muted-foreground text-center text-xs">
                    {profileImage ? "Click to edit" : "Square, 400x400px"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <Label className="text-sm">Cover Photo</Label>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="relative flex h-20 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                    onClick={() => handleImageClick("cover")}
                  >
                    {coverImage ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={getImageUrl("cover")}
                          alt="Cover photo"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="mt-1 text-center text-xs text-gray-500">
                          Click to upload
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    id="cover-image"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "cover")}
                  />
                  <p className="text-muted-foreground text-center text-xs">
                    {coverImage ? "Click to edit" : "800x400px, 2:1 ratio"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Card Color</Label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  className={`h-12 w-12 cursor-pointer rounded-md shadow-sm transition-all ${color.color} ${cardColor === color.value ? "ring-primary scale-110 ring-1 ring-offset-1" : "hover:ring-primary hover:ring-1 hover:ring-offset-1"} `}
                  onClick={() => setCardColor(color.value)}
                  title={color.label}
                  type="button"
                  aria-label={`Select ${color.label} color`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className={`${selectedFont.className} w-full`}>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem
                    key={font.value}
                    value={font.value}
                    className={font.className}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {user?.currentPlan === "professional" && (
            <Form {...form}>
              <form>
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="brandName"
                        className="flex items-center gap-2 text-base font-medium"
                      >
                        Brand Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="brandName"
                          placeholder="e.g. Visiq"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
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
});
