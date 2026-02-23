import { useState, useEffect } from "react";

export const useUserLogs = () => {
    const [query, setQuery] = useState("");
    const [isAddUsersOpen, setAddUsersOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState("");
    const [showingToast, setShowingToast] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionModalOpen, setActionModalOpen] = useState(null);
    const itemsPerPage = 10;

    const fetchUsers = () => {
        fetch("/api/admin/users")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];
                setUsers(list);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Auto-refresh users every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUsers();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const showToast = (message) => {
        setToast(message);
        setShowingToast(true);
        setTimeout(() => setShowingToast(false), 5000);
    };

    const openAddUsersModal = () => setAddUsersOpen(true);

    const closeAddUsersModal = () => setAddUsersOpen(false);

    const handleUserAdded = (user) => {
        const name = user && (user.user_fullname || user.name) ? (user.user_fullname || user.name) : null;
        showToast(name ? `User ${name} added successfully!` : 'User added successfully!');
        setAddUsersOpen(false);
        fetchUsers();
    };

    const openUpdateModal = (user) => {
        setSelectedUser(user);
        setEditOpen(true);
    };

    const closeEditModal = () => {
        setEditOpen(false);
        setSelectedUser(null);
    };

    const handleUpdateSuccess = () => {
        showToast('User updated successfully!');
        fetchUsers();
        closeEditModal();
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteSuccess = () => {
        showToast('User deleted successfully!');
        fetchUsers();
        closeDeleteModal();
    };

    const handleReactivate = (user) => {
        const userId = user.id || user.um_id || user.userId || user.user_id;

        fetch(`/admin/reactivate-user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.error || 'Failed to reactivate user');
                    }).catch(() => {
                        throw new Error('Failed to reactivate user');
                    });
                }
                return res.json();
            })
            .then((data) => {
                showToast('User reactivated successfully!');
                fetchUsers();
            })
            .catch((error) => {
                console.error('Error reactivating user:', error);
                showToast(error.message || 'Failed to reactivate user. Please try again.');
            });
    };

    const handleDeactivate = (user) => {
        const userId = user.id || user.um_id || user.userId || user.user_id;

        fetch(`/admin/deactivate-user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.error || 'Failed to deactivate user');
                    }).catch(() => {
                        throw new Error('Failed to deactivate user');
                    });
                }
                return res.json();
            })
            .then((data) => {
                showToast('User deactivated successfully!');
                fetchUsers();
            })
            .catch((error) => {
                console.error('Error deactivating user:', error);
                showToast(error.message || 'Failed to deactivate user. Please try again.');
            });
    };

    const filterUsers = (users, query) => {
        return users.filter((userRaw) => {
            // Filter out Admin users by role, um_id, or email
            if (userRaw.role === 'Admin') return false;
            if (userRaw.um_id === 1 || userRaw.um_id === '1') return false;
            if (userRaw.email === 'admin@umerch.com') return false;
            if (!query.trim()) return true;
            const searchLower = query.toLowerCase();
            const email = (userRaw.email || userRaw.user_email || '').toLowerCase();
            const userId = (userRaw.um_id || userRaw.userId || userRaw.user_id || '').toString().toLowerCase();
            return email.includes(searchLower) || userId.includes(searchLower);
        });
    };

    const getPaginatedUsers = (users, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return users.slice(startIndex, startIndex + itemsPerPage);
    };

    const getTotalPages = (users, itemsPerPage) => {
        return Math.ceil(users.length / itemsPerPage);
    };

    const goToPage = (page, totalPages) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const mapUser = (userRaw) => {
        return {
            id: userRaw.id || userRaw.um_id || userRaw.userId || userRaw.user_id || userRaw.ID || '',
            user_fullname: userRaw.user_fullname || userRaw.name || userRaw.fullname || '',
            um_id: userRaw.um_id || userRaw.userId || userRaw.user_id || '',
            email: userRaw.email || userRaw.user_email || '',
            status: userRaw.status || userRaw.user_status || 'active',
        };
    };

    return {
        // State
        query, setQuery, isAddUsersOpen, users, loading, toast, showingToast, isEditOpen, selectedUser, isDeleteOpen, userToDelete,
        currentPage, setCurrentPage, actionModalOpen, setActionModalOpen, itemsPerPage,

        // Functions
        fetchUsers, showToast, openAddUsersModal, closeAddUsersModal, handleUserAdded, openUpdateModal, closeEditModal,
        handleUpdateSuccess, openDeleteModal, closeDeleteModal, handleDeleteSuccess, handleReactivate, handleDeactivate, filterUsers,
        getPaginatedUsers, getTotalPages, goToPage, mapUser,
    };
};
