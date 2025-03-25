import type React from "react"
import { Sidebar, SidebarProvider, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { env } from "@/lib/env"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <MainNav />
            <UserNav />
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <Sidebar className="hidden md:block">
            <SidebarHeader className="flex h-[60px] items-center border-b px-6">
              <span className="font-semibold">{env.NEXT_PUBLIC_APP_NAME}</span>
            </SidebarHeader>
            <SidebarContent>
              <DashboardNav />
            </SidebarContent>
            <SidebarFooter className="flex items-center justify-between border-t p-4">
              <div className="text-xs text-muted-foreground">v{env.NEXT_PUBLIC_APP_VERSION}</div>
              <ModeToggle />
            </SidebarFooter>
          </Sidebar>
          <main className="flex w-full flex-col overflow-hidden">{children}</main>
        </div>
        <SiteFooter />
      </div>
    </SidebarProvider>
  )
}

