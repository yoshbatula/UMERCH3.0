import { useState, useEffect } from "react";
import axios from "axios";

export const useStockIn = () => {
    const [stocks, setStocks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [toast, setToast] = useState("");
    const [showingToast, setShowingToast] = useState(false);
    const [receiptFormOpen, setReceiptFormOpen] = useState(false);

    const API = "/admin/stock-in";

    const openReceiptForm = () => {
        setReceiptFormOpen(true);
    };

    const closeReceiptForm = () => {
        setReceiptFormOpen(false);
    };

    const fetchStocks = () => {
        axios.get(API).then(res => setStocks(res.data));
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const showToast = (message) => {
        setToast(message);
        setShowingToast(true);
        setTimeout(() => setShowingToast(false), 5000);
    };

    const getStatus = qty => {
        if (qty === 0) return { label: "Out of Stock", color: "text-red-600" };
        if (qty <= 20) return { label: "Low Stock", color: "text-orange-500" };
        return { label: "Active", color: "text-green-600" };
    };

    // Filter stocks based on search query
    const filteredStocks = stocks.filter(stock => 
        stock.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        // State
        stocks,
        filteredStocks,
        searchQuery,
        setSearchQuery,
        openAdd,
        setOpenAdd,
        openEdit,
        setOpenEdit,
        selectedStock,
        setSelectedStock,
        toast,
        showingToast,
        receiptFormOpen,

        // Functions
        openReceiptForm,
        closeReceiptForm,
        fetchStocks,
        showToast,
        getStatus,
    };
};
