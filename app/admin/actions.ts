"use server";

import dbConnect from "@/lib/mongodb";
import { Product, Category, Order } from "@/models";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

// ============== Product Actions ==============

export async function getProducts() {
    try {
        await dbConnect();
        const products = await Product.find().populate("category").sort({ createdAt: -1 }).lean();
        return { success: true, data: JSON.parse(JSON.stringify(products)) };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, error: "Failed to fetch products" };
    }
}

export async function getProduct(id: string) {
    try {
        await dbConnect();
        const product = await Product.findById(id).populate("category").lean();
        if (!product) {
            return { success: false, error: "Product not found" };
        }
        return { success: true, data: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error("Error fetching product:", error);
        return { success: false, error: "Failed to fetch product" };
    }
}

export async function createProduct(formData: FormData) {
    try {
        await dbConnect();

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const stock = parseInt(formData.get("stock") as string);
        const category = formData.get("category") as string;
        const imagesStr = formData.get("images") as string;
        const images = imagesStr ? imagesStr.split(",").map((url) => url.trim()).filter(Boolean) : [];

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category: new Types.ObjectId(category),
            images,
        });

        revalidatePath("/admin/products");
        return { success: true, data: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error("Error creating product:", error);
        return { success: false, error: "Failed to create product" };
    }
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        await dbConnect();

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const stock = parseInt(formData.get("stock") as string);
        const category = formData.get("category") as string;
        const imagesStr = formData.get("images") as string;
        const images = imagesStr ? imagesStr.split(",").map((url) => url.trim()).filter(Boolean) : [];

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                stock,
                category: new Types.ObjectId(category),
                images,
            },
            { new: true }
        );

        if (!product) {
            return { success: false, error: "Product not found" };
        }

        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/${id}/edit`);
        return { success: true, data: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, error: "Failed to update product" };
    }
}

export async function deleteProduct(id: string) {
    try {
        await dbConnect();
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return { success: false, error: "Product not found" };
        }
        revalidatePath("/admin/products");
        return { success: true };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, error: "Failed to delete product" };
    }
}

// ============== Category Actions ==============

export async function getCategories() {
    try {
        await dbConnect();
        const categories = await Category.find().sort({ name: 1 }).lean();
        return { success: true, data: JSON.parse(JSON.stringify(categories)) };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, error: "Failed to fetch categories" };
    }
}

export async function createCategory(formData: FormData) {
    try {
        await dbConnect();

        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string || name.toLowerCase().replace(/\s+/g, "-");

        const category = await Category.create({ name, slug });

        revalidatePath("/admin/categories");
        revalidatePath("/admin/products");
        return { success: true, data: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error("Error creating category:", error);
        return { success: false, error: "Failed to create category" };
    }
}

export async function deleteCategory(id: string) {
    try {
        await dbConnect();
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return { success: false, error: "Category not found" };
        }
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, error: "Failed to delete category" };
    }
}

// ============== Order Actions ==============

export async function getOrders() {
    try {
        await dbConnect();
        const orders = await Order.find().sort({ createdAt: -1 }).lean();
        return { success: true, data: JSON.parse(JSON.stringify(orders)) };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return { success: false, error: "Failed to fetch orders" };
    }
}

export async function updateOrderStatus(id: string, status: "pending" | "shipped") {
    try {
        await dbConnect();
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return { success: false, error: "Order not found" };
        }
        revalidatePath("/admin/orders");
        return { success: true, data: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: "Failed to update order status" };
    }
}

// ============== Dashboard Stats ==============

export async function getDashboardStats() {
    try {
        await dbConnect();
        const [productCount, categoryCount, orderCount, pendingOrders] = await Promise.all([
            Product.countDocuments(),
            Category.countDocuments(),
            Order.countDocuments(),
            Order.countDocuments({ status: "pending" }),
        ]);

        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

        return {
            success: true,
            data: {
                productCount,
                categoryCount,
                orderCount,
                pendingOrders,
                recentOrders: JSON.parse(JSON.stringify(recentOrders)),
            },
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { success: false, error: "Failed to fetch dashboard stats" };
    }
}
