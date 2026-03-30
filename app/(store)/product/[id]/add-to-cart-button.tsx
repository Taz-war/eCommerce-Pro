"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
}

export function AddToCartButton({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const cart = useCart();

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            cart.addItem({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0] || "",
            });
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 glass-card rounded-xl px-4 py-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 h-12 rounded-xl text-base font-semibold transition-all duration-300 ${added
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    } text-white shadow-lg glow-hover`}
            >
                {added ? (
                    <>
                        <Check className="h-5 w-5 mr-2" />
                        Added to Cart!
                    </>
                ) : (
                    <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart - ${(product.price * quantity).toFixed(2)}
                    </>
                )}
            </Button>
        </div>
    );
}
