"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggleSkeleton } from "@/components/skeletons"
import { useMounted } from "@/hooks/use-mounted"

export function DashboardThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild title="Toggle Color Scheme">
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LandingPageThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return <ThemeToggleSkeleton />
  }

  return (
    <>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        className="size-7 rounded-sm"
      >
        <Monitor />
        <span className="sr-only">System theme</span>
      </Button>
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        className="size-7 rounded-sm"
      >
        <Sun />
        <span className="sr-only">Light theme</span>
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        className="size-7 rounded-sm"
      >
        <Moon />
        <span className="sr-only">Dark theme</span>
      </Button>
    </>
  )
}
