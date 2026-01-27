import React, { useState } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import AdminAddProduct from "../../../components/modals/AdminAddProduct";
import AdminEditProduct from "../../../components/modals/AdminEditProduct";

// StatCard component
const StatCard = ({ title, value, className, icon }) => (
    <div className={`w-[260px] h-[96px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${className}`}>
        <div>
            <div className="text-sm opacity-90">{title}</div>
            <div className="text-2xl font-bold leading-tight mt-1">{value}</div>
        </div>
        {icon && (
            <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
                {icon}
            </div>
        )}
    </div>
);

// Icon component
const Icon = ({ children }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {children}
    </svg>
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

export default function AdminInventory() {
    const [products, setProducts] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="h-screen sticky top-0">
                <Sidebar />
            </div>

            <div className="flex-1 px-10 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                    <h1 className="text-4xl font-extrabold tracking-[0.25em]">INVENTORY</h1>
                </div>
                <p className="text-gray-500 mb-6">
                    Welcome back Admin, everything looks great.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                    <StatCard title="Total Stocks" value={products.length} className="bg-green-700" />
                    <StatCard title="Low Stocks" value="0" className="bg-orange-500" />
                    <StatCard title="Out of Stocks" value="0" className="bg-red-600" />
                </div>

                {/* Products Section */}
                <div>
                    <h2 className="text-2xl font-bold mt-10">Products</h2>

                    <div className="mt-4 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-3 flex-1 max-w-[520px] bg-white rounded-lg px-4 py-3 border border-gray-200">
                            <input type="text" placeholder="Search products" className="bg-transparent outline-none w-full text-sm" />
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
                                <div className="col-span-4">Cost</div>
                                <div className="col-span-2 text-right">Action</div>
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
                                products.map((product, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-12 py-4 px-8 border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <div className="col-span-6 flex items-center gap-3">
                                            {product.image && (
                                                <img src={product.image} alt="" className="w-10 h-10 object-cover rounded" />
                                            )}
                                            {product.name}
                                        </div>

                                        <div className="col-span-4">₱{product.price}</div>

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
                                                onClick={() =>
                                                    setProducts(products.filter((_, i) => i !== index))
                                                }
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
            <AdminAddProduct
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onAddProduct={(newProduct) =>
                    setProducts((prev) => [...prev, newProduct])
                }
            />

            <AdminEditProduct
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                product={selectedProduct}
                onSave={(updatedProduct) => {
                    setProducts((prev) =>
                        prev.map((p) => (p === selectedProduct ? updatedProduct : p))
                    );
                }}
            />

        </div>
    );
}
