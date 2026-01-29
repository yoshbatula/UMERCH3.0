import React, { useEffect, useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function AddStock({ open, onClose, onSuccess }) {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [variantOptions, setVariantOptions] = useState([]);
    const [variation, setVariation] = useState("");
    const [quantity, setQuantity] = useState("");
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        if (open) {
            axios.get("/admin/products").then(res => {
                setProducts(res.data);
            });
        }
    }, [open]);

    // Derive variant options from selected product's `variant` field
    useEffect(() => {
        const selected = products.find(p => String(p.product_id) === String(productId));
        const raw = selected?.variant || "";
        let options = [];
        if (raw) {
            // Split by common delimiters and trim
            options = raw.split(/[,|/\s]+/).map(v => v.trim()).filter(v => v.length > 0);
        }
        if (options.length === 0) {
            // Fallback defaults
            options = ["XS", "S", "M", "L", "XL"];
        }
        // Deduplicate while preserving order
        const seen = new Set();
        const unique = options.filter(v => {
            if (seen.has(v)) return false;
            seen.add(v);
            return true;
        });
        setVariantOptions(unique);
        // Reset selected variation if it no longer exists
        if (!unique.includes(variation)) {
            setVariation("");
        }
    }, [productId, products]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const selected = products.find(p => String(p.product_id) === String(productId));
        const derivedCost = selected ? Number(selected.product_price) : 0;
        router.post("/admin/stock-in/store", {
            product_id: productId,
            variant: variation,
            stock_qty: Number(quantity),
            cost: derivedCost,
        }, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                onClose();
                setConfirm(false);
                setProductId("");
                setVariation("");
                setQuantity("");
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
                                    <option key={product.product_id} value={product.product_id}>
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
                            <select
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                                value={variation}
                                onChange={e => setVariation(e.target.value)}
                                disabled={!productId}
                            >
                                <option value="">Select Variation</option>
                                {variantOptions.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
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
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-full text-sm border border-red-600 text-red-600 hover:cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirm(true)}
                                className="bg-red-800 text-white px-6 py-2 rounded-full text-sm hover:cursor-pointer"
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
                                    type="button"
                                    onClick={handleSubmit}
                                    className="bg-red-800 text-white px-6 py-2 rounded-full text-sm hover:cursor-pointer"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setConfirm(false)}
                                    className="border border-red-600 text-red-600 px-6 py-2 rounded-full text-sm hover:cursor-pointer"
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
