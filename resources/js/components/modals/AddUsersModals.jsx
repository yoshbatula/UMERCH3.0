import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function AddUsersModals({ isOpen, onClose, onUserAdded }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        userId: '',
        password: ''
    });

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            const timer = setTimeout(() => setVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !visible) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        // Clear the specific field error as the user corrects it
        clearErrors(name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/add-user', {
            onSuccess: (page) => {

                if (onUserAdded) {

                    const newUser = page?.props?.newUser || null;
                    onUserAdded(newUser);
                }
                reset();
                onClose();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            }
        });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6  bg-[#9C0306]">
                    <h2 className="text-xl font-semibold text-white ">Add New User</h2>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9C0306] focus:border-[#9C0306]"
                                placeholder="Enter full name"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            {errors["name"] && errors["name"].toString().toLowerCase().includes("unique") && (
                                <p className="text-red-500 text-sm mt-1">This name is already taken.</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9C0306] focus:border-[#9C0306]"
                                placeholder="Enter email address"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            {errors["email"] && errors["email"].toString().toLowerCase().includes("unique") && (
                                <p className="text-red-500 text-sm mt-1">This email is already taken.</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                                User ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={data.userId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9C0306] focus:border-[#9C0306]"
                                placeholder="Enter user ID"
                                required
                            />
                            {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
                            {errors["userId"] && errors["userId"].toString().toLowerCase().includes("unique") && (
                                <p className="text-red-500 text-sm mt-1">This user ID is already taken.</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9C0306] focus:border-[#9C0306]"
                                placeholder="Enter password"
                                required
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 hover:cursor-pointer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-[#9C0306] bg-white border border-[#9C0306] rounded-lg hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#9C0306] border border-transparent rounded-lg hover:cursor-pointer"
                        >
                            {processing ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}