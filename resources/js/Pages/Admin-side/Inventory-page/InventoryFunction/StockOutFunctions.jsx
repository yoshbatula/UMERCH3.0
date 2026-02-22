import { useState, useEffect } from "react";
import axios from "axios";

export const useStockOut = () => {
    const [logs, setLogs] = useState([]);
    const [stocks, setStocks] = useState([]);

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

    return {
        // State
        logs,
        stocks,

        // Functions
        fetchStocks,
        fetchLogs,
    };
};
