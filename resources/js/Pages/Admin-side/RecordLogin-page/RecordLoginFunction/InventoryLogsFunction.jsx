import { useState, useEffect } from "react";
import axios from "axios";

export const useInventoryLogs = () => {
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

    return {
        // State
        logs,
        allLogs,
        loading,
        query,
        setQuery,
        typeFilter,
        setTypeFilter,
        currentPage,
        setCurrentPage,
        totalPages,
        perPage,

        // Functions
        fetchLogs,
        fetchAllLogs,
        formatDate,
        getTypeBadgeColor,
    };
};
