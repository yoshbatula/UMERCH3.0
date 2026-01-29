import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import AddUsersModal from "../../../components/modals/AddUsersModals";
import EditUsersModals from "../../../components/modals/EditUsersModals";
import DeleteUsersModals from "../../../components/modals/DeleteUsersModals";

const StatCard = ({ title, value, className = "bg-green-700", icon }) => (
  <div
    className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${className}`}
  >
    <div>
      <div className="text-lg opacity-90">{title}</div>
      <div className="text-4xl font-bold mt-1">{value}</div>
    </div>
    <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
      {icon}
    </div>
  </div>
);


function AdminRecord() {
  const [query, setQuery] = useState("");
  const [isAddUsersOpen, setAddUsersOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const openAddUsersModal = () => setAddUsersOpen(true);
  const closeAddUsersModal = () => setAddUsersOpen(false);
  const handleUserAdded = (user) => {
    const name = user && (user.user_fullname || user.name) ? (user.user_fullname || user.name) : null;
    setSuccess(name ? `User ${name} added successfully!` : 'User added successfully!');
    setTimeout(() => setSuccess(""), 5000);
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
    setSuccess('User updated successfully!');
    setTimeout(() => setSuccess(""), 5000);
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
    setSuccess('User deleted successfully!');
    setTimeout(() => setSuccess(""), 5000);
    fetchUsers();
    closeDeleteModal();
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <div className="h-screen sticky top-0">
        <Sidebar />
      </div>
      <main className="flex-1 px-10 py-10">
        {/* Header */}
        <h1 className="text-4xl font-extrabold tracking-[0.25em]">RECORD LOGS</h1>
        <p className="text-gray-500 mt-2">Welcome back Admin, everything looks great.</p>
        {/* Success Message */}
        {/* ✅ StatCard */}
        <div className="mt-7">
          <StatCard
            title="Total Login Users"
            value={users.length}
            className="bg-green-700"
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                  fill="white"
                />
                <path
                  d="M4 20a8 8 0 0116 0"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
        </div>

        {/* Users */}
        <h2 className="text-2xl font-bold mt-10">Users</h2>

        {/* Search + Add User */}
        <div className="mt-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 flex-1 max-w-130 bg-white rounded-lg px-4 py-3 border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21l-4.35-4.35"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M11 19a8 8 0 100-16 8 8 0 000 16z"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
            </svg>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions"
              className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <button
            type="button"
            className="bg-red-800 hover:bg-red-900 text-white px-10 py-3 rounded-full text-sm font-semibold hover:cursor-pointer"
            onClick={openAddUsersModal}
          >
            Add User
          </button>
        </div>

        {success && (
          <div className="mt-3 mb-4 px-4 py-3 rounded bg-green-100 text-green-800 font-semibold shadow">
            {success}
          </div>
        )}
        {/* Table */}
        <div className="bg-white rounded-xl mt-6 shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6">
            <div className="grid grid-cols-12 text-sm font-bold text-red-700 text-center">
              <div className="col-span-1">ID</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">UserId</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-1 text-center">Action</div>
            </div>
          </div>
          <div className="border-t border-gray-200" />
          {/* Users List */}
          {users.length > 0 ? (
            users.map((userRaw) => {
              // Map possible backend keys to expected keys
              const user = {
                id: userRaw.id || userRaw.um_id || userRaw.userId || userRaw.user_id || userRaw.ID || '',
                user_fullname: userRaw.user_fullname || userRaw.name || userRaw.fullname || '',
                um_id: userRaw.um_id || userRaw.userId || userRaw.user_id || '',
                email: userRaw.email || userRaw.user_email || '',
              };
              return (
                <div key={user.id} className="grid grid-cols-12 items-center text-sm text-gray-900 px-8 py-2 border-b border-gray-200 hover:bg-gray-50 text-center">
                  <div className="col-span-1">{user.id}</div>
                  <div className="col-span-3">{user.user_fullname}</div>
                  <div className="col-span-3">{user.um_id}</div>
                  <div className="col-span-4">{user.email}</div>
                  <div className="col-span-1 flex justify-center">
                    <div className="flex flex-row gap-1">
                      <button
                        onClick={() => openUpdateModal(userRaw)}
                        className="bg-[#9C0306] text-white text-[13px] font-semibold px-3 py-1 rounded-[20px] hover:cursor-pointer"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => openDeleteModal(userRaw)}
                        className="bg-white text-[#9C0306] text-[13px] font-semibold border border-[#9C0306] px-3 py-1 rounded-[20px] hover:cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-8 py-6 text-center text-gray-500">No users found</div>
          )}
          {/* Pagination (static for now) */}
          <div className="border-t border-gray-200" />
          <div className="py-7 flex items-center justify-center gap-10 text-sm font-semibold">
            <button className="text-gray-900">Prev</button>
            <button className="text-red-700">1</button>
            <button className="text-gray-900">2</button>
            <button className="text-gray-900">3</button>
            <button className="text-gray-900">Next</button>
          </div>
        </div>
        {/* Modals */}
        <AddUsersModal isOpen={isAddUsersOpen} onClose={closeAddUsersModal} onUserAdded={handleUserAdded} />
        <EditUsersModals
          isOpen={isEditOpen}
          onClose={closeEditModal}
          user={selectedUser}
          onSuccess={handleUpdateSuccess}
        />
        <DeleteUsersModals
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          user={userToDelete}
          onDeleted={handleDeleteSuccess}
        />
        <AdminFooter />
      </main>
    </div>
  );
}

export default AdminRecord;

