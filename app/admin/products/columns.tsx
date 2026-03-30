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
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { deleteProduct } from "../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type ProductColumn = {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: {
        _id: string;
        name: string;
        slug: string;
    } | null;
    images: string[];
    createdAt: string;
};

function ActionsCell({ product }: { product: ProductColumn }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setIsDeleting(true);
        try {
            const result = await deleteProduct(product._id);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || "Failed to delete product");
            }
        } catch (error) {
            alert("Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product._id}/edit`} className="flex items-center">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "images",
        header: "Image",
        cell: ({ row }) => {
            const images = row.getValue("images") as string[];
            return (
                <div className="h-12 w-12 overflow-hidden rounded-lg border bg-muted">
                    {images && images.length > 0 ? (
                        <img
                            src={images[0]}
                            alt={row.getValue("name")}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            No img
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("category") as ProductColumn["category"];
            return category ? (
                <Badge variant="secondary" className="font-normal">
                    {category.name}
                </Badge>
            ) : (
                <span className="text-muted-foreground">—</span>
            );
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number;
            return (
                <Badge
                    variant={stock > 10 ? "default" : stock > 0 ? "secondary" : "destructive"}
                    className={
                        stock > 10
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            : stock > 0
                                ? "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                                : ""
                    }
                >
                    {stock} in stock
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell product={row.original} />,
    },
];
