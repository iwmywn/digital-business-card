"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import { Progress } from "@/components/ui/progress"

export function TopProgressBar() {
  const pathname = usePathname()
  const [value, setValue] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false)
  const isNavigating = useRef<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastPath = useRef<string>(pathname)

  const done = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setValue(100)
    setTimeout(() => {
      setVisible(false)
      setValue(0)
      isNavigating.current = false
    }, 300)
  }, [])

  const start = useCallback(() => {
    if (isNavigating.current) return
    isNavigating.current = true
    setVisible(true)
    setValue(10)

    intervalRef.current = setInterval(() => {
      setValue((prev) => (prev < 90 ? prev + 10 : prev))
    }, 200)
  }, [])

  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname
      done()
    }
  }, [pathname, done])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a") as HTMLAnchorElement | null

      if (
        link &&
        link.href &&
        link.target !== "_blank" &&
        link.origin === window.location.origin &&
        e.button === 0 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const linkUrl = new URL(link.href)
        if (linkUrl.pathname === pathname || linkUrl.protocol === "blob:")
          return
        const targetPath = linkUrl.pathname + linkUrl.search + linkUrl.hash
        if (targetPath !== pathname) {
          start()
        } else {
          start()
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => {
            done()
          }, 800)
        }
      }
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [start, done, pathname])

  if (!visible) return null

  return (
    <div className="fixed top-0 right-0 left-0 z-10000 h-1">
      <Progress value={value} className="h-1" />
    </div>
  )
}
