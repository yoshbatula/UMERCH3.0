import React, { useMemo, useState } from "react";
import Sidebar from "../../../components/layouts/Sidebar";


const StatCard = ({ title, value, className, icon }) => (
    <div
        className={`w-[260px] h-[96px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${className}`}
    >
        <div>
            <div className="text-sm opacity-90">{title}</div>
            <div className="text-2xl font-bold leading-tight mt-1">{value}</div>
        </div>

        <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
            {icon}
        </div>
    </div>
);

const Icon = ({ children }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {children}
    </svg>
);

export default function AdminTransaction() {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All statuses");

    const transactions = []; 

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return transactions.filter((t) => {
            const matchQ =
                !q ||
                t?.name?.toLowerCase().includes(q) ||
                t?.orderId?.toLowerCase().includes(q);
            const matchS = status === "All statuses" || t?.status === status;
            return matchQ && matchS;
        });
    }, [transactions, query, status]);

    const stats = [
        {
            title: "Completed",
            value: "0",
            className: "bg-green-700",
            icon: (
                <Icon>
                    <path
                        d="M20 6L9 17l-5-5"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Icon>
            ),
        },
        {
            title: "Pending",
            value: "0",
            className: "bg-orange-500",
            icon: (
                <Icon>
                    <path
                        d="M12 6v6l4 2"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="white"
                        strokeWidth="2.2"
                    />
                </Icon>
            ),
        },
        {
            title: "Delivering",
            value: "0",
            className: "bg-red-600",
            icon: (
                <Icon>
                    <path
                        d="M3 7h11v10H3V7z"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M14 10h4l3 3v4h-7v-7z"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                        fill="white"
                    />
                </Icon>
            ),
        },
        {
            title: "Cancelled",
            value: "0",
            className: "bg-red-900",
            icon: (
                <Icon>
                    <path
                        d="M12 22a10 10 0 100-20 10 10 0 000 20z"
                        stroke="white"
                        strokeWidth="2.2"
                    />
                    <path
                        d="M15 9l-6 6M9 9l6 6"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </Icon>
            ),
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#f5f5f5]">
            <Sidebar />

            <main className="flex-1 px-10 py-10">
                <h1 className="text-4xl font-extrabold tracking-wide">
                    TRANSACTIONS
                </h1>
                <p className="text-gray-500 mt-2">
                    Welcome back Admin, everything looks great.
                </p>

                {/* STAT CARDS */}
                <div className="flex flex-wrap gap-6 mt-8">
                    {stats.map((s) => (
                        <StatCard key={s.title} {...s} />
                    ))}
                </div>

                <h2 className="text-xl font-bold mt-10">Transactions</h2>

                {/* SEARCH + STATUS */}
                <div className="mt-4 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3 flex-1 max-w-[520px] bg-white border border-gray-200 rounded-lg px-4 py-3">
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

                    <div className="flex items-center gap-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border border-gray-300 rounded-lg px-5 py-3 text-sm bg-white min-w-[170px]"
                        >
                            {["All statuses", "Pending", "Completed", "Delivering", "Cancelled"].map(
                                (s) => (
                                    <option key={s}>{s}</option>
                                )
                            )}
                        </select>

                        <button className="border border-gray-300 rounded-lg w-12 h-12 bg-white flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M3 5h18l-7 8v6l-4-2v-4L3 5z"
                                    stroke="#111827"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl mt-6 shadow-sm border border-gray-200 overflow-hidden">
                    <div className="min-h-[460px]" />
                    <div className="border-t border-gray-200" />
                    <div className="py-7 flex items-center justify-center gap-10 text-sm font-semibold">
                        {["Prev", "1", "2", "3", "Next"].map((p) => (
                            <button
                                key={p}
                                className={p === "1" ? "text-red-700" : "text-gray-900"}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500 mt-10">
                    Copyright © 2025 Merchandise | Powered by UMerch
                </div>
            </main>
        </div>
    );
}
