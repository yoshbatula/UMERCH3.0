import { useState, useEffect } from "react";
import axios from "axios";

export const useActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [activityFilter, setActivityFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(10);

    // Fetch logs from API
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/admin/activity-logs", {
                params: {
                    search: query,
                    activity: activityFilter,
                    page: currentPage,
                    per_page: perPage,
                },
            });
            setLogs(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Error fetching activity logs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all logs for stats (without pagination)
    const fetchAllLogs = async () => {
        try {
            const response = await axios.get("/api/admin/activity-logs", {
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
    }, [currentPage, activityFilter, query]);

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

    // Get badge color based on activity type
    const getActivityBadgeColor = (activity) => {
        // Check for partial matches first (for Archive/Restore)
        if (activity.startsWith("Archived Product:")) {
            return "bg-orange-100 text-orange-800";
        }
        if (activity.startsWith("Restored Product:")) {
            return "bg-blue-100 text-blue-800";
        }

        const colors = {
            "Login": "bg-green-100 text-green-800",
            "Logout": "bg-red-100 text-red-800",
            "Activated": "bg-blue-100 text-blue-800",
            "Deactivated": "bg-orange-100 text-orange-800",
        };
        return colors[activity] || "bg-gray-100 text-gray-800";
    };

    return {
        // State
        logs,
        allLogs,
        loading,
        query,
        setQuery,
        activityFilter,
        setActivityFilter,
        currentPage,
        setCurrentPage,
        totalPages,
        perPage,

        // Functions
        fetchLogs,
        fetchAllLogs,
        formatDate,
        getActivityBadgeColor,
    };
};
