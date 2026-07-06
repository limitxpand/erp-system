import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full flex flex-col h-screen overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
          <SidebarTrigger />
          <div className="w-full flex-1">
            {/* Topbar Search or Breadcrumbs can go here */}
          </div>
          <div className="flex items-center gap-4">
            {/* User Nav */}
            <span className="text-sm font-medium">Admin User</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
