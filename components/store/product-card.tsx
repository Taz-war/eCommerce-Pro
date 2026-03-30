"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category?: { name: string };
}

export function ProductCard({ product }: { product: Product }) {
    const cart = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        cart.addItem({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0] || "",
        });
    };

    return (
        <Link href={`/product/${product._id}`} className="group">
            <div className="glass-card rounded-2xl overflow-hidden">
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-gray-300" />
                        </div>
                    )}

                    {/* Quick Add Button */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <Button
                            onClick={handleAddToCart}
                            className="w-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white rounded-xl shadow-lg"
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    {product.category && (
                        <span className="text-xs text-violet-600 font-medium uppercase tracking-wider">
                            {product.category.name}
                        </span>
                    )}
                    <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-violet-600 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
