"use server";

import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { User, Store } from "@/models";

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export async function registerMerchant(data: {
    email: string;
    password: string;
    name: string;
    storeName: string;
}) {
    try {
        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return { success: false, error: "Email already registered" };
        }

        // Generate store slug
        let slug = generateSlug(data.storeName);
        const existingStore = await Store.findOne({ slug });
        if (existingStore) {
            slug = `${slug}-${Date.now()}`;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 12);

        // Check if this is the super admin email
        const isSuperAdmin = data.email === process.env.SUPER_ADMIN_EMAIL;

        if (isSuperAdmin) {
            // Create super admin user without store
            await User.create({
                email: data.email,
                passwordHash,
                name: data.name,
                role: "superadmin",
            });
            return { success: true };
        }

        // Create user first
        const user = await User.create({
            email: data.email,
            passwordHash,
            name: data.name,
            role: "merchant",
        });

        // Create store with user as owner
        const store = await Store.create({
            name: data.storeName,
            slug,
            ownerId: user._id,
            status: "active",
        });

        // Update user with storeId
        await User.findByIdAndUpdate(user._id, { storeId: store._id });

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "Failed to create account" };
    }
}
