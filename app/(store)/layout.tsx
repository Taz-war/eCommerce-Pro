import { Navbar } from "@/components/store/navbar";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
            {/* Animated background blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
            </div>

            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/20 mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="glass-light rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-600">
                                © 2026 eCommerce Pro. All rights reserved.
                            </p>
                            <div className="flex gap-6">
                                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                                    Terms of Service
                                </a>
                                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
