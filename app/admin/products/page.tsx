import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getProducts } from "../actions";

export default async function ProductsPage() {
    const result = await getProducts();
    const products = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your product inventory
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/admin/products/new">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* Products Table */}
            {products.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={products}
                    searchKey="name"
                    searchPlaceholder="Search products..."
                />
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
                    <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No products yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Get started by creating your first product.
                    </p>
                    <Button asChild>
                        <Link href="/admin/products/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
