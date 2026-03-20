import React, { useEffect, useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function AddStockOut({ open, onClose, onSuccess }) {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [variantOptions, setVariantOptions] = useState([]);
    const [variation, setVariation] = useState("");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("defected");
    const [quantityError, setQuantityError] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const reasonOptions = [
        { value: "defected", label: "Defected" },
        { value: "damaged", label: "Damaged" },
        { value: "return", label: "Return" },
        { value: "adjustment", label: "Adjustment" },
    ];

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
        
        // Prevent double submission
        if (isSubmitting) {
            return;
        }
        
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
        
        const submitData = {
            product_id: selected?.product_id,
            quantity: Number(quantity),
            reason: reason,
            modified_by: "Admin"
        };
        console.log('Stock Out Submit Data:', submitData);
        
        setIsSubmitting(true);
        
        router.post("/admin/stock-out/store", submitData, {
            onSuccess: () => {
                console.log('Stock Out Success');
                setIsSubmitting(false);
                if (onSuccess) onSuccess();
                onClose();
                setConfirm(false);
                setProductId("");
                setVariation("");
                setQuantity("");
                setReason("defected");
            },
            onError: (errors) => {
                console.error('Stock Out Error:', errors);
                setIsSubmitting(false);
                alert('Error removing stock: ' + JSON.stringify(errors));
            },
            preserveScroll: true,
            replace: true,
        });
    };

    const grouped = groupProductsByName(products);

    return (
        <>
            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                />
            )}

            {/* MODAL */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all ${
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-lg shadow-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* HEADER */}
                    <div className="bg-red-700 text-white px-6 py-4 flex justify-between items-center">
                        <h2 className="text-lg font-bold">Remove Stock</h2>
                        <button
                            onClick={onClose}
                            className="text-xl leading-none hover:opacity-70"
                        >
                            ✕
                        </button>
                    </div>

                    {/* CONTENT */}
                    {!confirm ? (
                        <form onSubmit={(e) => { e.preventDefault(); setConfirm(true); }} className="p-6 space-y-4">
                            {/* PRODUCT DROPDOWN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                                    required
                                >
                                    <option value="">Select a product</option>
                                    {Object.keys(grouped).map((productName) => (
                                        <option key={productName} value={productName}>
                                            {productName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* VARIANT DROPDOWN */}
                            {variantOptions.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Variant <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={variation}
                                        onChange={(e) => handleVariantChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                                        required
                                    >
                                        <option value="">Select variant</option>
                                        {variantOptions.map((v) => (
                                            <option key={v} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* QUANTITY */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setQuantity(value);
                                        if (value <= 0) {
                                            setQuantityError("Quantity must be greater than zero");
                                        } else {
                                            setQuantityError("");
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                        quantityError
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-red-700"
                                    }`}
                                    placeholder="0"
                                    required
                                />
                                {quantityError && (
                                    <p className="text-red-600 text-xs mt-1">{quantityError}</p>
                                )}
                            </div>

                            {/* REASON DROPDOWN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                                    required
                                >
                                    {reasonOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium disabled:opacity-50"
                                    disabled={!productId || !quantity || quantityError !== ""}
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    ) : (
                        // CONFIRMATION VIEW
                        <div className="p-6 space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 font-semibold mb-2">Confirm Stock Removal</p>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="font-medium">Product:</span> {productId} 
                                        {variation && <span> ({variation})</span>}
                                    </p>
                                    <p>
                                        <span className="font-medium">Quantity:</span> {quantity}
                                    </p>
                                    <p>
                                        <span className="font-medium">Reason:</span> {reasonOptions.find(r => r.value === reason)?.label}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600">
                                Are you sure you want to remove {quantity} unit(s) of {productId} from stock?
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? "Removing..." : "Remove Stock"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
