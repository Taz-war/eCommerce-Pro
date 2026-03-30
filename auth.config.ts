import type { NextAuthConfig } from "next-auth";

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "fahimtazwer@gmail.com";

// Edge-compatible auth config (no database imports)
export const authConfig = {
    pages: {
        signIn: "/login",
    },
    providers: [], // Providers will be added in lib/auth.ts
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const pathname = nextUrl.pathname;

            // Super Admin routes
            if (pathname.startsWith("/super-admin")) {
                if (!isLoggedIn) return false;
                if (auth?.user?.email !== SUPER_ADMIN_EMAIL) {
                    return Response.redirect(new URL("/admin", nextUrl));
                }
                return true;
            }

            // Admin routes
            if (pathname.startsWith("/admin")) {
                return isLoggedIn;
            }

            // Auth routes - redirect if already logged in
            if (pathname === "/login" || pathname === "/register") {
                if (isLoggedIn) {
                    if (auth?.user?.email === SUPER_ADMIN_EMAIL) {
                        return Response.redirect(new URL("/super-admin", nextUrl));
                    }
                    return Response.redirect(new URL("/admin", nextUrl));
                }
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.storeId = user.storeId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.storeId = token.storeId as string | undefined;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
