import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function AdminEditProduct({ open, onClose, product, onSuccess }) {
    const [preview, setPreview] = useState(null);
    const [priceError, setPriceError] = useState("");
    const [selectedVariantType, setSelectedVariantType] = useState("");

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

    const variantTypes = [
        { id: "size", label: "Size XS-XL", hasVariants: true },
        { id: "mug", label: "Mug", hasVariants: true },
        { id: "tumbler", label: "Tumbler", hasVariants: true },
        { id: "notebook", label: "Notebook", hasVariants: true },
        { id: "pen", label: "Pen", hasVariants: false },
        { id: "umbrella", label: "Umbrella", hasVariants: false },
        { id: "keychain", label: "Keychain", hasVariants: false },
        { id: "totebag", label: "Tote bag", hasVariants: false },
        { id: "pillow", label: "Pillow", hasVariants: false },
    ];

    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        product_name: "",
        product_price: "",
        variant_type: "",
        product_description: "",
        product_image: null,
    });

    useEffect(() => {
        if (product) {
            setData({
                product_name: product.product_name || "",
                product_price: product.product_price || "",
                variant_type: product.variant_type || "",
                product_description: product.product_description || "",
                product_image: null,
            });
            setSelectedVariantType(product.variant_type || "");
            setPreview(product.product_image || null);
        }
    }, [product]);

    useEffect(() => {
        if (!open) {
            setPriceError("");
            setSelectedVariantType("");
        }
    }, [open]);

    if (!open) return null;

    const handleVariantTypeChange = (typeId) => {
        if (selectedVariantType === typeId) {
            setSelectedVariantType("");
            setData("variant_type", "");
        } else {
            setSelectedVariantType(typeId);
            setData("variant_type", typeId);
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        
        // Check for zero or negative price and show error message
        if (name === 'product_price') {
            const numValue = parseFloat(value);
            if (value && numValue <= 0) {
                setPriceError("Price must be greater than zero. Please enter a valid price.");
            } else {
                setPriceError("");
            }
        }
        
        setData(name, value);
        clearErrors(name);
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0] || null;
        setData("product_image", file);
        setPreview(file ? URL.createObjectURL(file) : preview);
        clearErrors("product_image");
    };

    const handleSave = (e) => {
        e.preventDefault();

        // Validate variation type is selected
        if (!selectedVariantType) {
            alert("Please select a variation type.");
            return;
        }

        // Validate price is not zero or negative
        if (priceError) {
            alert("Price must be greater than zero. Please enter a valid price.");
            return;
        }

        if (!data.product_price || parseFloat(data.product_price) <= 0) {
            alert("Price must be greater than zero. Please enter a valid price.");
            return;
        }

        patch(`/admin/products/${product.product_id}`, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                setPriceError("");
                reset();
                onClose && onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-[700px] overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="bg-red-800 px-6 py-4 text-white font-bold text-lg">
                    Edit Product
                </div>

                {/* Body */}
                <form id="editProductForm" onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-6">

                    {/* Image */}
                    <div>
                        <div className="border-2 border-dashed border-red-400 rounded-lg h-[180px] flex items-center justify-center">
                            {preview ? (
                                <img src={preview} alt="preview" className="h-full object-contain" />
                            ) : (
                                <span className="text-red-600 text-sm">No image</span>
                            )}
                        </div>

                        <label className="mt-2 block text-center text-sm text-red-700 cursor-pointer">
                            Choose file to upload
                            <input type="file" className="hidden" onChange={handleFile} />
                        </label>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold">Description:</label>
                        <textarea
                            name="product_description"
                            value={data.product_description}
                            onChange={handleInput}
                            className="mt-2 w-full h-[180px] border rounded-lg p-3 text-sm resize-none outline-red-600"
                        />
                    </div>

                    {/* Product Name */}
                    <div className="col-span-2">
                        <label className="text-sm font-semibold">Product Name:</label>
                        <input
                            name="product_name"
                            value={data.product_name}
                            onChange={handleInput}
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-sm font-semibold">Price:</label>
                        <input
                            type="number"
                            min="1"
                            step="0.01"
                            name="product_price"
                            value={data.product_price}
                            onChange={handleInput}
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                        />
                        {priceError && (
                            <p className="text-red-600 text-xs mt-1">{priceError}</p>
                        )}
                    </div>

                    {/* Variation Type */}
                    <div className="col-span-2">
                        <label className="text-sm font-semibold mb-2 block">
                            Variation Type <span className="text-red-600">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {variantTypes.map((type) => (
                                <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedVariantType === type.id}
                                        onChange={() => handleVariantTypeChange(type.id)}
                                        className="w-4 h-4 accent-red-800"
                                    />
                                    <span className="text-sm">{type.label}</span>
                                </label>
                            ))}
                        </div>
                        {!selectedVariantType && (
                            <p className="text-red-600 text-xs mt-2">Please select a variant type</p>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-4 px-6 pb-6">
                    <button type="submit" form="editProductForm" disabled={processing} className="bg-red-800 hover:bg-red-900 text-white px-10 py-2 rounded-full font-semibold hover:cursor-pointer">
                        {processing ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        onClick={onClose}
                        className="border border-red-700 text-red-700 px-8 py-2 rounded-full font-semibold hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
