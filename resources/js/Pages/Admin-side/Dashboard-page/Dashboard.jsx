import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/layouts/Sidebar';
import AdminFooter from '../../../components/layouts/AdminFooter';
import axios from 'axios';

// Import SVG icons
import TodayEarningsIcon from '@images/TodayEarnings.svg';
import TodayProductsIcon from '@images/TodayProducts.svg';
import TodaySalesIcon from '@images/TodaySales.svg';
import TotalLoginUserIcon from '@images/TotalLoginUser.svg';

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, bgColor }) => (
    <div className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${bgColor}`}>
        <div>
            <div className="text-lg opacity-90">{title}</div>
            <div className="text-4xl font-bold mt-1">{value}</div>
            {subtitle && <div className="text-xs opacity-75 mt-1">{subtitle}</div>}
        </div>
        <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
            <img src={icon} alt={title} className="w-12 h-12" />
        </div>
    </div>
);

// Mini Stat Card for Weekly Stats
const MiniStatCard = ({ icon, label, value, change, iconBgColor }) => (
    <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}>
            {icon}
        </div>
        <div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-lg font-bold text-gray-800">₱ {value?.toLocaleString() || 0}</div>
            {change !== undefined && (
                <div className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change >= 0 ? '+' : ''}{change}% This Week
                </div>
            )}
        </div>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState({
        todayEarnings: 0,
        todayProducts: 0,
        todaySales: 0,
        todaySalesAmount: 0,
        totalUsers: 0,
    });
    const [salesOverview, setSalesOverview] = useState([]);
    const [inventoryStatus, setInventoryStatus] = useState({
        lowStock: 0,
        outOfStock: 0,
        inStock: 0,
        lowStockPercent: 0,
        outOfStockPercent: 0,
        inStockPercent: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState({
        revenue: 0,
        revenueChange: 0,
        orders: 0,
        ordersChange: 0,
        sales: 0,
        salesChange: 0,
    });
    const [salesPeriod, setSalesPeriod] = useState('daily');
    const [topProductsPeriod, setTopProductsPeriod] = useState('weekly');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        fetchSalesOverview();
    }, [salesPeriod]);

    useEffect(() => {
        fetchTopProducts();
    }, [topProductsPeriod]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, inventoryRes, transactionsRes, weeklyRes] = await Promise.all([
                axios.get('/admin/dashboard/stats'),
                axios.get('/admin/dashboard/inventory-status'),
                axios.get('/admin/dashboard/recent-transactions'),
                axios.get('/admin/dashboard/weekly-stats'),
            ]);
            setStats(statsRes.data);
            setInventoryStatus(inventoryRes.data);
            setRecentTransactions(transactionsRes.data);
            setWeeklyStats(weeklyRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const fetchSalesOverview = async () => {
        try {
            const res = await axios.get(`/admin/dashboard/sales-overview?period=${salesPeriod}`);
            setSalesOverview(res.data);
        } catch (error) {
            console.error('Error fetching sales overview:', error);
        }
    };

    const fetchTopProducts = async () => {
        try {
            const res = await axios.get(`/admin/dashboard/top-products?period=${topProductsPeriod}`);
            setTopProducts(res.data);
        } catch (error) {
            console.error('Error fetching top products:', error);
        }
    };

    // Calculate max value for chart scaling
    const maxSalesValue = Math.max(...salesOverview.map(s => s.value), 1);

    return (
        <div className="flex min-h-screen bg-[#f5f5f5]">
            <div className="h-screen sticky top-0">
                <Sidebar />
            </div>

            <main className="flex-1 px-10 py-10">
                {/* Header */}
                <h1 className="text-4xl font-extrabold tracking-[0.25em]">DASHBOARD</h1>
                <p className="text-gray-500 mt-2">Welcome back Admin, everything looks great.</p>

                {/* Stat Cards */}
                <div className="flex flex-wrap gap-5 mt-8">
                    <StatCard
                        title="Today Earnings"
                        value={`₱${stats.todayEarnings?.toLocaleString() || 0}`}
                        subtitle="+0% vs yesterday"
                        icon={TodayEarningsIcon}
                        bgColor="bg-[#5C975A]"
                    />
                    <StatCard
                        title="Today Products"
                        value={stats.todayProducts || 0}
                        subtitle="Active Inventory Items"
                        icon={TodayProductsIcon}
                        bgColor="bg-[#F7962A]"
                    />
                    <StatCard
                        title="Today Sales"
                        value={`₱${stats.todaySalesAmount?.toLocaleString() || 0}`}
                        icon={TodaySalesIcon}
                        bgColor="bg-[#EF2F2A]"
                    />
                    <StatCard
                        title="Total Login User"
                        value={stats.totalUsers || 0}
                        icon={TotalLoginUserIcon}
                        bgColor="bg-[#9C0306]"
                    />
                </div>

                {/* Charts & Metrics Section */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Charts & Metrics</h2>
                        <div className="flex gap-2">
                            {['daily', 'weekly', 'monthly'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSalesPeriod(period)}
                                    className={`px-4 py-2 text-sm rounded-lg border ${salesPeriod === period
                                        ? 'bg-white border-gray-300 font-semibold'
                                        : 'bg-transparent border-gray-200 text-gray-500'
                                        }`}
                                >
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {/* Sales Overview Chart */}
                        <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg">Sales Overview</h3>
                                {salesOverview.length > 0 && (
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">● Today</div>
                                        <div className="text-xl font-bold text-[#8B6914]">
                                            ₱{salesOverview[salesOverview.length - 1]?.value?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Y-axis labels and Chart */}
                            <div className="flex">
                                <div className="flex flex-col justify-between text-xs text-gray-400 pr-2 h-[200px]">
                                    <span>₱{Math.round(maxSalesValue * 1).toLocaleString()}</span>
                                    <span>₱{Math.round(maxSalesValue * 0.75).toLocaleString()}</span>
                                    <span>₱{Math.round(maxSalesValue * 0.5).toLocaleString()}</span>
                                    <span>₱{Math.round(maxSalesValue * 0.25).toLocaleString()}</span>
                                    <span>₱0</span>
                                </div>

                                {/* Chart Area */}
                                <div className="flex-1 h-[200px] flex items-end justify-between gap-2 border-l border-b border-gray-200 pl-4 pb-2">
                                    {salesOverview.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                            <div
                                                className="w-full max-w-[40px] bg-gradient-to-t from-[#FFD700] to-[#FFA500] rounded-t-lg transition-all duration-300"
                                                style={{
                                                    height: `${(item.value / maxSalesValue) * 180}px`,
                                                    minHeight: item.value > 0 ? '10px' : '2px',
                                                }}
                                            />
                                            <span className="text-xs text-gray-500 mt-2">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Stats */}
                            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                                <MiniStatCard
                                    icon={<div className="w-3 h-3 bg-red-500 rounded-full" />}
                                    label="Revenue"
                                    value={weeklyStats.revenue}
                                    change={weeklyStats.revenueChange}
                                    iconBgColor="bg-red-100"
                                />
                                <MiniStatCard
                                    icon={<div className="w-3 h-3 bg-yellow-500 rounded-full" />}
                                    label="Orders"
                                    value={weeklyStats.orders}
                                    change={weeklyStats.ordersChange}
                                    iconBgColor="bg-yellow-100"
                                />
                                <MiniStatCard
                                    icon={<div className="w-3 h-3 bg-blue-500 rounded-full" />}
                                    label="Sales"
                                    value={weeklyStats.sales}
                                    change={weeklyStats.salesChange}
                                    iconBgColor="bg-blue-100"
                                />
                                <MiniStatCard
                                    icon={<div className="w-3 h-3 bg-green-500 rounded-full" />}
                                    label="Revenue"
                                    value={weeklyStats.revenue}
                                    iconBgColor="bg-green-100"
                                />
                            </div>
                        </div>

                        {/* Inventory Status */}
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
                                            strokeDasharray={`${inventoryStatus.lowStockPercent * 2.51} 251`}
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
                                            strokeDasharray={`${inventoryStatus.outOfStockPercent * 2.51} 251`}
                                            strokeDashoffset={`-${inventoryStatus.lowStockPercent * 2.51}`}
                                        />
                                        {/* In Stock (Green) */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="#22C55E"
                                            strokeWidth="12"
                                            strokeDasharray={`${inventoryStatus.inStockPercent * 2.51} 251`}
                                            strokeDashoffset={`-${(inventoryStatus.lowStockPercent + inventoryStatus.outOfStockPercent) * 2.51}`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold">{inventoryStatus.inStockPercent}%</span>
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
                                    <span className="text-sm font-semibold">{inventoryStatus.lowStock} Products</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                                        <span className="text-sm">Out of Stock</span>
                                    </div>
                                    <span className="text-sm font-semibold">{inventoryStatus.outOfStock} Products</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                        <span className="text-sm">In Stock</span>
                                    </div>
                                    <span className="text-sm font-semibold">{inventoryStatus.inStock} Products</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions & Top Products */}
                <div className="flex gap-6 mt-8">
                    {/* Recent Transactions */}
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

                    {/* Top Products */}
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
                </div>

                <AdminFooter />
            </main>
        </div>
    );
}
