import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function AdminEditProduct({ open, onClose, product, onSuccess }) {
    const [preview, setPreview] = useState(null);
    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        product_name: "",
        product_price: "",
        variant: "",
        product_description: "",
        product_image: null,
    });

    useEffect(() => {
        if (product) {
            setData({
                product_name: product.product_name || "",
                product_price: product.product_price || "",
                variant: product.variant || "",
                product_description: product.product_description || "",
                product_image: null,
            });
            setPreview(product.product_image || null);
        }
    }, [product]);

    if (!open) return null;

    const handleInput = (e) => {
        const { name, value } = e.target;
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
        patch(`/admin/products/${product.product_id}`, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
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
                            name="product_price"
                            value={data.product_price}
                            onChange={handleInput}
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                        />
                    </div>

                    {/* Variation */}
                    <div>
                        <label className="text-sm font-semibold">
                            Variation <span className="text-red-600">*</span>
                        </label>
                        <select
                            name="variant"
                            value={data.variant}
                            onChange={handleInput}
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                        >
                            <option value="">Select Variation</option>
                            <option>XS</option>
                            <option>S</option>
                            <option>M</option>
                            <option>L</option>
                            <option>XL</option>
                        </select>
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
