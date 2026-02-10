import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function EditStocks({ open, onClose, stock, onSuccess }) {
    const [quantity, setQuantity] = useState(stock?.stock_qty || "");
    const [quantityError, setQuantityError] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (open && stock) {
            // Fetch products to validate
            axios.get("/admin/products").then(res => {
                const activeProducts = res.data.filter(p => p.status === 'active');
                setProducts(activeProducts);
            });
            
            setQuantity(stock.stock_qty);
        }
    }, [open, stock]);

    if (!open || !stock) return null;

    const handleUpdate = (e) => {
        e.preventDefault();
        
        // Validate if the product with this variant exists in active products
        const productExists = products.find(
            p => p.product_name === stock.product_name && p.variant === stock.variant
        );
        
        if (!productExists) {
            alert(`The product variant is not available. Please check the product table.`);
            return;
        }
        
        // Validate if product is active
        if (productExists.status !== 'active') {
            alert(`Cannot edit stock for an archived product. Please restore the product first.`);
            return;
        }

        // Validate quantity is not zero or negative
        if (!quantity || parseFloat(quantity) <= 0) {
            alert("Quantity must be greater than zero.");
            return;
        }

        if (quantityError) {
            alert("Quantity must be greater than zero.");
            return;
        }
        
        router.patch(`/admin/stock-in/${stock.stock_in_id}`, {
            stock_qty: Number(quantity),
            variant: stock.variant,
        }, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                onClose();
                setConfirm(false);
            },
            preserveScroll: true,
            replace: true,
        });
    };

return (
    <>
        {/* ✅ BLURRED BACKGROUND */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

        {/* MAIN MODAL */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-[520px] rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-red-800 text-white px-6 py-4 text-lg font-bold">
                    Stock In
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                        {/* Product Image */}
                        <img
                            src={stock.product_image}
                            alt=""
                            className="w-28 h-28 object-cover rounded-lg border"
                        />

                        {/* Product Info */}
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">
                                {stock.product_name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                            </p>
                            <p className="text-red-700 font-bold mt-2">
                                ₱{stock.cost}
                            </p>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="text-sm font-semibold">
                                Edit Quantity
                            </label>
                            <input
                                type="number"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                                value={quantity}
                                min="1"
                                onChange={e => {
                                    const value = e.target.value;
                                    // Prevent negative values
                                    if (value === '' || parseFloat(value) >= 0) {
                                        setQuantity(value);
                                        // Check for zero or negative and show error
                                        const numValue = parseFloat(value);
                                        if (value && numValue <= 0) {
                                            setQuantityError("Quantity must be greater than zero.");
                                        } else {
                                            setQuantityError("");
                                        }
                                    }
                                }}
                                onKeyDown={e => {
                                    // Prevent typing minus sign
                                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                        e.preventDefault();
                                    }
                                }}
                                onPaste={e => {
                                    // Handle paste events
                                    const pastedData = e.clipboardData.getData('text');
                                    if (parseFloat(pastedData) < 0) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            {quantityError && (
                                <p className="text-red-600 text-xs mt-1">{quantityError}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold">
                                Variation
                            </label>
                            <input
                                type="text"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                                value={stock.variant}
                                readOnly
                                disabled
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-4 pt-6">
                        <button
                            onClick={() => setConfirm(true)}
                            className="bg-red-800 hover:bg-red-900 text-white px-10 py-2 rounded-full text-sm font-semibold hover:cursor-pointer"
                        >
                            Edit
                        </button>

                        <button
                            onClick={onClose}
                            className="border border-red-700 text-red-700 px-10 py-2 rounded-full text-sm font-semibold hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* ✅ CONFIRMATION MODAL */}
        {confirm && (
            <>
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

                <div className="fixed inset-0 flex items-center justify-center z-60">
                    <div className="bg-white w-[360px] rounded-xl p-6 text-center space-y-4">
                        <p className="font-semibold">
                            Are you sure you want to make changes in stock?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="bg-red-800 text-white px-8 py-2 rounded-full text-sm"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setConfirm(false)}
                                className="border border-red-700 text-red-700 px-8 py-2 rounded-full text-sm"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
);
}
