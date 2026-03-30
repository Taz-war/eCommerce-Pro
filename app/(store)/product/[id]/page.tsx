import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStoreProduct, getRelatedProducts } from "../../actions";
import { ProductCard } from "@/components/store/product-card";
import { AddToCartButton } from "./add-to-cart-button";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getStoreProduct(id);

    if (!product) {
        notFound();
    }

    const relatedProducts = product.category?._id
        ? await getRelatedProducts(id, product.category._id)
        : [];

    return (
        <div className="space-y-12">
            {/* Back Button */}
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
            </Link>

            {/* Product Detail */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Images */}
                <div className="space-y-4">
                    <div className="glass-card rounded-3xl overflow-hidden aspect-square relative">
                        {product.images[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                                <Package className="h-24 w-24 text-gray-300" />
                            </div>
                        )}
                    </div>
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.slice(0, 4).map((image: string, index: number) => (
                                <div
                                    key={index}
                                    className="glass-card rounded-xl overflow-hidden aspect-square relative cursor-pointer"
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-6">
                    {product.category && (
                        <Link href={`/products?category=${product.category.slug}`}>
                            <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-200">
                                {product.category.name}
                            </Badge>
                        </Link>
                    )}

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {product.name}
                    </h1>

                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-bold gradient-text">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                        {product.stock > 0 ? (
                            <>
                                <div className="flex items-center gap-1.5 text-green-600">
                                    <Check className="h-4 w-4" />
                                    <span className="text-sm font-medium">In Stock</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    ({product.stock} available)
                                </span>
                            </>
                        ) : (
                            <span className="text-sm font-medium text-red-600">Out of Stock</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>

                    {/* Add to Cart */}
                    <AddToCartButton product={product} />

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Free Shipping", value: "On orders $50+" },
                            { label: "Returns", value: "30-day policy" },
                        ].map((feature, i) => (
                            <div key={i} className="glass-card rounded-xl p-4">
                                <p className="text-sm font-medium text-gray-900">{feature.label}</p>
                                <p className="text-xs text-gray-500">{feature.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Related Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((product: {
                            _id: string;
                            name: string;
                            price: number;
                            images: string[];
                            category?: { name: string };
                        }) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
