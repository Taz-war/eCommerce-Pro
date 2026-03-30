import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type StoreStatus = "active" | "suspended";

export interface IStore extends Document {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    ownerId: Types.ObjectId;
    status: StoreStatus;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
    {
        name: {
            type: String,
            required: [true, "Store name is required"],
            trim: true,
            maxlength: [100, "Store name cannot exceed 100 characters"],
        },
        slug: {
            type: String,
            required: [true, "Store slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Store must have an owner"],
        },
        status: {
            type: String,
            enum: {
                values: ["active", "suspended"],
                message: "Status must be either active or suspended",
            },
            default: "active",
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
StoreSchema.index({ slug: 1 });
StoreSchema.index({ ownerId: 1 });
StoreSchema.index({ status: 1 });

const Store: Model<IStore> =
    mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

export default Store;
