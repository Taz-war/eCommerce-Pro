"use server";

import connectToDatabase from "@/lib/mongodb";
import { Store, User, Order, Product } from "@/models";

// Get platform statistics
export async function getPlatformStats() {
    try {
        await connectToDatabase();

        const [totalStores, activeStores, totalUsers, totalOrders, revenueResult] = await Promise.all([
            Store.countDocuments(),
            Store.countDocuments({ status: "active" }),
            User.countDocuments({ role: "merchant" }),
            Order.countDocuments(),
            Order.aggregate([
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        return {
            totalStores,
            activeStores,
            suspendedStores: totalStores - activeStores,
            totalUsers,
            totalOrders,
            totalRevenue,
        };
    } catch (error) {
        console.error("Error fetching platform stats:", error);
        return {
            totalStores: 0,
            activeStores: 0,
            suspendedStores: 0,
            totalUsers: 0,
            totalOrders: 0,
            totalRevenue: 0,
        };
    }
}

// Get all stores with owner info
export async function getAllStores() {
    try {
        await connectToDatabase();

        const stores = await Store.find()
            .populate("ownerId", "name email")
            .sort({ createdAt: -1 })
            .lean();

        // Get order and product counts for each store
        const storesWithStats = await Promise.all(
            stores.map(async (store) => {
                const [orderCount, productCount, revenue] = await Promise.all([
                    Order.countDocuments({ storeId: store._id }),
                    Product.countDocuments({ storeId: store._id }),
                    Order.aggregate([
                        { $match: { storeId: store._id } },
                        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
                    ]),
                ]);

                const owner = store.ownerId as unknown as { _id: { toString(): string }; name: string; email: string } | null;
                return {
                    ...store,
                    _id: store._id.toString(),
                    ownerId: owner ? {
                        _id: owner._id.toString(),
                        name: owner.name,
                        email: owner.email,
                    } : null,
                    orderCount,
                    productCount,
                    revenue: revenue[0]?.total || 0,
                    createdAt: store.createdAt instanceof Date ? store.createdAt.toISOString() : store.createdAt,
                };
            })
        );

        return storesWithStats;
    } catch (error) {
        console.error("Error fetching stores:", error);
        return [];
    }
}

// Update store status (suspend/activate)
export async function updateStoreStatus(storeId: string, status: "active" | "suspended") {
    try {
        await connectToDatabase();

        await Store.findByIdAndUpdate(storeId, { status });

        return { success: true };
    } catch (error) {
        console.error("Error updating store status:", error);
        return { success: false, error: "Failed to update store status" };
    }
}

// Get Stripe revenue (placeholder until API keys provided)
export async function getStripeRevenue() {
    // Placeholder - will be implemented when Stripe keys are provided
    return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        transactions: [],
        message: "Stripe integration pending - add API keys to enable",
    };
}
