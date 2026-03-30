"use server";

import connectToDatabase from "@/lib/mongodb";
import { Product, Category, Order } from "@/models";

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CheckoutData {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

// Create a new order
export async function createOrder(data: CheckoutData) {
    try {
        await connectToDatabase();

        // Create order document
        const order = await Order.create({
            user: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                phone: data.phone,
                address: {
                    street: data.address,
                    city: data.city,
                    state: data.state,
                    postalCode: data.zip,
                    country: "USA",
                },
            },
            items: data.items.map((item) => ({
                product: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            totalPrice: data.total,
            status: "pending",
        });

        // Update product stock
        for (const item of data.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            });
        }

        return { success: true, orderId: order._id.toString() };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to create order" };
    }
}

// Get featured products for home page
export async function getFeaturedProducts(limit: number = 8) {
    try {
        await connectToDatabase();
        const products = await Product.find({ stock: { $gt: 0 } })
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return [];
    }
}

// Get all products with optional filters
export async function getStoreProducts(options?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}) {
    try {
        await connectToDatabase();

        const { category, search, page = 1, limit = 12 } = options || {};
        const query: Record<string, unknown> = {};

        // Filter by category slug
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            }
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product.find(query)
                .populate("category", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query),
        ]);

        return {
            products: JSON.parse(JSON.stringify(products)),
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], total: 0, pages: 0, currentPage: 1 };
    }
}

// Get single product by ID
export async function getStoreProduct(id: string) {
    try {
        await connectToDatabase();
        const product = await Product.findById(id)
            .populate("category", "name slug")
            .lean();

        if (!product) return null;
        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

// Get all categories for filtering
export async function getStoreCategories() {
    try {
        await connectToDatabase();
        const categories = await Category.find().sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

// Get related products (same category, excluding current)
export async function getRelatedProducts(productId: string, categoryId: string, limit: number = 4) {
    try {
        await connectToDatabase();
        const products = await Product.find({
            _id: { $ne: productId },
            category: categoryId,
            stock: { $gt: 0 },
        })
            .populate("category", "name slug")
            .limit(limit)
            .lean();
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}
