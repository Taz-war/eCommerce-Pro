import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, FolderTree, TrendingUp, Clock } from "lucide-react";
import { getDashboardStats } from "./actions";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
    const result = await getDashboardStats();
    const stats = result.success ? result.data : null;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your eCommerce admin panel. Here&apos;s an overview of your store.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Products
                        </CardTitle>
                        <Package className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.productCount ?? 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Products in inventory
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-4 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Orders
                        </CardTitle>
                        <ShoppingCart className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.orderCount ?? 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Orders placed
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-4 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Orders
                        </CardTitle>
                        <Clock className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.pendingOrders ?? 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting shipment
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-4 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Categories
                        </CardTitle>
                        <FolderTree className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats?.categoryCount ?? 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Product categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Recent Orders
                    </CardTitle>
                    <CardDescription>
                        Latest orders from your customers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentOrders.map((order: any) => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{order.user?.name || "Customer"}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {order.items?.length || 0} items • ${order.totalPrice?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant={order.status === "shipped" ? "default" : "secondary"}
                                            className={
                                                order.status === "shipped"
                                                    ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                                    : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No orders yet</p>
                            <p className="text-sm text-muted-foreground/70">
                                Orders will appear here once customers start purchasing
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
