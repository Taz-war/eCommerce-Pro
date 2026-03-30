import { ShoppingCart } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getOrders } from "../actions";

export default async function OrdersPage() {
    const result = await getOrders();
    const orders = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">
                    Track and manage customer orders
                </p>
            </div>

            {/* Orders Table */}
            {orders.length > 0 ? (
                <DataTable columns={columns} data={orders} />
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No orders yet</h3>
                    <p className="text-sm text-muted-foreground">
                        Orders will appear here once customers start purchasing.
                    </p>
                </div>
            )}
        </div>
    );
}
