"use client";

import { useState } from "react";
import {
    Store,
    MoreVertical,
    CheckCircle,
    XCircle,
    Mail,
    Package,
    ShoppingCart,
    DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateStoreStatus } from "../actions";

interface StoreData {
    _id: string;
    name: string;
    slug: string;
    status: "active" | "suspended";
    createdAt: string | Date;
    ownerId: {
        _id: string;
        name: string;
        email: string;
    } | null;
    orderCount: number;
    productCount: number;
    revenue: number;
}

export default function StoresClient({ initialStores }: { initialStores: StoreData[] }) {
    const [stores, setStores] = useState(initialStores);
    const [updating, setUpdating] = useState<string | null>(null);

    const handleStatusChange = async (storeId: string, newStatus: "active" | "suspended") => {
        setUpdating(storeId);
        const result = await updateStoreStatus(storeId, newStatus);

        if (result.success) {
            setStores(stores.map(store =>
                store._id === storeId ? { ...store, status: newStatus } : store
            ));
        }

        setUpdating(null);
    };

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                    <p className="text-2xl font-bold text-white">{stores.length}</p>
                    <p className="text-sm text-gray-400">Total Stores</p>
                </div>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                    <p className="text-2xl font-bold text-green-500">
                        {stores.filter(s => s.status === "active").length}
                    </p>
                    <p className="text-sm text-gray-400">Active Stores</p>
                </div>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                    <p className="text-2xl font-bold text-red-500">
                        {stores.filter(s => s.status === "suspended").length}
                    </p>
                    <p className="text-sm text-gray-400">Suspended Stores</p>
                </div>
            </div>

            {/* Stores Table */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-800">
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Store</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Owner</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Stats</th>
                            <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                            <th className="text-right text-sm font-medium text-gray-400 px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-500">
                                    <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No stores registered yet</p>
                                </td>
                            </tr>
                        ) : (
                            stores.map((store) => (
                                <tr key={store._id} className="border-b border-gray-800 last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                                                <Store className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{store.name}</p>
                                                <p className="text-sm text-gray-500">/{store.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {store.ownerId ? (
                                            <div>
                                                <p className="text-white">{store.ownerId.name}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {store.ownerId.email}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">No owner</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <Package className="h-4 w-4" />
                                                {store.productCount}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <ShoppingCart className="h-4 w-4" />
                                                {store.orderCount}
                                            </span>
                                            <span className="flex items-center gap-1 text-green-400">
                                                <DollarSign className="h-4 w-4" />
                                                {store.revenue.toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${store.status === "active"
                                                ? "bg-green-500/10 text-green-500"
                                                : "bg-red-500/10 text-red-500"
                                            }`}>
                                            {store.status === "active" ? (
                                                <CheckCircle className="h-3 w-3" />
                                            ) : (
                                                <XCircle className="h-3 w-3" />
                                            )}
                                            {store.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={updating === store._id}
                                                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                                                {store.status === "active" ? (
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(store._id, "suspended")}
                                                        className="text-red-500 hover:text-red-400 hover:bg-gray-800"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Suspend Store
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(store._id, "active")}
                                                        className="text-green-500 hover:text-green-400 hover:bg-gray-800"
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Activate Store
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
