import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getProduct } from "../../../actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    const [productResult, categoriesResult] = await Promise.all([
        getProduct(id),
        getCategories(),
    ]);

    if (!productResult.success || !productResult.data) {
        notFound();
    }

    const product = productResult.data;
    const categories = categoriesResult.success ? categoriesResult.data : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/products">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-muted-foreground">
                        Update product details for {product.name}
                    </p>
                </div>
            </div>

            <ProductForm categories={categories} initialData={product} />
        </div>
    );
}
