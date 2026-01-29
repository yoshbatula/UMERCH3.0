import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function EditStocks({ open, onClose, stock, onSuccess }) {
    const [quantity, setQuantity] = useState(stock?.stock_qty || "");
    const [variant, setVariant] = useState(stock?.variant || "");
    const [confirm, setConfirm] = useState(false);

    if (!open || !stock) return null;

    const handleUpdate = (e) => {
        e.preventDefault();
        router.patch(`/admin/stock-in/${stock.stock_in_id}`, {
            stock_qty: Number(quantity),
            variant: variant,
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
                                    Add Quantity
                                </label>
                                <input
                                    type="number"
                                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold">
                                    Variation
                                </label>
                                <input
                                    type="text"
                                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                                    value={variant}
                                    onChange={e => setVariant(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 pt-6">
                            <button
                                onClick={() => setConfirm(true)}
                                className="bg-red-800 hover:bg-red-900 text-white px-10 py-2 rounded-full text-sm font-semibold"
                            >
                                Edit
                            </button>

                            <button
                                onClick={onClose}
                                className="border border-red-700 text-red-700 px-10 py-2 rounded-full text-sm font-semibold"
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
