import React, { useState } from "react";
import axios from "axios";

export default function AddProductModal({ open, onClose, onSuccess }) {
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
        product_name: "",
        product_price: "",
        variant: "",
        product_description: "",
    });

    if (!open) return null;

    const handleAdd = async () => {
        if (!form.product_name || !form.product_price || !form.variant) {
            alert("Please fill all required fields");
            return;
        }

        const data = new FormData();
        data.append("product_name", form.product_name);
        data.append("product_price", form.product_price);
        data.append("variant", form.variant);
        data.append("product_description", form.product_description);
        data.append("product_stock", 0);


        if (imageFile) {
            data.append("product_image", imageFile);
        }

        try {
            await axios.post("/admin/products", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onSuccess && onSuccess();
            onClose();

            // reset
            setForm({
                product_name: "",
                product_price: "",
                variant: "",
                product_description: "",
            });
            setImageFile(null);
            setPreview(null);
        } catch (error) {
            console.log("FULL ERROR:", error);
            console.log("RESPONSE DATA:", error.response?.data);
            console.log("STATUS:", error.response?.status);
            alert(JSON.stringify(error.response?.data, null, 2));
        }
    };

    


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-[720px] shadow-2xl rounded-xl overflow-hidden">

                {/* Header */}
                <div className="bg-red-800 px-6 py-4 text-white font-bold text-lg">
                    ADD PRODUCT
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-2 gap-6">

                    {/* Image Upload */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">
                            Product Image
                        </label>
                        <label className="border-2 border-dashed border-red-400 rounded-lg h-[180px]
                            flex flex-col items-center justify-center cursor-pointer text-red-600">
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    setImageFile(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                            {preview ? (
                                <img src={preview} alt="preview" className="h-full object-contain" />
                            ) : (
                                <>
                                    <span className="text-3xl">🖼️</span>
                                    <p className="text-sm mt-2">Choose file to upload</p>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">
                            Description:
                        </label>
                        <textarea
                            placeholder="Add Description"
                            value={form.product_description}
                            onChange={(e) =>
                                setForm({ ...form, product_description: e.target.value })
                            }
                            className="w-full h-[180px] border rounded-lg p-3 text-sm resize-none outline-red-600"
                        />
                    </div>

                    {/* Product Name */}
                    <div className="col-span-2">
                        <label className="text-sm font-semibold mb-2 block">
                            Product Name:
                        </label>
                        <input
                            placeholder="Enter Product Name"
                            value={form.product_name}
                            onChange={(e) =>
                                setForm({ ...form, product_name: e.target.value })
                            }
                            className="w-full border rounded-full px-4 py-2 outline-red-600"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">
                            Add Price:
                        </label>
                        <input
                            type="number"
                            placeholder="Enter Price"
                            value={form.product_price}
                            onChange={(e) =>
                                setForm({ ...form, product_price: e.target.value })
                            }
                            className="w-full border rounded-full px-4 py-2 outline-red-600"
                        />
                    </div>

                    {/* Variation */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block">
                            Variation <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={form.variant}
                            onChange={(e) =>
                                setForm({ ...form, variant: e.target.value })
                            }
                            className="w-full border rounded-full px-4 py-2 outline-red-600"
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
                        onClick={handleAdd}
                        className="bg-red-800 hover:bg-red-900 text-white px-10 py-2 rounded-full font-semibold"
                    >
                        Add
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
