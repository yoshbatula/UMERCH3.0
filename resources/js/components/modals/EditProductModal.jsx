import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminEditProduct({ open, onClose, product, onSuccess }) {
    const [image, setImage] = useState(null);
    const [form, setForm] = useState({
        product_name: "",
        product_price: "",
        product_type: "",
        product_description: "",
    });

    useEffect(() => {
        if (product) {
            setForm({
                product_name: product.product_name,
                product_price: product.product_price,
                product_type: product.product_type,
                product_description: product.product_description,
            });
            setImage(product.product_image);
        }
    }, [product]);

    if (!open) return null;

    const handleSave = async () => {
        if (!form.product_name || !form.product_price || !form.product_type) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            await axios.patch(`/api/admin/products/${product.id}`, {
                ...form,
                product_image: image,
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Update failed", error);
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
                <div className="p-6 grid grid-cols-2 gap-6">

                    {/* Image */}
                    <div>
                        <div className="border-2 border-dashed border-red-400 rounded-lg h-[180px] flex items-center justify-center">
                            {image ? (
                                <img src={image} alt="preview" className="h-full object-contain" />
                            ) : (
                                <span className="text-red-600 text-sm">No image</span>
                            )}
                        </div>

                        <label className="mt-2 block text-center text-sm text-red-700 cursor-pointer">
                            Choose file to upload
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                    setImage(URL.createObjectURL(e.target.files[0]))
                                }
                            />
                        </label>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold">Description:</label>
                        <textarea
                            value={form.product_description}
                            onChange={(e) =>
                                setForm({ ...form, product_description: e.target.value })
                            }
                            className="mt-2 w-full h-[180px] border rounded-lg p-3 text-sm resize-none outline-red-600"
                        />
                    </div>

                    {/* Product Name */}
                    <div className="col-span-2">
                        <label className="text-sm font-semibold">Product Name:</label>
                        <input
                            value={form.product_name}
                            onChange={(e) =>
                                setForm({ ...form, product_name: e.target.value })
                            }
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-sm font-semibold">Price:</label>
                        <input
                            type="number"
                            value={form.product_price}
                            onChange={(e) =>
                                setForm({ ...form, product_price: e.target.value })
                            }
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                        />
                    </div>

                    {/* Variation */}
                    <div>
                        <label className="text-sm font-semibold">
                            Variation <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={form.product_type}
                            onChange={(e) =>
                                setForm({ ...form, product_type: e.target.value })
                            }
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
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 px-6 pb-6">
                    <button
                        onClick={handleSave}
                        className="bg-red-800 hover:bg-red-900 text-white px-10 py-2 rounded-full font-semibold"
                    >
                        Save Changes
                    </button>

                    <button
                        onClick={onClose}
                        className="border border-red-700 text-red-700 px-8 py-2 rounded-full font-semibold"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
