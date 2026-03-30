import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar, AdminSidebarTrigger } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AdminSidebar />
                <SidebarInset className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <AdminSidebarTrigger />
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Welcome back, Admin</span>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto bg-muted/30 p-6">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
