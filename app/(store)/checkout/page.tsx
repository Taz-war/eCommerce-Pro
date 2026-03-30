"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, MapPin, User, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";
import { createOrder } from "../actions";

export default function CheckoutPage() {
    const cart = useCart();
    const items = cart.items;
    const totalPrice = cart.totalPrice();
    const shipping = totalPrice >= 50 ? 0 : 5.99;
    const tax = totalPrice * 0.08;
    const grandTotal = totalPrice + shipping + tax;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if cart is empty
    if (items.length === 0 && !orderPlaced) {
        return (
            <div className="max-w-md mx-auto glass-card rounded-2xl p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Add items to your cart before checking out.</p>
                <Link href="/products">
                    <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                        Browse Products
                    </Button>
                </Link>
            </div>
        );
    }

    // Order success screen
    if (orderPlaced) {
        return (
            <div className="max-w-md mx-auto glass-card rounded-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                <p className="text-gray-500 mb-6">
                    Thank you for your order. You&apos;ll receive a confirmation email shortly.
                </p>
                <Link href="/products">
                    <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        const result = await createOrder({
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            address: formData.get("address") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            zip: formData.get("zip") as string,
            items: items.map((item) => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            subtotal: totalPrice,
            shipping,
            tax,
            total: grandTotal,
        });

        if (result.success) {
            cart.clearCart();
            setOrderPlaced(true);
        } else {
            setError(result.error || "Failed to place order. Please try again.");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-bold">Checkout</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Sections */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact */}
                        <div className="glass-card rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <User className="h-5 w-5 text-violet-600" />
                                Contact Information
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="your@email.com" required className="bg-white/80" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required className="bg-white/80" />
                                </div>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="glass-card rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <MapPin className="h-5 w-5 text-violet-600" />
                                Shipping Address
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" placeholder="John" required className="bg-white/80" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" placeholder="Doe" required className="bg-white/80" />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" placeholder="123 Main St" required className="bg-white/80" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="city" placeholder="New York" required className="bg-white/80" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" name="state" placeholder="NY" required className="bg-white/80" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">ZIP</Label>
                                        <Input id="zip" name="zip" placeholder="10001" required className="bg-white/80" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="glass-card rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <CreditCard className="h-5 w-5 text-violet-600" />
                                Payment Details
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardName">Name on Card</Label>
                                    <Input id="cardName" placeholder="John Doe" required className="bg-white/80" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input id="cardNumber" placeholder="4242 4242 4242 4242" required className="bg-white/80" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input id="expiry" placeholder="MM/YY" required className="bg-white/80" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input id="cvv" placeholder="123" required className="bg-white/80" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-24">
                            <h2 className="text-xl font-bold">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex gap-3">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <Package className="h-6 w-6 text-gray-300 absolute inset-0 m-auto" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            {/* Totals */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="gradient-text">${grandTotal.toFixed(2)}</span>
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg glow-hover disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : `Pay $${grandTotal.toFixed(2)}`}
                            </Button>

                            <p className="text-xs text-center text-gray-500">
                                Your payment information is secure
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
