import React, { useEffect, useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

import Logo from "@images/UMERCH-LOGO.svg";
import DASHBOARDLOGO from "@images/Dashboard-icon.svg";
import TRANSACLOGO from "@images/Transaction-icon.svg";
import INVENTORYLOGO from "@images/Inventory-icon.svg";
import RECORDLOGO from "@images/RecordLogs-icon.svg";
import LOGOUTLOGO from "@images/Logout-icon.svg";

// makes a white icon look red
const RED_FILTER =
  "[filter:brightness(0)_saturate(100%)_invert(12%)_sepia(95%)_saturate(7480%)_hue-rotate(1deg)_brightness(97%)_contrast(115%)]";

const NavItem = ({ href, icon, label, active = false, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "group w-full flex items-center gap-3 px-4 py-3 text-base font-medium transition-all duration-200",
        active
          ? "bg-white text-red-700"
          : "text-white hover:bg-white hover:text-red-700",
      ].join(" ")}
    >
      <img
        src={icon}
        alt={label}
        className={[
          "h-6 w-6 transition-all duration-200",
          active
            ? `filter ${RED_FILTER}` // active = red icon
            : `group-hover:filter group-hover:${RED_FILTER}`, // hover = red icon
        ].join(" ")}
      />
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const { url } = usePage();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const inventoryRef = useRef(null);

  const isActive = (path) => {
    if (path === "/") return url === "/";
    return url.startsWith(path);
  };

  useEffect(() => {
    if (isActive("/Inventory")) setInventoryOpen(true);
  }, [url]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (inventoryRef.current && !inventoryRef.current.contains(e.target)) {
        setInventoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-72 bg-red-700 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-5 py-5 flex flex-col items-center border-b border-red-800">
        <img src={Logo} alt="UMERCH logo" className="h-40 w-auto" />
        <div className="text-2xl font-bold text-white">ADMIN</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 space-y-1">
        <NavItem href="/" icon={DASHBOARDLOGO} label="Dashboard" active={isActive("/")} />
        <NavItem href="/Transaction" icon={TRANSACLOGO} label="Transaction" className={`${isActive("/Transaction") ? "bg-white text-[#9C0306]" : "text hover:bg-white hover:text-red-700 "}`} />

        {/* Inventory + submenu */}
        <div ref={inventoryRef}>
          <div className="flex items-center">
            <div className="flex-1">
              <NavItem
                href="/Inventory"
                icon={INVENTORYLOGO}
                label="Inventory"
                active={isActive("/Inventory") || inventoryOpen}
                onClick={() => setInventoryOpen(true)}
              />
            </div>

            <button
              type="button"
              onClick={() => setInventoryOpen((open) => !open)}
              className={[
                "px-4 transition-colors duration-200",
                inventoryOpen ? "text-red-700" : "text-white",
              ].join(" ")}
              aria-expanded={inventoryOpen}
              aria-label="Toggle inventory submenu"
            >
              <svg
                className={[
                  "h-4 w-4 transition-transform duration-200",
                  inventoryOpen ? "rotate-180" : "",
                ].join(" ")}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className={inventoryOpen ? "block" : "hidden"}>
            <Link href="/Inventory#add" className="block px-14 py-3 text-sm font-medium bg-white text-red-700">
              Add Product
            </Link>
            <Link
              href="/Inventory#stock-in"
              className="block px-14 py-2 text-sm text-white hover:bg-white hover:text-red-700 transition-all duration-200"
            >
              Stock In
            </Link>
            <Link
              href="/Inventory#stock-out"
              className="block px-14 py-2 text-sm text-white hover:bg-white hover:text-red-700 transition-all duration-200"
            >
              Stock Out
            </Link>
          </div>
        </div>

        <NavItem href="/RecordLogs" icon={RECORDLOGO} label="Record Logs" active={isActive("/RecordLogs")} />

        <div className="mt-6 border-t border-red-800 pt-4">
          <NavItem href="/logout" icon={LOGOUTLOGO} label="Logout" />
        </div>
      </nav>

      <div className="px-6 py-4 border-t border-red-800 text-sm font-bold text-white">
        Welcome back, Admin
      </div>
    </aside>
  );
}
