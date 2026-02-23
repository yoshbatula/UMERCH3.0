import { useState, useEffect } from "react";
import axios from "axios";

export const useStockOut = () => {
    const [logs, setLogs] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const STOCK_API = "/admin/stock-in";       // for StatCards (same as Stock-In)
    const LOG_API = "/admin/stock-out/logs";   // for table

    const fetchStocks = async () => {
        try {
            const res = await axios.get(STOCK_API);
            setStocks(res.data);
        } catch (err) {
            console.error("Failed to fetch stocks", err);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await axios.get(LOG_API);
            console.log('📋 Stock-out logs fetched:', res.data);
            setLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch stock-out logs", err);
        }
    };

    useEffect(() => {
        fetchStocks();
        fetchLogs();

        // Auto-refresh every 5 seconds
        const interval = setInterval(() => {
            fetchStocks();
            fetchLogs();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Filter logs based on search query
    const filteredLogs = logs.filter(log => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            log.product_name?.toLowerCase().includes(query) ||
            log.variant?.toLowerCase().includes(query)
        );
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return {
        // State
        logs: paginatedLogs,
        allLogs: logs,
        stocks,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,

        // Functions
        fetchStocks,
        fetchLogs,
    };
};
