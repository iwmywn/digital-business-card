"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { nunito, inter, roboto, montserrat, openSans } from "@/app/fonts";
import { ImageEditor, type ImageTransform } from "@/components/image-editor";

export type CardDesignValues = {
  cardColor: string;
  fontFamily: string;
  logoImage: string | null;
  profileImage: string | null;
  coverImage: string | null;
  imageTransforms?: {
    logo?: ImageTransform;
    profile?: ImageTransform;
    cover?: ImageTransform;
  };
};

const fontOptions = [
  { value: "inter", label: "Inter", className: inter.className },
  { value: "roboto", label: "Roboto", className: roboto.className },
  { value: "nunito", label: "Nunito", className: nunito.className },
  { value: "montserrat", label: "Montserrat", className: montserrat.className },
  { value: "opensans", label: "Open Sans", className: openSans.className },
];

const colorOptions = [
  {
    value: "gradient",
    label: "Gradient",
    color: "bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400",
  },
  { value: "red", label: "Red", color: "bg-red-400" },
  { value: "orange", label: "Orange", color: "bg-orange-400" },
  { value: "amber", label: "Amber", color: "bg-amber-400" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-400" },
  { value: "lime", label: "Lime", color: "bg-lime-400" },
  { value: "green", label: "Green", color: "bg-green-400" },
  { value: "emerald", label: "Emerald", color: "bg-emerald-400" },
  { value: "teal", label: "Teal", color: "bg-teal-400" },
  { value: "cyan", label: "Cyan", color: "bg-cyan-400" },
  { value: "sky", label: "Sky", color: "bg-sky-400" },
  { value: "blue", label: "Blue", color: "bg-blue-400" },
  { value: "indigo", label: "Indigo", color: "bg-indigo-400" },
  { value: "violet", label: "Violet", color: "bg-violet-400" },
  { value: "purple", label: "Purple", color: "bg-purple-400" },
  { value: "fuchsia", label: "Fuchsia", color: "bg-fuchsia-400" },
  { value: "pink", label: "Pink", color: "bg-pink-400" },
  { value: "rose", label: "Rose", color: "bg-rose-400" },
  { value: "slate", label: "Slate", color: "bg-slate-400" },
  { value: "gray", label: "Gray", color: "bg-gray-400" },
  { value: "zinc", label: "Zinc", color: "bg-zinc-400" },
  { value: "neutral", label: "Neutral", color: "bg-neutral-400" },
  { value: "stone", label: "Stone", color: "bg-stone-400" },
];

export function CardDesign({
  onSave,
  initialValues,
}: {
  onSave: (data: CardDesignValues) => void;
  initialValues?: CardDesignValues;
}) {
  const [logoImage, setLogoImage] = useState<string | null>(
    initialValues?.logoImage || null,
  );
  const [profileImage, setProfileImage] = useState<string | null>(
    initialValues?.profileImage || null,
  );
  const [coverImage, setCoverImage] = useState<string | null>(
    initialValues?.coverImage || null,
  );
  const [cardColor, setCardColor] = useState(initialValues?.cardColor || "red");
  const [fontFamily, setFontFamily] = useState(
    initialValues?.fontFamily || "inter",
  );
  const [imageTransforms, setImageTransforms] = useState<{
    logo?: ImageTransform;
    profile?: ImageTransform;
    cover?: ImageTransform;
  }>(initialValues?.imageTransforms || {});
  const [isUploading, setIsUploading] = useState<{
    logo?: boolean;
    profile?: boolean;
    cover?: boolean;
  }>({});

  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<
    "logo" | "profile" | "cover" | null
  >(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  useEffect(() => {
    onSave({
      cardColor,
      fontFamily,
      logoImage,
      profileImage,
      coverImage,
      imageTransforms,
    });
  }, [
    cardColor,
    fontFamily,
    logoImage,
    profileImage,
    coverImage,
    imageTransforms,
    onSave,
  ]);

  const handleImageClick = (type: "logo" | "profile" | "cover") => {
    let currentImage = null;
    if (type === "logo") currentImage = logoImage;
    if (type === "profile") currentImage = profileImage;
    if (type === "cover") currentImage = coverImage;

    if (currentImage) {
      setCurrentImageType(type);
      setTempImage(currentImage);
      setImageEditorOpen(true);
    } else {
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
      toast.error("File size exceeds 5MB limit");
      fileInput.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      fileInput.value = "";
      return;
    }

    setIsUploading((prev) => ({ ...prev, [type]: true }));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      setCurrentImageType(type);
      setTempImage(result);
      setImageEditorOpen(true);

      setIsUploading((prev) => ({ ...prev, [type]: false }));
      fileInput.value = "";
    };
    reader.onerror = () => {
      setIsUploading((prev) => ({ ...prev, [type]: false }));
      toast.error(`Failed to upload ${type} image`);
      fileInput.value = "";
    };
    reader.readAsDataURL(file);
  }

  const handleSaveImage = (type: string, transform: ImageTransform) => {
    if (!tempImage) return;

    if (type === "logo") setLogoImage(tempImage);
    if (type === "profile") setProfileImage(tempImage);
    if (type === "cover") setCoverImage(tempImage);

    setImageTransforms((prev) => ({
      ...prev,
      [type]: transform,
    }));

    toast.success(
      `${type.charAt(0).toUpperCase() + type.slice(1)} image updated`,
    );
    setImageEditorOpen(false);
  };

  const handleDeleteImage = (type: string) => {
    if (type === "logo") setLogoImage(null);
    if (type === "profile") setProfileImage(null);
    if (type === "cover") setCoverImage(null);

    const newTransforms = { ...imageTransforms };
    delete newTransforms[type as keyof typeof newTransforms];
    setImageTransforms(newTransforms);

    toast.success(
      `${type.charAt(0).toUpperCase() + type.slice(1)} image removed`,
    );
    setImageEditorOpen(false);
  };

  const getImageContainerClass = (type: "logo" | "profile" | "cover") => {
    if (type === "logo")
      return "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors";
    if (type === "profile")
      return "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors";
    return "relative flex h-20 w-40 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors";
  };

  const getImageUrl = (type: "logo" | "profile" | "cover") => {
    const transform = imageTransforms[type];
    if (transform?.croppedImageUrl) {
      return transform.croppedImageUrl;
    }

    if (type === "logo") return logoImage;
    if (type === "profile") return profileImage;
    return coverImage;
  };

  const selectedFont =
    fontOptions.find((font) => font.value === fontFamily) || fontOptions[0];

  return (
    <Card className="rounded-lg">
      <CardContent>
        <Label className="mb-3 text-base leading-none font-semibold">
          Add Images
        </Label>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-3">
            <Label className="text-sm">Company Logo</Label>
            <div className="flex flex-col items-center gap-2">
              <div
                className={getImageContainerClass("logo")}
                onClick={() => handleImageClick("logo")}
              >
                {logoImage ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageUrl("logo") || "/placeholder.svg"}
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
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "logo")}
                disabled={isUploading.logo}
              />
              {isUploading.logo ? (
                <p className="text-muted-foreground text-xs">Uploading...</p>
              ) : (
                <p className="text-muted-foreground text-center text-xs">
                  {logoImage ? "Click to edit" : "Square, 400x400px"}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <Label className="text-sm">Profile Picture</Label>
            <div className="flex flex-col items-center gap-2">
              <div
                className={getImageContainerClass("profile")}
                onClick={() => handleImageClick("profile")}
              >
                {profileImage ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageUrl("profile") || "/placeholder.svg"}
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
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "profile")}
                disabled={isUploading.profile}
              />
              {isUploading.profile ? (
                <p className="text-muted-foreground text-xs">Uploading...</p>
              ) : (
                <p className="text-muted-foreground text-center text-xs">
                  {profileImage ? "Click to edit" : "Square, 400x400px"}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <Label className="text-sm">Cover Photo</Label>
            <div className="flex flex-col items-center gap-2">
              <div
                className={getImageContainerClass("cover")}
                onClick={() => handleImageClick("cover")}
              >
                {coverImage ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageUrl("cover") || "/placeholder.svg"}
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
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "cover")}
                disabled={isUploading.cover}
              />
              {isUploading.cover ? (
                <p className="text-muted-foreground text-xs">Uploading...</p>
              ) : (
                <p className="text-muted-foreground text-center text-xs">
                  {coverImage ? "Click to edit" : "800x400px, 2:1 ratio"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <Label className="text-base">Color</Label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`h-12 w-12 cursor-pointer rounded-md border-2 transition-all ${color.color} ${cardColor === color.value ? "scale-110 ring-2 ring-black ring-offset-2" : "border-transparent hover:scale-105"} `}
                onClick={() => setCardColor(color.value)}
                title={color.label}
                type="button"
                aria-label={`Select ${color.label} color`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base">Font</Label>
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
      </CardContent>

      <ImageEditor
        open={imageEditorOpen}
        onOpenChange={setImageEditorOpen}
        imageType={currentImageType}
        imageUrl={tempImage}
        initialTransform={
          currentImageType ? imageTransforms[currentImageType] : undefined
        }
        onSave={handleSaveImage}
        onDelete={handleDeleteImage}
      />
    </Card>
  );
}
