import React from 'react';

export default function InventoryStatus({ inventoryStatus }) {
    // Provide default values if inventoryStatus is not loaded
    const {
        lowStock = 0,
        outOfStock = 0,
        inStock = 0,
        lowStockPercent = 0,
        outOfStockPercent = 0,
        inStockPercent = 0,
    } = inventoryStatus || {};

    return (
        <div className="w-[280px] bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Inventory Status</h3>
                <button className="text-sm text-gray-500">View All</button>
            </div>

            {/* Donut Chart */}
            <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                        />
                        {/* Low Stock (Yellow) */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#EAB308"
                            strokeWidth="12"
                            strokeDasharray={`${lowStockPercent * 2.51} 251`}
                            strokeDashoffset="0"
                        />
                        {/* Out of Stock (Red) */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#DC2626"
                            strokeWidth="12"
                            strokeDasharray={`${outOfStockPercent * 2.51} 251`}
                            strokeDashoffset={`-${lowStockPercent * 2.51}`}
                        />
                        {/* In Stock (Green) */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#22C55E"
                            strokeWidth="12"
                            strokeDasharray={`${inStockPercent * 2.51} 251`}
                            strokeDashoffset={`-${(lowStockPercent + outOfStockPercent) * 2.51}`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{inStockPercent}%</span>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-sm">Low Stock</span>
                    </div>
                    <span className="text-sm font-semibold">{lowStock} Products</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-sm">Out of Stock</span>
                    </div>
                    <span className="text-sm font-semibold">{outOfStock} Products</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm">In Stock</span>
                    </div>
                    <span className="text-sm font-semibold">{inStock} Products</span>
                </div>
            </div>
        </div>
    );
}
