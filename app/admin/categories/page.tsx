import { getCategories } from "../actions";
import { CategoriesClient } from "./categories-client";

export default async function CategoriesPage() {
    const result = await getCategories();
    const categories = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <p className="text-muted-foreground">
                    Organize your products into categories
                </p>
            </div>

            <CategoriesClient categories={categories} />
        </div>
    );
}
