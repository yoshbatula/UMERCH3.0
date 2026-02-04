import React from 'react';

export default function RecentTransaction({ recentTransactions }) {
    return (
        <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Transaction</h3>
                <button className="text-sm text-gray-500">View all &gt;</button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-4 text-sm text-gray-500 pb-3 border-b border-gray-200">
                <div>Customer</div>
                <div>Status</div>
                <div>Order ID</div>
                <div className="text-right">Amount</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
                {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                        <div key={index} className="grid grid-cols-4 py-3 items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                <span>{transaction.customer}</span>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.status === 'Completed'
                                    ? 'bg-green-100 text-green-700'
                                    : transaction.status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {transaction.status}
                                </span>
                            </div>
                            <div>{transaction.orderId}</div>
                            <div className="text-right font-semibold text-red-700">
                                ₱{transaction.amount?.toLocaleString() || 0}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-400">
                        No recent transactions
                    </div>
                )}
            </div>
        </div>
    );
}
