import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import VerticalEllipsis from "@images/VerticalEllipsis.svg";

const ProductActionModal = ({ product, onEdit, onArchive, onRestore, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom - 30, // Position below button with 8px gap
                left: rect.right - 150 // Align right edge with button (128px is modal width)
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <img src={VerticalEllipsis} alt="Actions" className="w-5 h-5" />
            </button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 "
                        onClick={() => setIsOpen(false)}
                    />
                    <div 
                        className="fixed w-32 bg-white rounded-lg shadow-lg border border-gray-200 p-3 flex flex-col gap-2"
                        style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                    >
                        <button
                            onClick={() => {
                                onEdit();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2 text-center text-sm font-medium text-white bg-[#9C0306] hover:bg-[#7d0205] rounded-full transition-colors"
                        >
                            Edit
                        </button>

                        {product.status === 'active' ? (
                            <button
                                onClick={() => {
                                    onArchive();
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-center text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-full transition-colors"
                            >
                                Deactivate
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onRestore();
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-center text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-full transition-colors"
                            >
                                Restore
                            </button>
                        )}

                        <button
                            onClick={() => {
                                onDelete();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2 text-center text-sm font-medium text-red-600 bg-white border-2 border-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

export default ProductActionModal;
