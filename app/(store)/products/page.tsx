import { Suspense } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStoreProducts, getStoreCategories } from "../actions";
import { ProductCard } from "@/components/store/product-card";

interface PageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
        page?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const { category, search, page } = params;

    const [{ products, total, pages, currentPage }, categories] = await Promise.all([
        getStoreProducts({
            category,
            search,
            page: page ? parseInt(page) : 1,
        }),
        getStoreCategories(),
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    {category ? categories.find((c: { slug: string }) => c.slug === category)?.name || "Products" : "All Products"}
                </h1>
                <p className="text-gray-600">
                    {total} product{total !== 1 ? "s" : ""} found
                </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:col-span-1">
                    <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-24">
                        {/* Search */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Search
                            </h3>
                            <form action="/products" method="GET">
                                <Input
                                    name="search"
                                    placeholder="Search products..."
                                    defaultValue={search}
                                    className="bg-white/80"
                                />
                                {category && <input type="hidden" name="category" value={category} />}
                            </form>
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                Categories
                            </h3>
                            <div className="space-y-1">
                                <Link
                                    href={search ? `/products?search=${search}` : "/products"}
                                    className={`block px-3 py-2 rounded-xl text-sm transition-colors ${!category
                                            ? "bg-violet-100 text-violet-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    All Categories
                                </Link>
                                {categories.map((cat: { _id: string; name: string; slug: string }) => (
                                    <Link
                                        key={cat._id}
                                        href={search ? `/products?category=${cat.slug}&search=${search}` : `/products?category=${cat.slug}`}
                                        className={`block px-3 py-2 rounded-xl text-sm transition-colors ${category === cat.slug
                                                ? "bg-violet-100 text-violet-700 font-medium"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(category || search) && (
                            <Link href="/products">
                                <Button variant="outline" className="w-full rounded-xl">
                                    Clear Filters
                                </Button>
                            </Link>
                        )}
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                    {products.length > 0 ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {products.map((product: {
                                    _id: string;
                                    name: string;
                                    price: number;
                                    images: string[];
                                    category?: { name: string };
                                }) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pages > 1 && (
                                <div className="flex justify-center gap-2">
                                    {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
                                        <Link
                                            key={pageNum}
                                            href={`/products?page=${pageNum}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                                        >
                                            <Button
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                size="sm"
                                                className="rounded-xl"
                                            >
                                                {pageNum}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                            <p className="text-gray-500 mt-2">
                                {search
                                    ? `No products match "${search}"`
                                    : "No products available in this category"}
                            </p>
                            <Link href="/products" className="mt-4 inline-block">
                                <Button variant="outline" className="rounded-xl">
                                    Clear Filters
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
