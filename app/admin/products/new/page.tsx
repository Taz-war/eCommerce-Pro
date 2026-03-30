import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "../../actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NewProductPage() {
    const result = await getCategories();
    const categories = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/products">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
                    <p className="text-muted-foreground">
                        Add a new product to your inventory
                    </p>
                </div>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
