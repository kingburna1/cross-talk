'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, CalendarDaysIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const StockPerformanceMetricsCard = ({ metricsData }) => {
  // Define the time ranges and their corresponding data keys
  const timeRanges = [
    { label: 'Last 24 Hours', key: 'daily', icon: ClockIcon },
    { label: 'Last 7 Days', key: 'weekly', icon: CalendarDaysIcon },
    { label: 'Last 30 Days', key: 'monthly', icon: CalendarDaysIcon },
    { label: 'Current Year', key: 'yearly', icon: CalendarDaysIcon },
  ];

  // Placeholder for data validation/default values
  const safeMetrics = metricsData || {};

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full p-6 bg-white rounded-xl shadow-2xl border border-gray-100"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-indigo-600" />
        Total Stock Profit & Loss Tracking
      </h2>

      {/* --- Metrics Grid (Super Responsive) --- */}
      {/* Grid adapts from 1 column to 2 columns (md) and finally 4 columns (lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {timeRanges.map((range) => {
          const data = safeMetrics[range.key] || { profit: 0, loss: 0 };
          
          // Calculate Net Change
          const netChange = data.profit - data.loss;
          const isProfit = netChange >= 0;
          const profitClass = isProfit ? 'text-green-600' : 'text-red-600';
          // const isIcon = isProfit ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

          return (
            <div
              key={range.key}
              className="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-3">
                <range.icon className="w-5 h-5 text-indigo-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase">{range.label}</h3>
              </div>
              
              <div className="flex flex-col space-y-2 mt-auto">
                {/* 1. Net Profit/Loss (Prominent) */}
                <div className="border-b border-gray-200 pb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">Net Change</p>
                    <div className="flex items-center">
                        <motion.span 
                            className={`text-2xl font-extrabold ${profitClass}`}
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {isProfit ? '+' : '-'}${Math.abs(netChange).toFixed(2).toLocaleString()}
                        </motion.span>
                        < isIcon className={`w-5 h-5 ml-2 ${profitClass}`} />
                    </div>
                </div>

                {/* 2. Detailed Profit */}
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Profit:</span>
                    <span className="text-sm font-bold text-green-600">
                        +${data.profit.toFixed(2).toLocaleString()}
                    </span>
                </div>

                {/* 3. Detailed Loss */}
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Loss:</span>
                    <span className="text-sm font-bold text-red-600">
                        -${data.loss.toFixed(2).toLocaleString()}
                    </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// --- Example Usage Data ---
const exampleMetricsData = {
    daily: { profit: 1200.50, loss: 150.25 }, // Last 24 Hours
    weekly: { profit: 8500.75, loss: 900.00 }, // Last 7 Days
    monthly: { profit: 35000.00, loss: 5200.50 }, // Last 30 Days
    yearly: { profit: 150000.00, loss: 18000.00 }, // Current Year
};

// Example for negative net change:
// const exampleMetricsData = { daily: { profit: 50.00, loss: 150.00 }, ... };

const PerformancePage = () => (
    <div className="p-6 md:p-10 bg-gray-50">
        <StockPerformanceMetricsCard metricsData={exampleMetricsData} />
    </div>
);

export default PerformancePage;