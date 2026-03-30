"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCategory, deleteCategory } from "../actions";
import { FolderTree, Plus, Trash2, Loader2 } from "lucide-react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface CategoriesClientProps {
    categories: Category[];
}

export function CategoriesClient({ categories: initialCategories }: CategoriesClientProps) {
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleNameChange = (value: string) => {
        setName(value);
        if (!slug || slug === name.toLowerCase().replace(/\s+/g, "-")) {
            setSlug(value.toLowerCase().replace(/\s+/g, "-"));
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsCreating(true);
        setError(null);

        const formData = new FormData();
        formData.set("name", name);
        formData.set("slug", slug);

        try {
            const result = await createCategory(formData);
            if (result.success) {
                setCategories([...categories, result.data]);
                setName("");
                setSlug("");
                router.refresh();
            } else {
                setError(result.error || "Failed to create category");
            }
        } catch (err) {
            setError("Failed to create category");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? Products in this category may be affected.")) return;

        setDeletingId(id);
        try {
            const result = await deleteCategory(id);
            if (result.success) {
                setCategories(categories.filter((c) => c._id !== id));
                router.refresh();
            } else {
                alert(result.error || "Failed to delete category");
            }
        } catch (err) {
            alert("Failed to delete category");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Create Form */}
            <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>New Category</CardTitle>
                    <CardDescription>Add a new product category</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                placeholder="Category name"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="slug-name"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL-friendly version of the name
                            </p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isCreating}>
                            {isCreating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4 mr-2" />
                            )}
                            Create Category
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Categories List */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        {categories.length} categories available
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {categories.length > 0 ? (
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <FolderTree className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{category.name}</p>
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                /{category.slug}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(category._id)}
                                        disabled={deletingId === category._id}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        {deletingId === category._id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FolderTree className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No categories yet</p>
                            <p className="text-sm text-muted-foreground/70">
                                Create your first category to organize products
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
