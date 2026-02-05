import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import axios from "axios";

const StatCard = ({ title, value, className = "bg-green-700", icon }) => (
    <div
        className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${className}`}
    >
        <div>
            <div className="text-lg opacity-90">{title}</div>
            <div className="text-4xl font-bold mt-1">{value}</div>
        </div>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            {icon}
        </div>
    </div>
);

function InventoryLogs() {
    const [logs, setLogs] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(10);

    // Fetch logs from API
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/admin/inventory-logs", {
                params: {
                    search: query,
                    type: typeFilter,
                    page: currentPage,
                    per_page: perPage,
                },
            });
            setLogs(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Error fetching inventory logs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all logs for stats (without pagination)
    const fetchAllLogs = async () => {
        try {
            const response = await axios.get("/api/admin/inventory-logs", {
                params: {
                    per_page: 10000, // Get all logs
                },
            });
            setAllLogs(response.data.data);
        } catch (error) {
            console.error("Error fetching all logs:", error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [currentPage, typeFilter, query]);

    useEffect(() => {
        fetchAllLogs();
    }, []);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Get badge color based on type
    const getTypeBadgeColor = (type) => {
        const colors = {
            "Stock In": "bg-green-100 text-green-800",
            "Stock Out": "bg-red-100 text-red-800",
            "Add Product": "bg-blue-100 text-blue-800",
            "Edit Product": "bg-yellow-100 text-yellow-800",
            "Delete Product": "bg-gray-100 text-gray-800",
            "Archived": "bg-orange-100 text-orange-800",
            "Restored": "bg-purple-100 text-purple-800",
        };
        return colors[type] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="flex min-h-screen bg-[#f5f5f5]">
            <div className="h-screen sticky top-0">
                <Sidebar />
            </div>
            <main className="flex-1 px-10 py-10">
                {/* Header */}
                <h1 className="text-4xl font-extrabold tracking-[0.25em]">
                    INVENTORY LOGS
                </h1>
                <p className="text-gray-500 mt-2">
                    Track all inventory movements and changes
                </p>

                {/* Filters and Search */}
                <div className="mt-7 flex items-center justify-between gap-6">
                    {/* Search */}
                    <div className="flex items-center gap-3 flex-1 max-w-130 bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M21 21l-4.35-4.35"
                                stroke="#9CA3AF"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M11 19a8 8 0 100-16 8 8 0 000 16z"
                                stroke="#9CA3AF"
                                strokeWidth="2"
                            />
                        </svg>
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search by Item Name"
                            className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="Stock In">Stock In</option>
                        <option value="Stock Out">Stock Out</option>
                        <option value="Add Product">Add Product</option>
                        <option value="Edit Product">Edit Product</option>
                        <option value="Delete Product">Delete Product</option>
                        <option value="Archived">Archived</option>
                        <option value="Restored">Restored</option>
                    </select>
                </div>

                {/* Table */}
                <div className="mt-6 bg-white rounded-xl shadow-sm overflow-visible">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200">
                                <tr className="text-left text-gray-600 text-sm font-semibold">
                                    <th className="px-6 py-4">Date/Time</th>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Item Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Qty</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Action By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-500">
                                            No inventory logs found
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {formatDate(log.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                #{log.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {log.item_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(
                                                        log.type
                                                    )}`}
                                                >
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {log.total}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {log.admin_action}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && logs.length > 0 && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <AdminFooter />
            </main>
        </div>
    );
}

export default InventoryLogs;
