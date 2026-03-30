import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Store,
    DollarSign,
    LogOut,
    Shield,
    Users,
    TrendingUp
} from "lucide-react";
import { signOut } from "@/lib/auth";

async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
}

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user || session.user.email !== process.env.SUPER_ADMIN_EMAIL) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-600">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">Super Admin</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-4">
                        <Link
                            href="/super-admin"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/super-admin/stores"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <Store className="h-5 w-5" />
                            Stores
                        </Link>
                        <Link
                            href="/super-admin/revenue"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <DollarSign className="h-5 w-5" />
                            Revenue
                        </Link>
                    </nav>

                    {/* User section */}
                    <div className="border-t border-gray-800 p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-600">
                                <span className="text-sm font-semibold text-white">
                                    {session.user.name?.charAt(0) || "A"}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {session.user.name}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    Super Admin
                                </p>
                            </div>
                        </div>
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-64 min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-orange-500">
                            <TrendingUp className="h-5 w-5" />
                            <span className="text-sm font-medium">Platform Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
