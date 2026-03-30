"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";

export default function CartPage() {
    const cart = useCart();
    const items = cart.items;
    const totalPrice = cart.totalPrice();
    const totalItems = cart.totalItems();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
                    <p className="text-gray-600 mt-1">
                        {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
                    </p>
                </div>
                <Link
                    href="/products"
                    className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                </Link>
            </div>

            {items.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="glass-card rounded-2xl p-4 md:p-6"
                            >
                                <div className="flex gap-4 md:gap-6">
                                    {/* Image */}
                                    <Link
                                        href={`/product/${item.productId}`}
                                        className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50"
                                    >
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Package className="h-8 w-8 text-gray-300" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <Link
                                            href={`/product/${item.productId}`}
                                            className="font-semibold text-gray-900 hover:text-violet-600 transition-colors line-clamp-2"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-lg font-bold gradient-text">
                                            ${item.price.toFixed(2)}
                                        </p>

                                        {/* Quantity & Actions */}
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg"
                                                    onClick={() =>
                                                        cart.updateQuantity(
                                                            item.productId,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-10 text-center font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg"
                                                    onClick={() =>
                                                        cart.updateQuantity(
                                                            item.productId,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                onClick={() => cart.removeItem(item.productId)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm text-gray-500">Subtotal</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart */}
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl"
                                onClick={() => cart.clearCart()}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-24">
                            <h2 className="text-xl font-bold">Order Summary</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{totalPrice >= 50 ? "Free" : "$5.99"}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="gradient-text">
                                    ${(
                                        totalPrice +
                                        (totalPrice >= 50 ? 0 : 5.99) +
                                        totalPrice * 0.08
                                    ).toFixed(2)}
                                </span>
                            </div>

                            {totalPrice < 50 && (
                                <div className="p-3 rounded-xl bg-violet-50 text-center">
                                    <p className="text-sm text-violet-600">
                                        Add ${(50 - totalPrice).toFixed(2)} more for free
                                        shipping!
                                    </p>
                                </div>
                            )}

                            <Link href="/checkout">
                                <Button className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg glow-hover">
                                    Proceed to Checkout
                                </Button>
                            </Link>

                            <p className="text-xs text-center text-gray-500">
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6">
                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Looks like you haven&apos;t added anything to your cart yet.
                    </p>
                    <Link href="/products">
                        <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg glow-hover">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
