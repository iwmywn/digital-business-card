import { allColorOptions, allFontOptions } from "@/constants"
import { clientEnv } from "@/env/client"
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { format } from "date-fns"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

import type { Image } from "@/components/card/card-design"
import type { ImageTransform } from "@/components/image-editor-dialog"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorClass(value: string) {
  return allColorOptions.find((option) => option.value === value)?.color || ""
}

export function getFontClass(value: string) {
  return (
    allFontOptions.find((option) => option.value === value)?.className || ""
  )
}

export function getCloudinaryUrl(
  path?: Image,
  transform?: ImageTransform
): string {
  if (transform?.croppedImageUrl) return transform.croppedImageUrl
  if (!path) return "/placeholder.svg"

  const optimizations = "f_auto,q_auto"

  if (transform && transform.croppedAreaPixels) {
    const cropParams = [
      `x_${Math.round(transform.croppedAreaPixels.x)}`,
      `y_${Math.round(transform.croppedAreaPixels.y)}`,
      `w_${Math.round(transform.croppedAreaPixels.width)}`,
      `h_${Math.round(transform.croppedAreaPixels.height)}`,
      "c_crop",
    ]
    const transformation = cropParams.join(",")
    return `https://res.cloudinary.com/${path[0]}/image/upload/${transformation},${optimizations}/${path[1]}`
  }

  return `https://res.cloudinary.com/${path[0]}/image/upload/${optimizations}/${path[1]}`
}

export function extractCloudinaryPath(cloudinaryUrl: string) {
  const pathParts = cloudinaryUrl.split("/upload/")
  if (pathParts.length > 1) {
    return { path: pathParts[1] as string }
  }
  return { error: "Invalid secure URL structure!" }
}

export function formatDate(
  date: Date | string,
  withTime: boolean = false
): string {
  return withTime
    ? format(new Date(date), "MMMM d, yyyy 'at' h:mm:ss a")
    : format(new Date(date), "MMMM d, yyyy")
}

export function handleCopyLink(slug: string) {
  const link = `${clientEnv.NEXT_PUBLIC_URL}/card/${slug}`
  navigator.clipboard.writeText(link)
  toast.info("Link copied.")
}

export function someRight<T>(
  arr: T[],
  predicate: (item: T) => boolean
): boolean {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return true
  }
  return false
}

export function getPrimaryOgImage({
  fullName,
  profileImage,
  logoImage,
  coverImage,
  imageTransforms,
}: {
  fullName: string
  profileImage?: Image
  logoImage?: Image
  coverImage?: Image
  imageTransforms?: {
    logo?: ImageTransform
    profile?: ImageTransform
    cover?: ImageTransform
  }
}): { url: string; alt: string } | null {
  if (profileImage) {
    return {
      url: getCloudinaryUrl(profileImage, imageTransforms?.profile),
      alt: `${fullName}'s profile picture`,
    }
  }

  if (logoImage) {
    return {
      url: getCloudinaryUrl(logoImage, imageTransforms?.logo),
      alt: `${fullName}'s company logo`,
    }
  }

  if (coverImage) {
    return {
      url: getCloudinaryUrl(coverImage, imageTransforms?.cover),
      alt: `${fullName}'s cover photo`,
    }
  }

  return null
}

export function parseFullName(fullName: string): {
  firstName: string
  middleName: string
  lastName: string
} {
  const nameParts = fullName.trim().split(/\s+/)

  let firstName = ""
  let middleName = ""
  let lastName = ""

  if (nameParts.length === 1) {
    firstName = nameParts[0]
  } else if (nameParts.length === 2) {
    ;[lastName, firstName] = nameParts
  } else {
    lastName = nameParts[0]
    firstName = nameParts[nameParts.length - 1]
    middleName = nameParts.slice(1, -1).join(" ")
  }

  return { firstName, middleName, lastName }
}
