import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Use NextAuth with config only (Edge-compatible)
export default NextAuth(authConfig).auth;

export const config = {
    matcher: [
        "/admin/:path*",
        "/super-admin/:path*",
        "/login",
        "/register",
    ],
};
