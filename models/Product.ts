import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: Types.ObjectId;
    storeId: Types.ObjectId;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [200, "Product name cannot exceed 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Product category is required"],
        },
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: [true, "Store ID is required"],
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (v: string[]) {
                    return v.every((url) => {
                        try {
                            new URL(url);
                            return true;
                        } catch {
                            return false;
                        }
                    });
                },
                message: "All image URLs must be valid URLs",
            },
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for common queries
ProductSchema.index({ storeId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ price: 1 });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
