"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
];

export function Navbar() {
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const cart = useCart();

    // Prevent hydration mismatch: cart is loaded from localStorage (client-only)
    // so we only show the cart count after the component has mounted on the client
    useEffect(() => {
        setMounted(true);
    }, []);

    const cartItemCount = mounted ? cart.totalItems() : 0;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="glass-light">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <Store className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text hidden sm:inline">
                                eCommerce
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === link.href
                                            ? "bg-violet-100 text-violet-700"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className="flex items-center gap-2">
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-40 sm:w-60 h-9 bg-white/80"
                                        autoFocus
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => setSearchOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </form>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-gray-100"
                                    onClick={() => setSearchOpen(true)}
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            )}

                            {/* Cart */}
                            <Link href="/cart">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 relative hover:bg-gray-100"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {cartItemCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-violet-600 hover:bg-violet-600">
                                            {cartItemCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>

                            {/* Mobile Menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 md:hidden hover:bg-gray-100"
                                    >
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-72">
                                    <nav className="flex flex-col gap-2 mt-8">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${pathname === link.href
                                                        ? "bg-violet-100 text-violet-700"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                        <Link
                                            href="/cart"
                                            className="px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-100 flex items-center justify-between"
                                        >
                                            Cart
                                            {cartItemCount > 0 && (
                                                <Badge className="bg-violet-600">
                                                    {cartItemCount}
                                                </Badge>
                                            )}
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
