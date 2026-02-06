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
                // Filter only active products
                const activeProducts = res.data.filter(p => p.status === 'active');
                setProducts(activeProducts);
            });
        }
    }, [open]);

    // Group products by name
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

    // Derive variant options from selected product's `variant` field
    useEffect(() => {
        if (productId) {
            // Find all active products with the same product_name to get all variants
            const sameNameProducts = products.filter(p => p.product_name === productId && p.status === 'active');
            const variants = sameNameProducts.map(p => p.variant).filter(v => v);

            // Deduplicate while preserving order
            const seen = new Set();
            const unique = variants.filter(v => {
                if (seen.has(v)) return false;
                seen.add(v);
                return true;
            });

            // Determine variant type based on existing variants
            let options = [];
            if (unique.some(v => ["XS", "S", "M", "L", "XL"].includes(v))) {
                // Size variants
                options = ["XS", "S", "M", "L", "XL"].filter(size => unique.includes(size));
            } else if (unique.some(v => ["350ml", "500ml", "750ml"].includes(v))) {
                // Mug or Tumbler variants
                options = ["350ml", "500ml", "750ml"].filter(vol => unique.includes(vol));
            } else if (unique.some(v => ["50 pages", "80 pages", "100 pages"].includes(v))) {
                // Notebook variants
                options = ["50 pages", "80 pages", "100 pages"].filter(page => unique.includes(page));
            } else {
                // Other variants (Pen, Umbrella, Keychain, Tote bag, Pillow)
                options = unique;
            }

            setVariantOptions(options.length > 0 ? options : unique);
            setVariation("");
        } else {
            setVariantOptions([]);
            setVariation("");
        }
    }, [productId, products]);

    // Update variation when selected
    const handleVariantChange = (selectedVariant) => {
        setVariation(selectedVariant);
    };

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Find the selected product with matching name and variant
        const selected = products.find(p => p.variant === variation && p.product_name === productId);
        
        // Validate if product variant exists
        if (!selected) {
            alert(`The selected variation "${variation}" is not available for this product. Please select a valid variation.`);
            return;
        }
        
        // Validate if product is active
        if (selected.status !== 'active') {
            alert(`Cannot add stock to an archived product. Please restore the product first.`);
            return;
        }
        
        const derivedCost = selected ? Number(selected.product_price) : 0;
        router.post("/admin/stock-in/store", {
            product_id: selected?.product_id,
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
                                {Object.entries(groupProductsByName(products)).map(([productName, variants]) => (
                                    <option key={productName} value={productName}>
                                        {productName}
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
                                onChange={e => handleVariantChange(e.target.value)}
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
                                min="0"
                                onChange={e => {
                                    const value = e.target.value;
                                    // Prevent negative values
                                    if (value === '' || parseFloat(value) >= 0) {
                                        setQuantity(value);
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
