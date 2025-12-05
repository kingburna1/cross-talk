'use client';
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { MdTrendingUp } from "react-icons/md";
import { HiClipboardList } from "react-icons/hi";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaCog,
  FaBell,
  FaEnvelope,
  FaChartBar,
  FaShoppingCart,
  FaSignOutAlt,
  FaTruck,
  FaUsers,
  FaCashRegister,
  FaMoneyBillWave,
  
} from "react-icons/fa";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true); // start collapsed (icons only)

  const menuItems = [
    { icon: <FaHome />, label: "Home", href: "/dashboard/" },
    { icon: <HiClipboardList />, label: "Inventory Management", href: "/dashboard/salesinventorymanagement" },
    { icon: <FaUser />, label: "Profile",href: "/dashboard/profile" },
    { icon: <FaBell />, label: "Notifications", href: "/dashboard/notifications" },
    { icon: <FaEnvelope />, label: "Messages",href: "/dashboard/messages" },
    { icon: <FaTruck  />, label: "Products", href: "/dashboard/products" },
    { icon: <FaCashRegister  />, label: "Products Records", href: "/dashboard/productrecords" },
    { icon: <MdTrendingUp  />, label: "Total Stocks Value", href: "/dashboard/total-stocks-value" },
     { icon: <FaMoneyBillWave  />, label: "Total Stocks Profit", href: "/dashboard/total-stocks-profit" },
     { icon: <FaUsers  />, label: "Suppliers",  href: "/dashboard/sellers" },
    { icon: <FaChartBar />, label: "Analytics",  href: "/dashboard/analytics" },
    { icon: <FaShoppingCart />, label: "Orders",  href: "/dashboard/orders" },
     { icon: <FaUsers />, label: "Employees", href: "/dashboard/employees" },
    { icon: <FaCog />, label: "Settings", href: "/dashboard/settings" },
    { icon: <FaSignOutAlt />, label: "Logout", href: "/dashboard/home" },
    
  ];

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`h-screen   bg-white shadow-lg z-50 flex flex-col transition-all duration-300 
        ${collapsed ? "w-20" : "w-[220px]"}`}
    >
      {/* Header */}
      <div className="flex items-center h-[60px] bg-green-500 text-white px-4">
        <span className="font-bold truncate">
          {collapsed ? "WC" : "welcome"}
        </span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-4 h-screen overflow-y-auto flex flex-col scrollbar-hide ">
        {menuItems.map((item, index) => (
          <Link
            href={item.href} 
            key={index}
            className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 cursor-pointer transition"
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer Button */}
      <div className="p-4">
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center">
          {collapsed ? <FaCog /> : "Settings"}
        </button>
      </div>
    </motion.div>
  );
}
