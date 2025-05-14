import { allColorOptions, allFontOptions } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ImageTransform } from "@/components/image-editor-dialog";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColorClass(value: string) {
  return allColorOptions.find((option) => option.value === value)?.color || "";
}

export function getFontClass(value: string) {
  return (
    allFontOptions.find((option) => option.value === value)?.className || ""
  );
}

export function getCloudinaryUrl(path?: string, transform?: ImageTransform) {
  if (!path) return "/placeholder.svg";

  const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;

  if (transform && transform.croppedAreaPixels) {
    const cropParams = [
      `x_${Math.round(transform.croppedAreaPixels.x)}`,
      `y_${Math.round(transform.croppedAreaPixels.y)}`,
      `w_${Math.round(transform.croppedAreaPixels.width)}`,
      `h_${Math.round(transform.croppedAreaPixels.height)}`,
      "c_crop",
    ];
    const transformation = cropParams.join(",");
    return `https://res.cloudinary.com/${cloudinaryName}/image/upload/${transformation}/${path}`;
  }

  return `https://res.cloudinary.com/${cloudinaryName}/image/upload/${path}`;
}

export function extractCloudinaryPath(cloudinaryUrl: string) {
  const pathParts = cloudinaryUrl.split("/upload/");
  if (pathParts.length > 1) {
    return { path: pathParts[1] as string };
  }
  return { error: "Invalid secure URL structure!" };
}
