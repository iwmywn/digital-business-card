"use server"

import { clientEnv } from "@/env/client"
import { serverEnv } from "@/env/server"

import { extractCloudinaryPath } from "@/lib/utils"

export async function uploadToCloudinary(
  imageData: string,
  folder: string
): Promise<
  | {
      path: string
      error?: undefined
    }
  | {
      error: string
      path?: undefined
    }
> {
  try {
    const base64Data = imageData.includes("base64,")
      ? imageData.split("base64,")[1]
      : imageData

    const timestamp = Math.round(new Date().getTime() / 1000)

    const signature = await generateSignature(
      `folder=digital-business-card/${folder}&timestamp=${timestamp}${serverEnv.CLOUDINARY_SECRET}`
    )

    const formData = new FormData()
    formData.append("file", `data:image/jpeg;base64,${base64Data}`)
    formData.append("api_key", clientEnv.NEXT_PUBLIC_CLOUDINARY_KEY)
    formData.append("timestamp", timestamp.toString())
    formData.append("signature", signature)
    formData.append("folder", `digital-business-card/${folder}`)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${clientEnv.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!res.ok) {
      const error = await res.text()
      console.error("Cloudinary upload failed: ", error)
      return { error: "Cloudinary upload failed!" }
    }

    const data = await res.json()
    return extractCloudinaryPath(data.secure_url)
  } catch (error) {
    console.error("Error uploading to cloudinary: ", error)
    return {
      error: "Failed to uploda to clouddinary! Please try again later.",
    }
  }
}

async function generateSignature(string: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(string)
  const hashBuffer = await crypto.subtle.digest("SHA-1", data)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
