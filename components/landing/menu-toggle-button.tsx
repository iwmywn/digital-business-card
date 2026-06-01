"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { menuItems, scrollToSection } from "@/components/landing/header-nav"

export function MenuToggleButton() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden"
      >
        <Menu />
        <span className="sr-only">Menu</span>
      </Button>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        shouldScaleBackground
        setBackgroundColorOnScale={false}
      >
        <DrawerContent>
          <DrawerTitle className="sr-only">Navigate</DrawerTitle>

          <nav className="space-y-4 px-4 py-2">
            {menuItems.map(({ id, label }) => (
              <Button
                key={id}
                variant="ghost"
                onClick={() => {
                  setIsDrawerOpen(false)
                  scrollToSection(id)
                }}
                className="w-full text-base"
              >
                {label}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full text-base sm:hidden"
              onClick={() => setIsDrawerOpen(false)}
              asChild
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full text-base sm:hidden"
              onClick={() => setIsDrawerOpen(false)}
              asChild
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </DrawerContent>
      </Drawer>
    </>
  )
}
