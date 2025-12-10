'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Icons imported for all sections
import {
    WalletIcon, ShoppingCartIcon, UsersIcon, CubeIcon, TagIcon, ClockIcon, BellAlertIcon,
    ArrowTrendingUpIcon, ChartPieIcon, CheckBadgeIcon, ArrowTrendingDownIcon, XCircleIcon
} from '@heroicons/react/24/outline';
import SalesLineChart from './SalesLineChart';
import TopProductsBarChart from './TopProductsBarChart';
import CategoryPieChart from './CategoryPieChart';
import ProfitExpenseBarChart from './ProfitExpenseBarChart';
import CustomerRetentionPieChart from './CustomerRetentionPieChart';

// Format currency in XAF
const formatCurrency = (amount) => {
    return amount.toLocaleString('fr-CM', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }) + ' FCFA';
};


// --- HELPER COMPONENTS (Adjusted for responsiveness) ---
const SectionTitle = ({ icon: Icon, title, className = '' }) => (
    // Reduced mb-3 to mb-2, reduced icon size
    <h3 className={`text-base sm:text-lg font-semibold text-gray-800 mb-2 flex items-center ${className}`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600 flex-none" />
        {title}
    </h3>
);

const MetricCard = ({ title, value, icon: Icon, colorClass = 'text-indigo-600', bgColor = 'bg-indigo-50' }) => (
    // Reduced padding and text size on the smallest screens
    <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className={`text-lg sm:text-2xl font-bold mt-0.5 ${colorClass} truncate`}>{value}</p>
        </div>
        <div className={`p-2 rounded-full ${bgColor} flex-none hidden sm:block`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
    </div>
);

// CHARTPLACEHOLDER COMPONENT REMOVED

const InventoryStatusList = () => { 
    const lowStockItems = [
        { name: 'Smartwatch Pro X900', qty: 5 },
        { name: 'Ergonomic Mouse', qty: 8 },
        { name: 'Mechanical Keyboard', qty: 12 },
    ];
    return (
        <div className="space-y-2"> {/* Reduced space-y-3 to space-y-2 */}
            {lowStockItems.map((item, index) => (
                // Reduced padding and text size
                <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded-md border border-red-200">
                    <span className="text-xs font-medium text-red-700 truncate">{item.name}</span>
                    <span className="text-base font-bold text-red-600 flex-none ml-2">{item.qty}</span>
                </div>
            ))}
            <button className="w-full text-center text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-1">
                View All Low Stock
            </button>
        </div>
    );
};

const AlertsPanel = () => { 
    const criticalAlerts = [
        { id: 1, type: 'Error', message: 'API response timeout on checkout.', time: '2 mins ago' },
        { id: 2, type: 'Warning', message: 'High return rate for Item K-12.', time: '1 hour ago' },
    ];
    return (
        <div className="space-y-2"> {/* Reduced space-y-3 to space-y-2 */}
            {criticalAlerts.map((alert) => (
                <div 
                    key={alert.id} 
                    // Reduced padding
                    className={`flex items-start p-2 rounded-md border ${alert.type === 'Error' ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}
                >
                    {alert.type === 'Error' ? (
                        <XCircleIcon className="w-4 h-4 mt-0.5 mr-2 text-red-600 flex-none" /> // Smaller icon
                    ) : (
                        <BellAlertIcon className="w-4 h-4 mt-0.5 mr-2 text-yellow-600 flex-none" /> // Smaller icon
                    )}
                    <div className="grow min-w-0">
                        <p className={`text-xs font-semibold ${alert.type === 'Error' ? 'text-red-800' : 'text-yellow-800'} truncate`}>
                            {alert.type}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-0.5 truncate">{alert.message}</p> {/* Smallest text size */}
                    </div>
                    <span className="text-[10px] text-gray-500 flex-none ml-2 whitespace-nowrap">{alert.time}</span> {/* Smallest text size */}
                </div>
            ))}
            <button className="w-full text-center text-xs font-medium text-indigo-600 hover:text-indigo-800 mt-1">
                View All Logs
            </button>
        </div>
    );
};
// --- END HELPER COMPONENTS ---

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const AnalyticsDashboard = () => {
    const [salesStats, setSalesStats] = useState({
        totalSales: 0,
        todayTotal: 0,
        monthlyRevenue: 0,
        avgBasketValue: 0,
        totalTransactions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalesStats = async () => {
            try {
                const response = await fetch('/api/sales/stats', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setSalesStats(data);
                }
            } catch (error) {
                console.error('Error fetching sales stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesStats();
        
        // Refresh stats every 30 seconds
        const interval = setInterval(fetchSalesStats, 30000);
        return () => clearInterval(interval);
    }, []);
    
    const salesMetrics = [
        { title: "Total Sales (YTD)", value: loading ? "..." : formatCurrency(salesStats.totalSales), icon: WalletIcon },
        { title: "Today's Sales", value: loading ? "..." : formatCurrency(salesStats.todayTotal), icon: ShoppingCartIcon, colorClass: "text-green-600", bgColor: "bg-green-50" },
        { title: "Monthly Revenue", value: loading ? "..." : formatCurrency(salesStats.monthlyRevenue), icon: ArrowTrendingUpIcon },
        { title: "Avg. Basket Value", value: loading ? "..." : formatCurrency(salesStats.avgBasketValue), icon: ChartPieIcon },
        { title: "Total Transactions", value: loading ? "..." : salesStats.totalTransactions.toLocaleString(), icon: CheckBadgeIcon },
    ];
    
    const operationalMetrics = [
        { title: "Employees Online", value: "12", icon: UsersIcon, colorClass: "text-blue-600", bgColor: "bg-blue-50" },
        { title: "Orders In Process", value: "45", icon: ClockIcon, colorClass: "text-yellow-600", bgColor: "bg-yellow-50" },
        { title: "Refunds Processed", value: "3", icon: ArrowTrendingDownIcon, colorClass: "text-red-600", bgColor: "bg-red-50" },
    ];
    
    return (
        <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4">Sales & Inventory Analytics</h1>

            {/* Reduced main grid gap */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"> 

                {/* --- 1. SALES OVERVIEW --- */}
                <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 bg-white p-3 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={WalletIcon} title="Sales Overview (Key Metrics)" className="mb-2" />
                    {/* Aggressive grid and gap reduction for tiny screens: default 2 cols, then 3, then 5 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {salesMetrics.map((metric, index) => (<MetricCard key={index} {...metric} />))}
                    </div>
                </motion.div>

                {/* --- 2. SALES CHART (Line Chart) --- */}
                <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={ArrowTrendingUpIcon} title="Real-Time Sales Trends" />
                    <SalesLineChart /> 
                    {/* Placeholder removed */}
                </motion.div>

                {/* --- 3. TOP-SELLING PRODUCTS (Bar Chart) --- */}
                <motion.div variants={itemVariants} className="lg:col-span-1 bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={TagIcon} title="Top-Selling Products (Revenue)" />
                    <TopProductsBarChart /> 
                    {/* Placeholder removed */}
                </motion.div>
                
                {/* --- 4. INVENTORY STATUS (List) --- */}
                <motion.div variants={itemVariants} className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={CubeIcon} title="Inventory Status & Reorder Alerts" />
                    <InventoryStatusList /> 
                </motion.div>

                {/* --- 5. CATEGORY PERFORMANCE (Pie Chart) --- */}
                <motion.div variants={itemVariants} className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={ChartPieIcon} title="Category Performance" />
                    <CategoryPieChart /> 
                    {/* Placeholder removed */}
                </motion.div>
                
                {/* --- 6. PROFIT & EXPENSE OVERVIEW (Bar Chart) --- */}
                <motion.div variants={itemVariants} className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={WalletIcon} title="Profit & Expense Overview" />
                    <ProfitExpenseBarChart />
                </motion.div>

                {/* --- 7. CUSTOMER INSIGHTS (Pie Chart) --- */}
                <motion.div variants={itemVariants} className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={UsersIcon} title="Customer Insights" />
                    <CustomerRetentionPieChart />
                </motion.div>

                {/* --- 8. STORE OPERATING METRICS (Metric Cards) --- */}
                <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1 bg-white p-3 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={ClockIcon} title="Store Operating Metrics" />
                    <div className="flex flex-wrap justify-between gap-x-2 gap-y-3">
                        {operationalMetrics.map((metric, index) => (
                            <div className="w-[48%] xs:w-auto grow" key={index}>
                                <MetricCard {...metric} />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* --- 9. ALERTS & NOTIFICATIONS PANEL (List) --- */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-3 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <SectionTitle icon={BellAlertIcon} title="Alerts & System Warnings" />
                    <AlertsPanel /> 
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;