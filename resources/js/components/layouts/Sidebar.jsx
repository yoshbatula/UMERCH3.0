import React, { useEffect, useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

import Logo from "@images/UMERCH-LOGO.svg";
import DASHBOARDLOGO from "@images/Dashboard-icon.svg";
import TRANSACLOGO from "@images/Transaction-icon.svg";
import INVENTORYLOGO from "@images/Inventory-icon.svg";
import RECORDLOGO from "@images/RecordLogs-icon.svg";
import LOGOUTLOGO from "@images/Logout-icon.svg";

const RED_FILTER =
  "[filter:brightness(0)_saturate(100%)_invert(12%)_sepia(95%)_saturate(7480%)_hue-rotate(1deg)_brightness(97%)_contrast(115%)]";

const NavItem = ({ href, icon, label, active = false, onClick, asButton }) => {
  const classes = [
    "group w-full flex items-center gap-3 px-4 py-3 text-base font-medium transition-all duration-200",
    active
      ? "bg-white text-red-700"
      : "text-white",
  ].join(" ");

  const iconClass = [
    "h-6 w-6 transition-all duration-200",
    active
      ? `filter ${RED_FILTER}`
      : "",
  ].join(" ");

  if (asButton) {
    return (
      <button onClick={onClick} className={classes}>
        <img src={icon} alt={label} className={iconClass} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link href={href} className={classes}>
      <img src={icon} alt={label} className={iconClass} />
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const { url } = usePage();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const inventoryRef = useRef(null);

  const isActive = (path) => url.startsWith(path);

  useEffect(() => {
    if (isActive("/admin/inventory")) {
      setInventoryOpen(true);
    }
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
        <div className="text-2xl font-bold">ADMIN</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 space-y-1">
        <NavItem
          href="/admin"
          icon={DASHBOARDLOGO}
          label="Dashboard"
          active={url === "/admin"}
        />

        <NavItem
          href="/admin/transaction"
          icon={TRANSACLOGO}
          label="Transaction"
          active={isActive("/admin/transaction")}
        />

        {/* Inventory */}
        <div ref={inventoryRef}>
          <NavItem
            asButton
            icon={INVENTORYLOGO}
            label="Inventory"
            active={inventoryOpen}
            onClick={() => setInventoryOpen((o) => !o)}
          />

          {inventoryOpen && (
            <div>
              <Link
                href="/admin/inventory/add"
                className={`block px-14 py-3 text-sm font-medium transition-all duration-200 ${isActive("/admin/inventory/add")
                    ? "bg-white text-red-700"
                    : "text-white"
                  }`}
              >
                Add Product
              </Link>

              <Link
                href="/admin/inventory/stock-in"
                className={`block px-14 py-2 text-sm transition-all duration-200 ${isActive("/admin/inventory/stock-in")
                    ? "bg-white text-red-700"
                    : "text-white"
                  }`}
              >
                Stock In
              </Link>

              <Link
                href="/admin/inventory/stock-out"
                className={`block px-14 py-2 text-sm transition-all duration-200 ${isActive("/admin/inventory/stock-out")
                    ? "bg-white text-red-700"
                    : "text-white"
                  }`}
              >
                Stock Out
              </Link>
            </div>
          )}
        </div>

        <NavItem
          href="/admin/record-logs"
          icon={RECORDLOGO}
          label="Record Logs"
          active={isActive("/admin/record-logs")}
        />

        <div className="mt-6 border-t border-red-800 pt-4">
          <NavItem href="/admin/logout" icon={LOGOUTLOGO} label="Logout" />
        </div>
      </nav>
    </aside>
  );
}
