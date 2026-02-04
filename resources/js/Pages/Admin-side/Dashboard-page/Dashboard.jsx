import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/layouts/Sidebar';
import AdminFooter from '../../../components/layouts/AdminFooter';
import axios from 'axios';

// Import SVG icons
import TodayEarningsIcon from '@images/TodayEarnings.svg';
import TodayProductsIcon from '@images/TodayProducts.svg';
import TodaySalesIcon from '@images/TodaySales.svg';
import TotalLoginUserIcon from '@images/TotalLoginUser.svg';

// Import dashboard components
import SalesOverview from '../../../components/dashboard-tables/SalesOverview';
import InventoryStatus from '../../../components/dashboard-tables/InventoryStatus';
import RecentTransaction from '../../../components/dashboard-tables/RecentTransaction';
import TopProducts from '../../../components/dashboard-tables/TopProducts';
import ExportFile from '../../../components/dashboard-tables/ExportFile';

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

    // Auto-refresh dashboard data every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
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
                        title="Total Sales"
                        value={`₱${stats.totalSalesAmount?.toLocaleString() || 0}`}
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
                            {/* Export File Button with Dropdown */}
                            <ExportFile
                                stats={stats}
                                weeklyStats={weeklyStats}
                                salesOverview={salesOverview}
                                recentTransactions={recentTransactions}
                                inventoryStatus={inventoryStatus}
                                topProducts={topProducts}
                            />

                            {/* Period Toggle */}
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
                        <SalesOverview salesOverview={salesOverview} weeklyStats={weeklyStats} />

                        {/* Inventory Status */}
                        <InventoryStatus inventoryStatus={inventoryStatus} />
                    </div>
                </div>

                {/* Recent Transactions & Top Products */}
                <div className="flex gap-6 mt-8">
                    {/* Recent Transactions */}
                    <RecentTransaction recentTransactions={recentTransactions} />

                    {/* Top Products */}
                    <TopProducts topProducts={topProducts} topProductsPeriod={topProductsPeriod} setTopProductsPeriod={setTopProductsPeriod} />
                </div>

                <AdminFooter />
            </main>
        </div>
    );
}
