import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { HeaderNav } from "@/components/landing/header-nav"
import { MenuToggleButton } from "@/components/landing/menu-toggle-button"

export function Header() {
  return (
    <header className="bg-background/75 sticky top-0 z-50 flex shrink-0 items-center justify-between border-b backdrop-blur-xs backdrop-saturate-150">
      <div className="flex h-16 w-full items-center justify-between px-6 md:px-8 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold"
        >
          <Image
            src="/images/logo.png"
            alt="Visiq Logo"
            width={24}
            height={24}
            className="rounded-lg"
          />
          <span className="sr-only sm:not-sr-only">Visiq</span>
        </Link>

        <HeaderNav />

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            asChild
          >
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <MenuToggleButton />
        </div>
      </div>
    </header>
  )
}
