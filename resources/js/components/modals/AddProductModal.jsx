import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

export default function AddProductModal({ open, isOpen, onClose, onSuccess }) {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        product_name: "",
        product_price: "",
        variant: "",
        product_description: "",
        product_image: null,
    });

    const visible = typeof isOpen !== "undefined" ? isOpen : open;

    useEffect(() => {
        if (!visible) setPreview(null);
    }, [visible]);

    if (!visible) return null;

    const handleInput = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        clearErrors(name);
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0] || null;
        setData("product_image", file);
        setPreview(file ? URL.createObjectURL(file) : null);
        clearErrors("product_image");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/products", {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                reset();
                setPreview(null);
                onClose && onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-[720px] shadow-2xl rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-red-800 px-6 py-4 text-white font-bold text-lg">ADD PRODUCT</div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
                    {/* Image Upload */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">Product Image</label>
                        <label className="border-2 border-dashed border-red-400 rounded-lg h-[180px] flex flex-col items-center justify-center cursor-pointer text-red-600">
                            <input type="file" className="hidden" onChange={handleFile} />
                            {preview ? (
                                <img src={preview} alt="preview" className="h-full object-contain" />
                            ) : (
                                <>
                                    <span className="text-3xl">🖼️</span>
                                    <p className="text-sm mt-2">Choose file to upload</p>
                                </>
                            )}
                            {errors.product_image && (
                                <p className="text-red-600 text-xs mt-2">{errors.product_image}</p>
                            )}
                        </label>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">Description:</label>
                        <textarea
                            placeholder="Add Description"
                            name="product_description"
                            value={data.product_description}
                            onChange={handleInput}
                            className="w-full h-[180px] border rounded-lg p-3 text-sm resize-none outline-red-600"
                        />
                        {errors.product_description && (
                            <p className="text-red-600 text-xs mt-1">{errors.product_description}</p>
                        )}
                    </div>

                    {/* Product Name */}
                    <div className="col-span-2">
                        <label className="text-sm font-semibold mb-2 block">Product Name:</label>
                        <input
                            placeholder="Enter Product Name"
                            name="product_name"
                            value={data.product_name}
                            onChange={handleInput}
                            className="w-full border rounded-full px-4 py-2 outline-red-600"
                        />
                        {errors.product_name && (
                            <p className="text-red-600 text-xs mt-1">{errors.product_name}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">Add Price:</label>
                        <input
                            type="number"
                            placeholder="Enter Price"
                            name="product_price"
                            value={data.product_price}
                            onChange={handleInput}
                            className="w-full border rounded-full px-4 py-2 outline-red-600"
                        />
                        {errors.product_price && (
                            <p className="text-red-600 text-xs mt-1">{errors.product_price}</p>
                        )}
                    </div>

                    {/* Variation */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">
                            Variation <span className="text-red-600">*</span>
                        </label>
                        <select
                            name="variant"
                            value={data.variant}
                            onChange={handleInput}
                            className="w-full border rounded-full px-4 py-2 outline-red-600"
                        >
                            <option value="">Select Variation</option>
                            <option>XS</option>
                            <option>S</option>
                            <option>M</option>
                            <option>L</option>
                            <option>XL</option>
                        </select>
                        {errors.variant && (
                            <p className="text-red-600 text-xs mt-1">{errors.variant}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="col-span-2 flex justify-end gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-red-800 hover:bg-red-900 text-white px-10 py-2 rounded-full font-semibold hover:cursor-pointer"
                        >
                            {processing ? "Adding..." : "Add"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-red-700 text-red-700 px-8 py-2 rounded-full font-semibold hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}