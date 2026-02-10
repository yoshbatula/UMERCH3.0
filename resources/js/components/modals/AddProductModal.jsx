import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

export default function AddProductModal({ open, isOpen, onClose, onSuccess }) {
    const [preview, setPreview] = useState(null);
    const [selectedVariantType, setSelectedVariantType] = useState("");
    const [existingProducts, setExistingProducts] = useState([]);
    const [priceError, setPriceError] = useState("");

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

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        product_name: "",
        product_price: "",
        product_description: "",
        product_image: null,
        variant_type: "",
    });



    const visible = typeof isOpen !== "undefined" ? isOpen : open;

    useEffect(() => {
        if (!visible) {
            setPreview(null);
            setSelectedVariantType("");
            setPriceError("");
        }
    }, [visible]);

    useEffect(() => {
        if (visible) {
            // Fetch existing products when modal opens
            axios.get("/admin/products").then(res => {
                setExistingProducts(res.data);
            }).catch(err => {
                console.error("Error fetching products:", err);
            });
        }
    }, [visible]);

    const handleVariantTypeChange = (typeId) => {
        if (selectedVariantType === typeId) {
            setSelectedVariantType("");
            setData("variant_type", "");
        } else {
            setSelectedVariantType(typeId);
            setData("variant_type", typeId);
        }
    };



    if (!visible) return null;

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
        setPreview(file ? URL.createObjectURL(file) : null);
        clearErrors("product_image");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate variant type is selected
        if (!selectedVariantType) {
            alert("Please select a variant type.");
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

        // Check if product with same name already exists
        const isDuplicate = existingProducts.some(
            (product) => 
                product.product_name === data.product_name
        );

        if (isDuplicate) {
            alert(`Product "${data.product_name}" already exists!`);
            return;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('product_name', data.product_name);
        formData.append('product_price', data.product_price);
        formData.append('product_description', data.product_description);
        formData.append('variant_type', selectedVariantType);
        formData.append('variant', selectedVariantType); // Use variant_type as the variant
        if (data.product_image) {
            formData.append('product_image', data.product_image);
        }

        axios.post("/admin/products", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            }
        }).then(() => {
            if (onSuccess) onSuccess();
            reset();
            setPreview(null);
            setSelectedVariantType("");
            setPriceError("");
            onClose && onClose();
        }).catch((error) => {
            console.error('Error adding product:', error.response?.data || error.message);
            alert('Failed to add product. Please try again.');
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
                    <div className="col-span-2">
                        <label className="text-sm font-semibold mb-2 block">Add Price:</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter Price"
                            name="product_price"
                            value={data.product_price}
                            onChange={handleInput}
                            className="w-full border rounded-full px-4 py-2 outline-red-600"
                        />
                        {errors.product_price && (
                            <p className="text-red-600 text-xs mt-1">{errors.product_price}</p>
                        )}
                        {priceError && (
                            <p className="text-red-600 text-xs mt-1">{priceError}</p>
                        )}
                    </div>

                    {/* Variant Type */}
                    <div className="col-span-2">
                        <label className="text-sm font-semibold mb-2 block">
                            Variant Type <span className="text-red-600">*</span>
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