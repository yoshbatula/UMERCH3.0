import React from 'react';

export default function TopProducts({ topProducts, topProductsPeriod, setTopProductsPeriod }) {
    return (
        <div className="w-[320px] bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Top Products</h3>
                <button className="text-sm text-gray-500">View All</button>
            </div>

            {/* Period Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setTopProductsPeriod('weekly')}
                    className={`px-4 py-1.5 text-sm rounded-lg ${topProductsPeriod === 'weekly'
                        ? 'bg-red-700 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setTopProductsPeriod('monthly')}
                    className={`px-4 py-1.5 text-sm rounded-lg ${topProductsPeriod === 'monthly'
                        ? 'bg-red-700 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    Monthly
                </button>
            </div>

            {/* Products List */}
            <div className="space-y-4">
                {topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-400 w-6">{product.rank}</span>
                            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                            <div className="flex-1">
                                <div className="font-semibold text-sm">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-sm">{product.quantity} <span className="text-xs text-gray-500">Stocks</span></div>
                                <div className="text-xs text-gray-500">₱{product.sales?.toLocaleString()}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-400">
                        No top products data
                    </div>
                )}
            </div>
        </div>
    );
}
