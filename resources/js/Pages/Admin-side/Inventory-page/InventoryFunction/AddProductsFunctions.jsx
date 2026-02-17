import { useState, useEffect } from "react";
import axios from "axios";
import placeholderImg from "@images/product-placeholder.svg";

export const useAddProducts = () => {
    const [products, setProducts] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [toast, setToast] = useState("");
    const [showingToast, setShowingToast] = useState(false);
    const [expandedProducts, setExpandedProducts] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    const API = "/admin/products";

    const normalizeImageUrl = (u) => {
        if (!u) return placeholderImg;
        if (u.startsWith('http')) return u;
        if (u.startsWith('/')) return u;
        return '/' + u;
    };

    // ✅ GROUP PRODUCTS BY NAME
    const groupProductsByName = (productList) => {
        const grouped = {};
        productList.forEach((product) => {
            if (!grouped[product.product_name]) {
                grouped[product.product_name] = [];
            }
            grouped[product.product_name].push(product);
        });
        return grouped;
    };

    // ✅ FETCH PRODUCTS FROM DATABASE
    const fetchProducts = async () => {
        try {
            const res = await axios.get(API);
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const showToast = (message) => {
        console.log('Showing toast:', message);
        setToast(message);
        setShowingToast(true);
        setTimeout(() => {
            console.log('Hiding toast');
            setShowingToast(false);
        }, 5000);
    };

    const toggleExpanded = (productName) => {
        setExpandedProducts(prev => ({
            ...prev,
            [productName]: !prev[productName]
        }));
    };

    // ✅ DELETE PRODUCT (DB, NOT ARRAY INDEX)
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`${API}/${id}`);
            fetchProducts();
            showToast("Product deleted successfully!");
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    // ✅ ARCHIVE PRODUCT
    const handleArchive = async (id) => {
        try {
            const response = await axios.patch(`${API}/${id}/archive`);
            // Optimistic update: update UI immediately only if successful
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.product_id === id
                        ? { ...product, status: 'archived' }
                        : product
                )
            );
            console.log('Archive response:', response);
            showToast("Product archived successfully!");
            // Fetch to sync with server (in background)
            await fetchProducts();
        } catch (error) {
            console.error("Archive failed", error);
            
            // Check if error is due to pending orders
            if (error.response?.data?.error === 'pending_orders_exist') {
                showToast("Cannot archive this product. There are pending orders containing this item.");
            } else {
                showToast(error.response?.data?.message || "Failed to archive product");
            }
            
            // Revert on error
            await fetchProducts();
        }
    };

    // ✅ RESTORE PRODUCT
    const handleRestore = async (id) => {
        // Optimistic update: update UI immediately
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.product_id === id
                    ? { ...product, status: 'active' }
                    : product
            )
        );
        showToast("Product restored successfully!");

        try {
            const response = await axios.patch(`${API}/${id}/restore`);
            console.log('Restore response:', response);
            // Fetch to sync with server (in background)
            await fetchProducts();
        } catch (error) {
            console.error("Restore failed", error);
            // Revert on error
            await fetchProducts();
        }
    };

    return {
        // State
        products,
        openAdd,
        setOpenAdd,
        openEdit,
        setOpenEdit,
        selectedProduct,
        setSelectedProduct,
        openDelete,
        setOpenDelete,
        toast,
        showingToast,
        expandedProducts,
        searchQuery,
        setSearchQuery,

        // Functions
        normalizeImageUrl,
        groupProductsByName,
        fetchProducts,
        showToast,
        toggleExpanded,
        handleDelete,
        handleArchive,
        handleRestore,
    };
};
