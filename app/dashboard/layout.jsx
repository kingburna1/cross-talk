"use client";
import Header from "../../src/components/dashboard/Header";
import Sidebar from "../../src/components/dashboard/Sidebar";
import { useState } from "react";
import { motion } from "framer-motion";

export default function RootLayout({ children }) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <motion.aside
        animate={{ width: collapsed ? 80 : 220 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-r hidden md:block border-gray-200 overflow-hidden h-screen sticky top-0 "
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <Sidebar collapsed={collapsed} />
      </motion.aside>

      <div className="flex-1 flex flex-col  w-full ">
        <header>
          <Header />
        </header>

        <main className="p-2">{children}</main>
      </div>
    </div>
  );
}
