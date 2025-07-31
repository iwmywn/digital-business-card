"use client"

import { useEffect, useState } from "react"

export const menuItems = [
  { id: "how-it-works", label: "How It Works" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "testimonials", label: "Testimonials" },
]

export function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (element) {
    window.scrollTo({ top: element.offsetTop, behavior: "smooth" })
  }
}

export function HeaderNav() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        let activeFound = false

        for (const item of menuItems) {
          const el = document.getElementById(item.id)

          if (el) {
            const rect = el.getBoundingClientRect()
            const intersectionHeight = Math.max(
              0,
              Math.min(rect.bottom, window.innerHeight) - Math.max(0, rect.top)
            )
            const visiblePercentage =
              (intersectionHeight / el.offsetHeight) * 100

            if (visiblePercentage >= 20) {
              setActiveSection(item.id)
              activeFound = true
              break
            }
          }
        }

        if (!activeFound) {
          setActiveSection(null)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className="hidden gap-8 lg:flex">
      {menuItems.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={`text-sm font-medium transition-colors ${
            activeSection === id
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
