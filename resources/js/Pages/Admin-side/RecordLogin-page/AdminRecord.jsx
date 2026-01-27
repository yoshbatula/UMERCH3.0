import React, { useState } from "react";
import Sidebar from "../../../components/layouts/Sidebar";

const StatCard = ({ title, value, className = "bg-green-700", icon }) => (
  <div
    className={`w-[260px] h-[96px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${className}`}
  >
    <div>
      <div className="text-sm opacity-90">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>

    <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

export default function AdminRecord() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <main className="flex-1 px-10 py-10">
        {/* Header */}
        <h1 className="text-4xl font-extrabold tracking-[0.25em]">
          RECORD LOGS
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back Admin, everything looks great.
        </p>

        {/* ✅ StatCard */}
        <div className="mt-7">
          <StatCard
            title="Total Login Users"
            value="0"
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
          <div className="flex items-center gap-3 flex-1 max-w-[520px] bg-white rounded-lg px-4 py-3 border border-gray-200">
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
            className="bg-red-800 hover:bg-red-900 text-white px-10 py-3 rounded-full text-sm font-semibold"
          >
            Add User
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl mt-6 shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6">
            <div className="grid grid-cols-12 text-sm font-bold text-red-700">
              <div className="col-span-1">ID</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">UserId</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Empty body space (no users yet) */}
          <div className="min-h-[520px]" />

          {/* Pagination */}
          <div className="border-t border-gray-200" />
          <div className="py-7 flex items-center justify-center gap-10 text-sm font-semibold">
            <button className="text-gray-900">Prev</button>
            <button className="text-red-700">1</button>
            <button className="text-gray-900">2</button>
            <button className="text-gray-900">3</button>
            <button className="text-gray-900">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}
