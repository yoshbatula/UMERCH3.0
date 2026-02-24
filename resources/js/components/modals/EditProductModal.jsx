import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminEditProduct({ open, onClose, product, onSuccess }) {
    const [preview, setPreview] = useState(null);
    const [priceError, setPriceError] = useState("");
    const [selectedVariantType, setSelectedVariantType] = useState("");
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        product_name: "",
        product_price: "",
        variant_type: "",
        product_description: "",
        product_image: null,
    });

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

    useEffect(() => {
        if (product) {
            setFormData({
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
        const newType = selectedVariantType === typeId ? "" : typeId;
        setSelectedVariantType(newType);
        setFormData((prev) => ({ ...prev, variant_type: newType }));
    };

    const handleInput = (e) => {
        const { name, value } = e.target;

        if (name === "product_price") {
            const numValue = parseFloat(value);
            if (value && numValue <= 0) {
                setPriceError("Price must be greater than zero. Please enter a valid price.");
            } else {
                setPriceError("");
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, product_image: file }));
        setPreview(file ? URL.createObjectURL(file) : preview);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!selectedVariantType) {
            alert("Please select a variation type.");
            return;
        }

        if (priceError) {
            alert("Price must be greater than zero. Please enter a valid price.");
            return;
        }

        if (!formData.product_price || parseFloat(formData.product_price) <= 0) {
            alert("Price must be greater than zero. Please enter a valid price.");
            return;
        }

        setProcessing(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

            const payload = new FormData();
            payload.append("product_name", formData.product_name);
            payload.append("product_price", formData.product_price);
            payload.append("variant_type", formData.variant_type);
            payload.append("product_description", formData.product_description);
            if (formData.product_image) {
                payload.append("product_image", formData.product_image);
            }
            // Laravel requires this for PATCH via FormData
            payload.append("_method", "PATCH");

            await axios.post(`/admin/products/${product.product_id}`, payload, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
            });

            setPriceError("");
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            console.error("Update failed", error);
            const msg = error.response?.data?.message || "Failed to update product. Please try again.";
            alert(msg);
        } finally {
            setProcessing(false);
        }
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
                            value={formData.product_description}
                            onChange={handleInput}
                            className="mt-2 w-full h-[180px] border rounded-lg p-3 text-sm resize-none outline-red-600"
                        />
                    </div>

                    {/* Product Name */}
                    <div className="col-span-2">
                        <label className="text-sm font-semibold">Product Name:</label>
                        <input
                            name="product_name"
                            value={formData.product_name}
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
                            value={formData.product_price}
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
                    <button
                        type="submit"
                        form="editProductForm"
                        disabled={processing}
                        className="bg-red-800 hover:bg-red-900 text-white px-10 py-2 rounded-full font-semibold hover:cursor-pointer disabled:opacity-60"
                    >
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
