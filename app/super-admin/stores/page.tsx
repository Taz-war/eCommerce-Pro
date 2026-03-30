import { getAllStores } from "../actions";
import StoresClient from "./stores-client";

export default async function StoresPage() {
    const stores = await getAllStores();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Stores</h1>
                <p className="text-gray-400 mt-1">Manage all registered stores on the platform</p>
            </div>

            {/* Stores List */}
            <StoresClient initialStores={stores} />
        </div>
    );
}
