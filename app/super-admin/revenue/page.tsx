import { DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react";
import { getStripeRevenue } from "../actions";

export default async function RevenuePage() {
    const stripeData = await getStripeRevenue();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Revenue</h1>
                <p className="text-gray-400 mt-1">Platform revenue and Stripe integration</p>
            </div>

            {/* Stripe Integration Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="flex gap-4">
                    <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-500">Stripe Integration Pending</h3>
                        <p className="text-yellow-500/80 mt-1">
                            {stripeData.message}
                        </p>
                        <p className="text-sm text-gray-400 mt-3">
                            To enable Stripe integration, add the following to your <code className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">.env.local</code> file:
                        </p>
                        <pre className="mt-2 p-4 rounded-xl bg-gray-800 text-gray-300 text-sm overflow-x-auto">
                            {`STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Revenue Cards (Placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                            <DollarSign className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold text-white">$0.00</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                            <TrendingUp className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">This Month</p>
                            <p className="text-2xl font-bold text-white">$0.00</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                            <CreditCard className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Transactions</p>
                            <p className="text-2xl font-bold text-white">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table (Empty State) */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
                <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-700" />
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Transactions will appear here once Stripe is connected
                    </p>
                </div>
            </div>
        </div>
    );
}
