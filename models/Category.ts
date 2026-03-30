import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    storeId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            maxlength: [100, "Category name cannot exceed 100 characters"],
        },
        slug: {
            type: String,
            required: [true, "Category slug is required"],
            lowercase: true,
            trim: true,
        },
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: [true, "Store ID is required"],
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for better query performance
CategorySchema.index({ slug: 1 });

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
