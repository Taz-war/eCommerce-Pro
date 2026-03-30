import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type OrderStatus = "pending" | "shipped";

export interface IOrderItem {
    product: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface IUserDetails {
    name: string;
    email: string;
    phone?: string;
    address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

export interface IOrder extends Document {
    user: IUserDetails;
    items: IOrderItem[];
    storeId: Types.ObjectId;
    totalPrice: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

const AddressSchema = new Schema(
    {
        street: {
            type: String,
            required: [true, "Street address is required"],
        },
        city: {
            type: String,
            required: [true, "City is required"],
        },
        state: {
            type: String,
            required: [true, "State is required"],
        },
        postalCode: {
            type: String,
            required: [true, "Postal code is required"],
        },
        country: {
            type: String,
            required: [true, "Country is required"],
        },
    },
    { _id: false }
);

const UserDetailsSchema = new Schema<IUserDetails>(
    {
        name: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Customer email is required"],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: AddressSchema,
            required: [true, "Shipping address is required"],
        },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: UserDetailsSchema,
            required: [true, "User details are required"],
        },
        items: {
            type: [OrderItemSchema],
            required: [true, "Order must contain at least one item"],
            validate: {
                validator: function (v: IOrderItem[]) {
                    return v.length > 0;
                },
                message: "Order must contain at least one item",
            },
        },
        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            min: [0, "Total price cannot be negative"],
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "shipped"],
                message: "Status must be either pending or shipped",
            },
            default: "pending",
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

// Create indexes for common queries
OrderSchema.index({ "user.email": 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
