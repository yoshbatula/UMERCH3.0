import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import axios from "axios";

export default function InventoryReport() {
    const [filterType, setFilterType] = useState("day");
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState([]);
    const [totals, setTotals] = useState({ 
        sold_qty: 0, 
        purchased_qty: 0,
        sold_value: 0,
        purchased_value: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch report data
    const fetchReport = async () => {
        setLoading(true);
        setError("");
        try {
            console.log("Fetching report with params:", { filterType, filterDate });
            const response = await axios.get("/admin/inventory-report", {
                params: {
                    filterType: filterType,
                    filterDate: filterDate,
                },
            });
            console.log("Report response:", response.data);
            setReportData(response.data.data || []);
            setTotals({
                sold_qty: response.data.total_sold_qty || 0,
                purchased_qty: response.data.total_purchased_qty || 0,
                sold_value: response.data.total_sold_value || 0,
                purchased_value: response.data.total_purchased_value || 0,
            });
        } catch (err) {
            console.error("Report error details:", err);
            const errorMessage = err.response?.data?.error || "Failed to fetch report data. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Fetch report when filters change
    useEffect(() => {
        fetchReport();
    }, [filterType, filterDate]);

    // Export as CSV
    const handleExportCSV = async () => {
        try {
            const response = await axios.get("/admin/inventory-report/export-csv", {
                params: {
                    filterType: filterType,
                    filterDate: filterDate,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `inventory-report-${new Date().toISOString().split('T')[0]}.csv`
            );
            document.body.appendChild(link);
            link.click();
            link.parentElement.removeChild(link);
        } catch (err) {
            setError("Failed to export CSV. Please try again.");
            console.error("Error exporting CSV:", err);
        }
    };

    // Export as Excel
    const handleExportExcel = async () => {
        try {
            const response = await axios.get("/admin/inventory-report/export-excel", {
                params: {
                    filterType: filterType,
                    filterDate: filterDate,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `inventory-report-${new Date().toISOString().split('T')[0]}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            link.parentElement.removeChild(link);
        } catch (err) {
            setError("Failed to export Excel. Please try again.");
            console.error("Error exporting Excel:", err);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="h-screen sticky top-0">
                <Sidebar />
            </div>

            <div className="flex-1 px-10 py-10">
                <h1 className="text-4xl font-extrabold tracking-[0.25em] mb-1">
                    INVENTORY REPORT
                </h1>
                <p className="text-gray-500 mb-8">
                    View inventory movement and generate reports.
                </p>

                {/* Filter Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        {/* Filter Type */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Filter Type
                            </label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-red-600"
                            >
                                <option value="day">Daily</option>
                                <option value="week">Weekly</option>
                                <option value="month">Monthly</option>
                            </select>
                        </div>

                        {/* Date Picker */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                {filterType === "month" ? "Month" : "Date"}
                            </label>
                            <input
                                type={filterType === "month" ? "month" : "date"}
                                value={
                                    filterType === "month"
                                        ? filterDate.slice(0, 7)
                                        : filterDate
                                }
                                onChange={(e) => {
                                    if (filterType === "month") {
                                        // Convert month format (YYYY-MM) to date format (YYYY-MM-01)
                                        setFilterDate(e.target.value + "-01");
                                    } else {
                                        setFilterDate(e.target.value);
                                    }
                                }}
                                className="w-full border rounded-lg px-4 py-2 text-sm outline-red-600"
                            />
                        </div>

                        {/* Export Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleExportCSV}
                                disabled={loading}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Report Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading report data...
                        </div>
                    ) : reportData.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No data available for the selected period.
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-red-800 text-white">
                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                Date/Period
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                Product Name
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                Variant
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold">
                                                Unit Price
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold">
                                                Sold Qty
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold">
                                                Sold Value
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold">
                                                Stock Decrease
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold">
                                                Purchased Qty
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold">
                                                Purchased Value
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-bold">
                                                Current Stock
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-gray-200 hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {row.date_range.display}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                    {row.product_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {row.variant_type}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-gray-700">
                                                    ₱{row.unit_price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-semibold text-red-600">
                                                    {row.sold_qty}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-semibold text-red-600">
                                                    ₱{row.sold_value.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-semibold text-orange-600">
                                                    {row.stock_decrease}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">
                                                    {row.purchased_qty}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">
                                                    ₱{row.purchased_value.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-semibold text-blue-600">
                                                    {row.current_stock}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals Section */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Sold Qty</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {totals.sold_qty}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Sold Value</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            ₱{totals.sold_value.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Purchased Qty</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {totals.purchased_qty}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Purchased Value</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₱{totals.purchased_value.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <AdminFooter />
            </div>
        </div>
    );
}
