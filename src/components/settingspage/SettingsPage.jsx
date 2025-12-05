// src/components/SettingsPage.jsx
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    HomeIcon, UsersIcon, CubeIcon, ShoppingCartIcon, BellAlertIcon, 
    ShareIcon, CloudArrowDownIcon, PaintBrushIcon, ShieldCheckIcon, CreditCardIcon, 
    CodeBracketIcon
} from '@heroicons/react/24/outline';
import StoreInfoForm from './StoreInfoForm';

// --- 1. Settings Categories Definition ---
const settingsCategories = [
    { key: 'store-info', label: 'Store Information', icon: HomeIcon, component: StoreInfoForm },
    { key: 'users-roles', label: 'Users & Roles', icon: UsersIcon, component: null }, // Placeholder
    { key: 'inventory', label: 'Inventory Settings', icon: CubeIcon, component: null },
    { key: 'pos-sales', label: 'Sales & POS Settings', icon: ShoppingCartIcon, component: null },
    { key: 'notifications', label: 'Notifications', icon: BellAlertIcon, component: null },
    { key: 'integrations', label: 'Integrations', icon: ShareIcon, component: null },
    { key: 'data-management', label: 'Data Management', icon: CloudArrowDownIcon, component: null },
    { key: 'appearance', label: 'Appearance / Theme', icon: PaintBrushIcon, component: null },
    { key: 'security', label: 'Security & Privacy', icon: ShieldCheckIcon, component: null },
    { key: 'billing', label: 'Billing & Subscription', icon: CreditCardIcon, component: null },
    { key: 'developer', label: 'Developer Settings', icon: CodeBracketIcon, component: null }, // Optional
];

const SettingsPage = () => {
    const [activeCategory, setActiveCategory] = useState(settingsCategories[0].key);
    
    const ActiveComponent = settingsCategories.find(cat => cat.key === activeCategory)?.component || null;
    const activeLabel = settingsCategories.find(cat => cat.key === activeCategory)?.label || 'Settings';

    // Renders the component for the active category, or a placeholder if null
    const renderContent = () => {
        if (ActiveComponent) {
            return <ActiveComponent />;
        }
        return (
            <div className="p-8 h-full bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-500">
                <p className="text-center">
                    Configuration panel for **{activeLabel}** is under development.
                </p>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            
            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                ⚙️ Settings
            </h1>
            
            {/* Main Content Area (Responsive Layout) */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* --- 1. SIDEBAR / CATEGORIES (COL-1) --- */}
                <aside className="lg:w-1/4 lg:flex-none">
                    {/* Responsive Selector for Small Screens */}
                    <div className="lg:hidden mb-4">
                        <label htmlFor="settings-select" className="sr-only">Select Setting Category</label>
                        <select
                            id="settings-select"
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {settingsCategories.map((cat) => (
                                <option key={cat.key} value={cat.key}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Desktop Sidebar */}
                    <nav className="hidden lg:block bg-white p-3 rounded-xl shadow-lg border border-gray-100">
                        <ul className="space-y-1">
                            {settingsCategories.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = cat.key === activeCategory;
                                return (
                                    <li key={cat.key}>
                                        <button
                                            onClick={() => setActiveCategory(cat.key)}
                                            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition duration-150 ${
                                                isActive
                                                    ? 'bg-indigo-500 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                                            {cat.label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </aside>

                {/* --- 2. CONTENT AREA (COL-2) --- */}
                <main className="lg:w-3/4 lg:grow">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;