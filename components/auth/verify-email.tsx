"use client"

import { useEffect, useState } from "react"
import { Check, X, type LucideIcon } from "lucide-react"

import { verifyEmail } from "@/actions/auth"
import { Loading } from "@/components/loading"

export function VerifyEmail({
  token,
  email,
}: {
  token: string | undefined
  email: string | undefined
}) {
  const [Icon, setIcon] = useState<LucideIcon>(() => X)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const { success, error } = await verifyEmail(email, token)

      if (error || !success) {
        setMessage(error)
      } else {
        setIcon(() => Check)
        setMessage(success)
      }
      setIsLoading(false)
    })()
  }, [token, email])

  if (isLoading) {
    return (
      <Loading className="border-primary border-t-primary-foreground/10 size-8" />
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 text-sm">
        <Icon className="size-[1.875rem]" />
        {message}
      </div>
    </>
  )
}
