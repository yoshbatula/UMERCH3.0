import React, { useEffect, useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function AddStock({ open, onClose, onSuccess }) {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [variantOptions, setVariantOptions] = useState([]);
    const [variation, setVariation] = useState("");
    const [quantity, setQuantity] = useState("");
    const [quantityError, setQuantityError] = useState("");
    const [confirm, setConfirm] = useState(false);

    const variantTypesMap = {
        size: ["XS", "S", "M", "L", "XL"],
        mug: ["11ml", "13ml"],
        tumbler: ["12oz", "16oz", "20oz", "24oz"],
        notebook: ["30 pages", "50 pages", "100 pages"],
        pen: [],
        umbrella: [],
        keychain: [],
        totebag: [],
        pillow: [],
    };

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

    // Derive variant options from selected product's variant_type
    useEffect(() => {
        if (productId) {
            // Find the first product with this name that is active
            const selectedProduct = products.find(p => p.product_name === productId && p.status === 'active');
            
            if (selectedProduct && selectedProduct.variant_type) {
                // Use the stored variant_type to get all possible variations
                const options = variantTypesMap[selectedProduct.variant_type] || [];
                setVariantOptions(options);
            } else {
                // Fallback: no variants available
                setVariantOptions([]);
            }
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
        
        // Find the selected product by name
        const selected = products.find(p => p.product_name === productId && p.status === 'active');
        
        // Validate if product exists
        if (!selected) {
            alert(`Product not found. Please select a valid product.`);
            return;
        }
        
        // Validate if variation is selected (only if the variant type has options)
        if (variantOptions.length > 0 && !variation) {
            alert(`Please select a variation.`);
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

        // Use variant_type as default if no variants exist
        const finalVariant = variantOptions.length === 0 ? selected.variant_type : variation;
        
        const derivedCost = selected ? Number(selected.product_price) : 0;
        router.post("/admin/stock-in/store", {
            product_id: selected?.product_id,
            variant: finalVariant,
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
                        {variantOptions.length > 0 && (
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
                        )}

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
