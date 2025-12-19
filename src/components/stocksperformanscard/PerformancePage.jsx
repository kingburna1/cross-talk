'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, CalendarDaysIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const StockPerformanceMetricsCard = ({ metricsData, isLoading }) => {
  // Define the time ranges and their corresponding data keys
  const timeRanges = [
    { label: 'Last 24 Hours', key: 'daily', icon: ClockIcon },
    { label: 'Last 7 Days', key: 'weekly', icon: CalendarDaysIcon },
    { label: 'Last 30 Days', key: 'monthly', icon: CalendarDaysIcon },
    { label: 'Current Year', key: 'yearly', icon: CalendarDaysIcon },
  ];

  // Placeholder for data validation/default values
  const safeMetrics = metricsData || {};

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <ArrowPathIcon className="w-8 h-8 text-indigo-600 animate-spin mr-3" />
          <span className="text-lg font-semibold text-gray-600">Loading performance data...</span>
        </div>
      </div>
    );
  }

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

      {/* --- Metrics Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {timeRanges.map((range) => {
          const data = safeMetrics[range.key] || { profit: 0, loss: 0 };
          
          // Calculate Net Change
          const netChange = data.profit - data.loss;
          const isProfit = netChange >= 0;
          const profitClass = isProfit ? 'text-green-600' : 'text-red-600';
          
          const TrendIcon = isProfit ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

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
                {/* 1. Net Profit/Loss */}
                <div className="border-b border-gray-200 pb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">Net Change</p>
                    <div className="flex items-center">
                        <motion.span 
                            className={`text-2xl font-extrabold ${profitClass}`}
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {isProfit ? '+' : '-'}{Math.abs(netChange).toFixed(0).toLocaleString()} FCFA
                        </motion.span>
                        <TrendIcon className={`w-5 h-5 ml-2 ${profitClass}`} />
                    </div>
                </div>

                {/* 2. Detailed Profit */}
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Profit:</span>
                    <span className="text-sm font-bold text-green-600">
                        +{data.profit.toFixed(0).toLocaleString()} FCFA
                    </span>
                </div>

                {/* 3. Detailed Loss */}
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Loss:</span>
                    <span className="text-sm font-bold text-red-600">
                        -{data.loss.toFixed(0).toLocaleString()} FCFA
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

const PerformancePage = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      // Fetch products and sales
      const [productsRes, salesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/products`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/sales`, { credentials: "include" })
      ]);

      if (!productsRes.ok || !salesRes.ok) {
        console.error("Failed to fetch data");
        setIsLoading(false);
        return;
      }

      const products = await productsRes.json();
      const sales = await salesRes.json();

      // Calculate metrics for different time periods
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const oneYearAgo = new Date(now.getFullYear(), 0, 1);

      const calculateProfitLoss = (startDate) => {
        let profit = 0;
        let loss = 0;

        // Filter sales within the time period
        const relevantSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= startDate && sale.status === 'completed';
        });

        // Calculate profit from sales
        relevantSales.forEach(sale => {
          sale.lineItems.forEach(item => {
            // Find the product to get buy price
            const product = products.find(p => p._id === item.productId);
            if (product) {
              const costPrice = product.buyPrice * item.quantity;
              const revenue = item.totalPrice;
              const itemProfit = revenue - costPrice;
              
              if (itemProfit > 0) {
                profit += itemProfit;
              } else {
                loss += Math.abs(itemProfit);
              }
            }
          });
        });

        // Calculate loss from unsold inventory (products that expired or damaged)
        // For now, we'll consider products with very low stock turnover
        products.forEach(product => {
          const productAge = new Date(product.createdAt);
          if (productAge >= startDate) {
            const quantitySold = product.qtyBought - product.qtyLeft;
            const unsoldValue = product.buyPrice * product.qtyLeft;
            
            // If product is more than 6 months old and has high unsold inventory
            const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            if (productAge < sixMonthsAgo && product.qtyLeft > product.qtyBought * 0.7) {
              // Consider 10% of unsold inventory as potential loss
              loss += unsoldValue * 0.1;
            }
          }
        });

        return { profit, loss };
      };

      const metrics = {
        daily: calculateProfitLoss(oneDayAgo),
        weekly: calculateProfitLoss(oneWeekAgo),
        monthly: calculateProfitLoss(oneMonthAgo),
        yearly: calculateProfitLoss(oneYearAgo),
      };

      setMetricsData(metrics);
    } catch (err) {
      console.error("Error fetching performance data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50">
      <StockPerformanceMetricsCard metricsData={metricsData} isLoading={isLoading} />
    </div>
  );
};

export default PerformancePage;
