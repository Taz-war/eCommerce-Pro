import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type UserRole = "merchant" | "superadmin";

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    storeId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"],
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        role: {
            type: String,
            enum: {
                values: ["merchant", "superadmin"],
                message: "Role must be either merchant or superadmin",
            },
            default: "merchant",
        },
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
        },
    },
    {
        timestamps: true,
    }
);

// Index for quick lookups
UserSchema.index({ email: 1 });
UserSchema.index({ storeId: 1 });

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
