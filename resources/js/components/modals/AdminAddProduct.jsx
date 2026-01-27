import React, { useState } from "react";

export default function AdminAddProduct({ open, onClose, onAddProduct }) {
    const [image, setImage] = useState(null);
    const [form, setForm] = useState({
        name: "",
        price: "",
        variation: "",
        description: "",
    });

    if (!open) return null;

    const handleAdd = () => {
        if (!form.name || !form.price || !form.variation) {
            alert("Please fill in all required fields");
            return;
        }

        onAddProduct({ ...form, image });
        onClose();

        // Reset form after adding
        setForm({
            name: "",
            price: "",
            variation: "",
            description: "",
        });
        setImage(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-[700px] rounded-xl overflow-hidden shadow-2xl animate-fadeIn">

                {/* Header */}
                <div className="bg-red-800 px-6 py-4 text-white font-bold text-lg">
                    ADD PRODUCT
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-2 gap-6">

                    {/* Upload */}
                    <label className="border-2 border-dashed border-red-400 rounded-lg h-[180px]
                                      flex flex-col items-center justify-center cursor-pointer text-red-600">
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                                setImage(URL.createObjectURL(e.target.files[0]))
                            }
                        />

                        {image ? (
                            <img src={image} alt="preview" className="h-full object-contain" />
                        ) : (
                            <>
                                <span className="text-3xl">🖼️</span>
                                <p className="text-sm mt-2">Choose file to upload</p>
                            </>
                        )}
                    </label>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold">Description:</label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="mt-2 w-full h-[180px] border rounded-lg p-3 text-sm resize-none outline-red-600"
                            placeholder="Add Description"
                        />
                    </div>

                    {/* Product Name */}
                    <div className="col-span-2">
                        <label className="text-sm font-semibold">Product Name:</label>
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                            placeholder="Enter Product Name"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-sm font-semibold">Add Price:</label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={(e) =>
                                setForm({ ...form, price: e.target.value })
                            }
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                            placeholder="Enter Price"
                        />
                    </div>

                    {/* Variation */}
                    <div>
                        <label className="text-sm font-semibold">
                            Variation <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={form.variation}
                            onChange={(e) =>
                                setForm({ ...form, variation: e.target.value })
                            }
                            className="mt-2 w-full border rounded-full px-4 py-2 text-sm outline-red-600"
                        >
                            <option value="">Select Variation</option>
                            <option>Sizes XS–XXL</option>
                            <option>Colors</option>
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
