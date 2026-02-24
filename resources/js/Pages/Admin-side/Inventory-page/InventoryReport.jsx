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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        setCurrentPage(1); // Reset to page 1 when filters change
    }, [filterType, filterDate]);

    // ✅ PAGINATION LOGIC
    const totalPages = Math.ceil(reportData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = reportData.slice(startIndex, endIndex);

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

    // Export as Excel (professional, client-side via ExcelJS)
    const handleExportExcel = async () => {
        try {
            const ExcelJS = (await import("exceljs")).default;
            const workbook = new ExcelJS.Workbook();
            workbook.creator = "UMERCH Admin";
            workbook.created = new Date();

            const sheet = workbook.addWorksheet("Inventory Report", {
                pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
            });

            // ── Column definitions ──────────────────────────────────────
            sheet.columns = [
                { key: "date", width: 20 },
                { key: "name", width: 30 },
                { key: "status", width: 12 },
                { key: "variant", width: 14 },
                { key: "price", width: 14 },
                { key: "sold_qty", width: 12 },
                { key: "sold_val", width: 16 },
                { key: "decrease", width: 14 },
                { key: "purch_qty", width: 14 },
                { key: "purch_val", width: 16 },
                { key: "stock", width: 14 },
            ];

            const totalCols = sheet.columns.length;                 // 11
            const DARK_RED = "FF9C0306";
            const MID_RED = "FFB71C1C";
            const LIGHT_RED = "FFFCE4EC";
            const ALT_ROW = "FFFFF8F8";
            const WHITE = "FFFFFFFF";
            const GOLD = "FFFFD700";
            const DARK_TEXT = "FF1A1A1A";
            const WHITE_TEXT = "FFFFFFFF";
            const GRAY_FILL = "FFF5F5F5";

            // ── Helper: merge & style a banner row ──────────────────────
            const addBanner = (text, rowNum, bgColor, fontColor, fontSize, bold = true) => {
                sheet.mergeCells(rowNum, 1, rowNum, totalCols);
                const row = sheet.getRow(rowNum);
                const cell = row.getCell(1);
                cell.value = text;
                cell.font = { name: "Calibri", bold, size: fontSize, color: { argb: fontColor } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                row.height = fontSize * 2.4;
            };

            // ── Row 1: Company / Report title ───────────────────────────
            addBanner("UMERCH — INVENTORY REPORT", 1, DARK_RED, WHITE_TEXT, 18);

            // ── Row 2: Period subtitle ───────────────────────────────────
            const periodLabel = reportData.length > 0
                ? `Period: ${reportData[0].date_range.display}  |  Generated: ${new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}`
                : `Generated: ${new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}`;
            addBanner(periodLabel, 2, MID_RED, WHITE_TEXT, 11, false);

            // ── Row 3: Empty spacer ──────────────────────────────────────
            sheet.getRow(3).height = 6;

            // ── Row 4: Column headers ────────────────────────────────────
            const headers = [
                "Date / Period", "Product Name", "Status", "Variant",
                "Unit Price", "Sold Qty", "Sold Value",
                "Stock Decrease", "Purchased Qty", "Purchased Value", "Current Stock",
            ];
            const headerRow = sheet.getRow(4);
            headers.forEach((h, i) => {
                const cell = headerRow.getCell(i + 1);
                cell.value = h;
                cell.font = { name: "Calibri", bold: true, size: 11, color: { argb: WHITE_TEXT } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: DARK_RED } };
                cell.alignment = { horizontal: i >= 4 ? "right" : "left", vertical: "middle", wrapText: true };
                cell.border = {
                    top: { style: "thin", color: { argb: "FFEEEEEE" } },
                    bottom: { style: "thin", color: { argb: "FFEEEEEE" } },
                    left: { style: "thin", color: { argb: "FFEEEEEE" } },
                    right: { style: "thin", color: { argb: "FFEEEEEE" } },
                };
            });
            headerRow.height = 28;

            // ── Rows 5+: Data ────────────────────────────────────────────
            reportData.forEach((row, idx) => {
                const isAlt = idx % 2 === 1;
                const fill = { type: "pattern", pattern: "solid", fgColor: { argb: isAlt ? ALT_ROW : WHITE } };
                const border = {
                    top: { style: "hair", color: { argb: "FFDDDDDD" } },
                    bottom: { style: "hair", color: { argb: "FFDDDDDD" } },
                    left: { style: "hair", color: { argb: "FFDDDDDD" } },
                    right: { style: "hair", color: { argb: "FFDDDDDD" } },
                };

                const r = sheet.addRow({
                    date: row.date_range.display,
                    name: row.product_name,
                    status: row.status === "active" ? "Active" : "Archived",
                    variant: row.variant_type || "-",
                    price: row.unit_price,
                    sold_qty: row.sold_qty,
                    sold_val: row.sold_value,
                    decrease: row.stock_decrease,
                    purch_qty: row.purchased_qty,
                    purch_val: row.purchased_value,
                    stock: row.current_stock,
                });

                r.eachCell((cell, colNum) => {
                    cell.fill = fill;
                    cell.border = border;
                    cell.font = { name: "Calibri", size: 10, color: { argb: DARK_TEXT } };
                    // Right-align numeric columns (5–11)
                    cell.alignment = { horizontal: colNum >= 5 ? "right" : "left", vertical: "middle" };
                    // Currency format for price / value columns
                    if ([5, 7, 10].includes(colNum)) {
                        cell.numFmt = '"₱"#,##0.00';
                    }
                    // Status color
                    if (colNum === 3) {
                        cell.font = {
                            name: "Calibri", size: 10, bold: true,
                            color: { argb: row.status === "active" ? "FF1B5E20" : "FF616161" },
                        };
                    }
                    // Sold value red
                    if ([6, 7].includes(colNum)) {
                        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF9C0306" } };
                    }
                    // Purchased value green
                    if ([9, 10].includes(colNum)) {
                        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF1B5E20" } };
                    }
                });
                r.height = 20;
            });

            // ── Spacer row ───────────────────────────────────────────────
            const spacer = sheet.addRow([]);
            spacer.height = 6;

            // ── Totals row ───────────────────────────────────────────────
            const totalsRow = sheet.addRow({
                date: "TOTALS",
                name: "",
                status: "",
                variant: "",
                price: "",
                sold_qty: totals.sold_qty,
                sold_val: totals.sold_value,
                decrease: totals.sold_qty,
                purch_qty: totals.purchased_qty,
                purch_val: totals.purchased_value,
                stock: "",
            });

            totalsRow.eachCell((cell, colNum) => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GRAY_FILL } };
                cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: DARK_TEXT } };
                cell.alignment = { horizontal: colNum >= 5 ? "right" : "left", vertical: "middle" };
                cell.border = {
                    top: { style: "medium", color: { argb: DARK_RED } },
                    bottom: { style: "medium", color: { argb: DARK_RED } },
                };
                if ([7, 10].includes(colNum)) cell.numFmt = '"₱"#,##0.00';
            });
            totalsRow.height = 24;

            // Highlight "TOTALS" label cell
            const totalsLabelCell = totalsRow.getCell(1);
            totalsLabelCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: WHITE_TEXT } };
            totalsLabelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: DARK_RED } };
            sheet.mergeCells(totalsRow.number, 1, totalsRow.number, 4);

            // ── Footer row ───────────────────────────────────────────────
            const footerRowNum = totalsRow.number + 2;
            sheet.mergeCells(footerRowNum, 1, footerRowNum, totalCols);
            const footerCell = sheet.getRow(footerRowNum).getCell(1);
            footerCell.value = "This report is system-generated by UMERCH. For internal use only.";
            footerCell.font = { name: "Calibri", italic: true, size: 9, color: { argb: "FF999999" } };
            footerCell.alignment = { horizontal: "center" };

            // ── Freeze panes ─────────────────────────────────────────────
            sheet.views = [{ state: "frozen", xSplit: 0, ySplit: 4, showGridLines: true }];

            // ── Download ─────────────────────────────────────────────────
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `inventory-report-${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
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
                                onClick={handleExportExcel}
                                disabled={loading || reportData.length === 0}
                                className="flex-1 bg-[#9C0306] hover:bg-red-900 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                            >
                                Export Excel
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
                                                Status
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
                                        {paginatedData.map((row, idx) => (
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
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {row.status === 'active' ? 'Active' : 'Archived'}
                                                    </span>
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-6 py-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="text-gray-900 hover:text-[#9C0306] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`font-semibold text-sm ${page === currentPage
                                                ? 'text-[#9C0306]'
                                                : 'text-gray-900 hover:text-[#9C0306]'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="text-gray-900 hover:text-[#9C0306] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

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
