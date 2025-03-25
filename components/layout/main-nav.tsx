"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-4">
      <SidebarTrigger className="md:hidden" />
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/analytics"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/analytics") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Analytics
        </Link>
        <Link
          href="/help"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/help") ? "text-foreground font-medium" : "text-foreground/60",
          )}
        >
          Help
        </Link>
      </nav>
    </div>
  )
}

