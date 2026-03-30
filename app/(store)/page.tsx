import Link from "next/link";
import { ArrowRight, Sparkles, ShoppingBag, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts, getStoreCategories } from "./actions";
import { ProductCard } from "@/components/store/product-card";

export default async function HomePage() {
    const [products, categories] = await Promise.all([
        getFeaturedProducts(8),
        getStoreCategories(),
    ]);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl">
                <div className="glass-light p-8 md:p-12 lg:p-16">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                                <Sparkles className="h-4 w-4" />
                                New Collection Available
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Discover
                                <span className="gradient-text"> Premium </span>
                                Products
                            </h1>
                            <p className="text-lg text-gray-600 max-w-md">
                                Explore our curated collection of high-quality products
                                designed to elevate your lifestyle.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/products">
                                    <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30 glow-hover rounded-xl gap-2">
                                        Shop Now
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/products">
                                    <Button size="lg" variant="outline" className="rounded-xl border-gray-300 hover:bg-gray-50">
                                        View Collection
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-3xl blur-3xl opacity-30" />
                                <div className="relative glass rounded-3xl p-8 aspect-square flex items-center justify-center">
                                    <ShoppingBag className="h-32 w-32 text-violet-500 opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="grid sm:grid-cols-3 gap-4">
                {[
                    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
                    { icon: Shield, title: "Secure Payment", desc: "100% protected" },
                    { icon: Sparkles, title: "Premium Quality", desc: "Curated products" },
                ].map((feature, i) => (
                    <div key={i} className="glass-card rounded-2xl p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white mb-4">
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                    </div>
                ))}
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
                        <Link href="/products" className="text-violet-600 hover:text-violet-700 font-medium text-sm flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.slice(0, 4).map((category: { _id: string; name: string; slug: string }) => (
                            <Link
                                key={category._id}
                                href={`/products?category=${category.slug}`}
                                className="glass-card rounded-2xl p-6 text-center group"
                            >
                                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
                    <Link href="/products" className="text-violet-600 hover:text-violet-700 font-medium text-sm flex items-center gap-1">
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
                ) : (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">No products yet</h3>
                        <p className="text-gray-500 mt-2">
                            Check back soon for new arrivals!
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
