import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddStock({ open, onClose, onSuccess }) {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [variation, setVariation] = useState("");
    const [quantity, setQuantity] = useState("");
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        if (open) {
            axios.get("/api/admin/products").then(res => {
                setProducts(res.data);
            });
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async () => {
        try {
            await axios.post("/api/admin/stock-in", {
                product_id: productId,
                variant: variation,
                qty: quantity,
            });

            onSuccess();
            onClose();
            setConfirm(false);
            setProductId("");
            setVariation("");
            setQuantity("");
        } catch (error) {
            console.error("Stock in failed", error);
        }
    };

    return (
        <>
            {/* ✅ BLURRED BACKGROUND */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

            {/* MAIN MODAL */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white w-[420px] rounded-xl overflow-hidden">
                    <div className="bg-red-800 text-white px-6 py-4 text-lg font-bold">
                        Stock In
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Product */}
                        <div>
                            <label className="text-sm font-semibold">
                                Select Products
                            </label>
                            <select
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                                value={productId}
                                onChange={e => setProductId(e.target.value)}
                            >
                                <option value="">Select Products</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.product_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Variation */}
                        <div>
                            <label className="text-sm font-semibold">
                                Variation
                            </label>
                            <input
                                type="text"
                                placeholder="Select Variation"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                                value={variation}
                                onChange={e => setVariation(e.target.value)}
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="text-sm font-semibold">
                                Add Quantity
                            </label>
                            <input
                                type="number"
                                placeholder="Enter Quantity"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-full text-sm border border-red-600 text-red-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setConfirm(true)}
                                className="px-6 py-2 rounded-full text-sm bg-red-800 text-white"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ CONFIRM MODAL (ALSO BLURRED) */}
            {confirm && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <div className="fixed inset-0 flex items-center justify-center z-60">
                        <div className="bg-white rounded-xl w-[320px] p-6 text-center space-y-4">
                            <p className="font-semibold">
                                Are you sure you want to add a stock?
                            </p>    

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-red-800 text-white px-6 py-2 rounded-full text-sm"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setConfirm(false)}
                                    className="border border-red-600 text-red-600 px-6 py-2 rounded-full text-sm"
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
