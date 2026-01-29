import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import EditProductModal from "../../../components/modals/EditProductModal";
import axios from "axios";
import AddProductModal from "../../../components/modals/AddProductModal";

// StatCard component
const StatCard = ({ title, value, className, icon }) => (
    <div className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${className}`}>
        <div>
            <div className="text-lg opacity-90">{title}</div>
            <div className="text-4xl font-bold leading-tight mt-1">{value}</div>
        </div>
        {icon && (
            <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
                {icon}
            </div>
        )}
    </div>
);

// Reusable Action Button
const ActionButton = ({ type, children, onClick }) => {
    const base = "text-xs font-semibold px-4 py-1.5 rounded-full";
    const styles =
        type === "edit"
            ? "bg-red-700 hover:bg-red-800 text-white"
            : "border border-red-700 text-red-700 hover:bg-red-50";

    return (
        <button onClick={onClick} className={`${base} ${styles}`}>
            {children}
        </button>
    );
};

export default function AddProducts() {
    const [products, setProducts] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [toast, setToast] = useState("");
    const [showingToast, setShowingToast] = useState(false);

    const API = "/admin/products";

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
        setToast(message);
        setShowingToast(true);
        setTimeout(() => setShowingToast(false), 5000);
    };

    // ✅ DELETE PRODUCT (DB, NOT ARRAY INDEX)
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`${API}/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (<>
        <div className="flex min-h-screen bg-gray-100">
            <div className="h-screen sticky top-0">
                <Sidebar />
            </div>

            <div className="flex-1 px-10 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                    <h1 className="text-4xl font-extrabold tracking-[0.25em]">
                        INVENTORY
                    </h1>
                </div>

                <p className="text-gray-500 mb-6">
                    Welcome back Admin, everything looks great.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                    <StatCard
                        title="Total Stocks"
                        value={products.length}
                        className="bg-green-700"
                    />
                    <StatCard
                        title="Low Stocks"
                        value={
                            products.filter(p => p.product_stock > 0 && p.product_stock <= 5).length
                        }
                        className="bg-orange-500"
                    />
                    <StatCard
                        title="Out of Stocks"
                        value={
                            products.filter(p => p.product_stock === 0).length
                        }
                        className="bg-red-600"
                    />
                </div>

                {/* Products Section */}
                <div>
                    <h2 className="text-2xl font-bold mt-10">Products</h2>

                    <div className="mt-4 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-3 flex-1 max-w-[520px] h-12 bg-white rounded-lg px-4 py-3 border border-gray-200">
                            <input
                                type="text"
                                placeholder="Search products"
                                className="bg-transparent outline-none w-full text-sm"
                            />
                        </div>

                        <button
                            onClick={() => setOpenAdd(true)}
                            className="bg-red-800 hover:bg-red-900 text-white px-10 py-3 rounded-full text-sm font-semibold"
                        >
                            Add Product
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl mt-6 shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-8 py-6">
                            <div className="grid grid-cols-12 text-sm font-bold text-red-700">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-4 px-4">Cost</div>
                                <div className="col-span-2 text-right px-14">Action</div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200" />

                        {/* Dynamic Table Body */}
                        <div className="min-h-[520px]">
                            {products.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    No products added yet
                                </div>
                            ) : (
                                products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="grid grid-cols-12 py-4 px-8 border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <div className="col-span-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded overflow-hidden flex items-center justify-center bg-gray-200">
                                                {product.product_image ? (
                                                    <img
                                                        src={product.product_image}
                                                        alt={product.product_name}
                                                        className="w-10 h-10 object-cover rounded"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23e5e7eb"/><text x="20" y="22" font-size="10" text-anchor="middle" fill="%236b7280">No Img</text></svg>';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-gray-500">No Img</span>
                                                )}
                                            </div>
                                            {product.product_name}
                                        </div>

                                        <div className="col-span-4">
                                            ₱{product.product_price}
                                        </div>

                                        <div className="col-span-2 flex justify-end gap-2">
                                            <ActionButton
                                                type="edit"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setOpenEdit(true);
                                                }}
                                            >
                                                Edit
                                            </ActionButton>

                                            <ActionButton
                                                type="delete"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Delete
                                            </ActionButton>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <AdminFooter />
            </div>

            {/* Modals */}
            <AddProductModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={() => {
                    fetchProducts();
                    showToast("Product added successfully!");
                }}
            />

            <EditProductModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                product={selectedProduct}
                onSuccess={fetchProducts}
            />
        </div>
        {showingToast && (
            <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
                {toast}
            </div>
        )}
    </>);
}
