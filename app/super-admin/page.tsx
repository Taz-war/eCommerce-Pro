import {
    Store,
    Users,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    ArrowUpRight
} from "lucide-react";
import { getPlatformStats } from "./actions";

export default async function SuperAdminDashboard() {
    const stats = await getPlatformStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Platform Dashboard</h1>
                <p className="text-gray-400 mt-1">Overview of all stores and platform metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Stores */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                            <Store className="h-6 w-6 text-blue-500" />
                        </div>
                        <span className="flex items-center text-sm text-green-500">
                            <ArrowUpRight className="h-4 w-4" />
                            Active
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-3xl font-bold text-white">{stats.totalStores}</p>
                        <p className="text-sm text-gray-400 mt-1">Total Stores</p>
                    </div>
                    <div className="mt-3 flex gap-4 text-sm">
                        <span className="text-green-400">{stats.activeStores} active</span>
                        <span className="text-red-400">{stats.suspendedStores} suspended</span>
                    </div>
                </div>

                {/* Total Merchants */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                            <Users className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                        <p className="text-sm text-gray-400 mt-1">Merchants</p>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                            <ShoppingCart className="h-6 w-6 text-orange-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                        <p className="text-sm text-gray-400 mt-1">Total Orders</p>
                    </div>
                </div>

                {/* Platform Revenue */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                            <DollarSign className="h-6 w-6 text-green-500" />
                        </div>
                        <span className="flex items-center text-sm text-green-500">
                            <TrendingUp className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-3xl font-bold text-white">
                            ${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Platform Revenue</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/super-admin/stores"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <Store className="h-5 w-5 text-blue-500" />
                        <span className="text-white">Manage Stores</span>
                    </a>
                    <a
                        href="/super-admin/revenue"
                        className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <span className="text-white">View Revenue</span>
                    </a>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 border border-dashed border-gray-700">
                        <TrendingUp className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-500">Stripe Integration (Coming)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
