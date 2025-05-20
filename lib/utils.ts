import { allColorOptions, allFontOptions } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ImageTransform } from "@/components/image-editor-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Image } from "@/components/card-design";

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

export function getCloudinaryUrl(path?: Image, transform?: ImageTransform) {
  if (transform?.croppedImageUrl) return transform.croppedImageUrl;
  if (!path) return "/placeholder.svg";

  if (transform && transform.croppedAreaPixels) {
    const cropParams = [
      `x_${Math.round(transform.croppedAreaPixels.x)}`,
      `y_${Math.round(transform.croppedAreaPixels.y)}`,
      `w_${Math.round(transform.croppedAreaPixels.width)}`,
      `h_${Math.round(transform.croppedAreaPixels.height)}`,
      "c_crop",
    ];
    const transformation = cropParams.join(",");
    return `https://res.cloudinary.com/${path[0]}/image/upload/${transformation}/${path[1]}`;
  }

  return `https://res.cloudinary.com/${path[0]}/image/upload/${path[1]}`;
}

export function extractCloudinaryPath(cloudinaryUrl: string) {
  const pathParts = cloudinaryUrl.split("/upload/");
  if (pathParts.length > 1) {
    return { path: pathParts[1] as string };
  }
  return { error: "Invalid secure URL structure!" };
}

export function isSameDate(
  date1: Date | null | undefined,
  date2: Date | null | undefined,
): boolean {
  if (date1 === null && date2 === null) return true;
  if (date1 === undefined && date2 === undefined) return true;
  if (date1 === null || date2 === null) return false;
  if (date1 === undefined || date2 === undefined) return true;

  return date1.getTime() === date2.getTime();
}

export function formatDate(
  date: Date | string,
  withTime: boolean = false,
): string {
  return withTime
    ? format(new Date(date), "MMMM d, yyyy 'at' h:mm:ss a")
    : format(new Date(date), "MMMM d, yyyy");
}

export function handleCopyLink(slug: string) {
  const link = `${process.env.NEXT_PUBLIC_URL}/card/${slug}`;
  navigator.clipboard.writeText(link);
  toast.success("Link copied to clipboard.");
}

export function checkEnv(vars: Record<string, string | undefined>) {
  const missingVars: string[] = [];

  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(vars)) {
    if (value) {
      result[key] = value;
    } else {
      toast.error(`Missing environment variable: ${key}`);
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
  }

  return result;
}

export function someRight<T>(
  arr: T[],
  predicate: (item: T) => boolean,
): boolean {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return true;
  }
  return false;
}
