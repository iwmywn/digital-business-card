import { allColorOptions, allFontOptions } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ImageTransform } from "@/components/image-editor-dialog";
import { toast } from "sonner";
import { format } from "date-fns";

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
