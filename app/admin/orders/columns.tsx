"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Truck, Clock, ArrowUpDown } from "lucide-react";
import { updateOrderStatus } from "../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type OrderColumn = {
    _id: string;
    user: {
        name: string;
        email: string;
        address: {
            city: string;
            country: string;
        };
    };
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    totalPrice: number;
    status: "pending" | "shipped";
    createdAt: string;
};

function StatusCell({ order }: { order: OrderColumn }) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus: "pending" | "shipped") => {
        if (newStatus === order.status) return;

        setIsUpdating(true);
        try {
            const result = await updateOrderStatus(order._id, newStatus);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || "Failed to update status");
            }
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isUpdating}>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Badge
                        variant={order.status === "shipped" ? "default" : "secondary"}
                        className={
                            order.status === "shipped"
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 cursor-pointer"
                                : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 cursor-pointer"
                        }
                    >
                        {order.status === "shipped" ? (
                            <Truck className="h-3 w-3 mr-1" />
                        ) : (
                            <Clock className="h-3 w-3 mr-1" />
                        )}
                        {isUpdating ? "Updating..." : order.status}
                    </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleStatusChange("pending")}
                    className={order.status === "pending" ? "bg-accent" : ""}
                >
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleStatusChange("shipped")}
                    className={order.status === "shipped" ? "bg-accent" : ""}
                >
                    <Truck className="h-4 w-4 mr-2 text-green-500" />
                    Shipped
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "_id",
        header: "Order ID",
        cell: ({ row }) => {
            const id = row.getValue("_id") as string;
            return (
                <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                    {id.slice(-8).toUpperCase()}
                </code>
            );
        },
    },
    {
        accessorKey: "user",
        header: "Customer",
        cell: ({ row }) => {
            const user = row.getValue("user") as OrderColumn["user"];
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => {
            const items = row.getValue("items") as OrderColumn["items"];
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            return (
                <div className="flex flex-col">
                    <span>{totalItems} items</span>
                    <span className="text-xs text-muted-foreground">
                        {items.slice(0, 2).map(item => item.name).join(", ")}
                        {items.length > 2 && ` +${items.length - 2} more`}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "totalPrice",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const total = parseFloat(row.getValue("totalPrice"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(total);
            return <div className="font-semibold">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusCell order={row.original} />,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return (
                <div className="flex flex-col">
                    <span>{date.toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">
                        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                </div>
            );
        },
    },
];
