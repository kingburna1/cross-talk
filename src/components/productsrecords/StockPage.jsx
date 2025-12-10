'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { StarIcon, ArrowTrendingUpIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// Function to handle long text truncation
const useTruncatedText = (text, limit = 150) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncated = text.length > limit ? text.substring(0, limit) + '...' : text;
  const showToggle = text.length > limit;

  return {
    displayText: isExpanded ? text : truncated,
    isExpanded,
    showToggle,
    toggleExpansion: () => setIsExpanded(prev => !prev),
  };
};

const ProductStockCard = ({ product }) => {
  const {
    _id,
    imageSrc,
    name,
    qtyLeft,
    buyPrice,     // Cost to acquire
    sellPrice,    // Price sold for
    totalSold = 0,    // Total units sold
    customerReview = '',
    reviewRating = 0,
  } = product;

  // Constants
  const LOW_STOCK_THRESHOLD = 10;
  const isLowStock = qtyLeft <= LOW_STOCK_THRESHOLD;

  // Calculations
  // Estimated Profit/Loss based on current stock (Inventory Value)
  const unitProfit = sellPrice - buyPrice;
  const currentInventoryValue = qtyLeft * buyPrice; 
  const potentialProfitOnStock = qtyLeft * unitProfit;
  
  // Simulated Total Realized Profit (using totalSold)
  const totalRealizedProfit = totalSold * unitProfit;

  // Estimated potential loss on obsolete/damaged stock (Example: 5% of inventory cost)
  const potentialLoss = currentInventoryValue * 0.05; 

  // Handle Review Text Truncation
  const reviewContent = useTruncatedText(customerReview, 150);

  // Format currency in XAF
  const formatCurrency = (amount) => {
    return amount.toLocaleString('fr-CM', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }) + ' FCFA';
  };

  return (
    <motion.div
      key={_id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col w-full p-4 mb-3 rounded-lg shadow-xl transition-all duration-300 bg-white border border-gray-200"
    >
      
      {/* -------------------- ROW 1: Product Info (FIXED HORIZONTAL) -------------------- */}
      <div className="flex items-start md:items-center justify-between pb-3 border-b border-gray-100 mb-3 w-full">
        
        <div className="flex items-center grow min-w-0 pr-4">
          <Image
            src={imageSrc}
            width={56}
            height={56}
            alt={name}
            className="w-14 h-14 object-cover rounded-md mr-4 shrink-0"
          />
          {/* Product Name is allowed to shrink only up to min-w-0 */}
          <h3 className="text-base font-bold text-gray-800 truncate leading-snug">
            {name}
          </h3>
        </div>
        
        {/* Stock Level Indicator - Use flex-none to prevent shrinking and ensure fixed width */}
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg flex-none w-24 ${isLowStock ? 'bg-red-100' : 'bg-indigo-50'}`}>
          <span className="text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Stock Left</span>
          <span className={`text-2xl font-extrabold ${isLowStock ? 'text-red-600 animate-pulse' : 'text-indigo-600'}`}>
            {qtyLeft}
          </span>
        </div>
      </div>

      {/* -------------------- ROW 2: Financial Metrics & Review (Responsive Grid/Columns) -------------------- */}
      <div className="flex flex-col lg:flex-row justify-between w-full">
        
        {/* 1. Profit/Loss Metrics */}
        <div className="metrics-grid grid grid-cols-2 gap-4 lg:w-1/2 lg:pr-6 border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 mb-4 lg:mb-0">
          
          <MetricBlock 
            title="Unit Profit" 
            value={formatCurrency(unitProfit)} 
            color={unitProfit >= 0 ? 'text-green-600' : 'text-red-600'}
            icon={ArrowTrendingUpIcon}
          />

          <MetricBlock 
            title="Total Realized Profit" 
            value={formatCurrency(totalRealizedProfit)} 
            color='text-green-600'
            icon={ArrowTrendingUpIcon}
          />
          
          <MetricBlock 
            title="Potential Profit on Stock" 
            value={formatCurrency(potentialProfitOnStock)} 
            color='text-blue-600'
            icon={ArrowTrendingUpIcon}
          />

          <MetricBlock 
            title="Potential Loss/Risk" 
            value={formatCurrency(potentialLoss)} 
            color='text-red-600'
            icon={ArchiveBoxXMarkIcon}
          />
        </div>

        {/* 2. Customer Review & Rating */}
        <div className="review-section lg:w-1/2 lg:pl-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
            Customer Review {reviewRating > 0 ? `(${reviewRating.toFixed(1)} / 5)` : '(No rating yet)'}
          </h4>
          
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${i < Math.floor(reviewRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-600 leading-snug">
            {customerReview || 'No customer review yet.'}
          </p>
          
          {reviewContent.showToggle && (
            <button
              onClick={reviewContent.toggleExpansion}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-1"
            >
              {reviewContent.isExpanded ? 'View Less' : 'View More'}
            </button>
          )}
        </div>
      </div>
      
    </motion.div>
  );
};


// --- Helper Component for Metrics ---
const MetricBlock = ({ title, value, color, icon: Icon }) => (
    <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-500 uppercase">{title}</span>
        <div className="flex items-center mt-1">
            <Icon className={`w-4 h-4 mr-1 ${color}`} />
            <span className={`text-lg font-bold ${color}`}>{value}</span>
        </div>
    </div>
);

// Component to export for use in Next.js page
const StockPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading inventory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Stock Performance</h1>
            {products.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-600">No products found in inventory.</p>
                </div>
            ) : (
                products.map(product => (
                    <ProductStockCard key={product._id} product={product} />
                ))
            )}
        </div>
    );
};

export default StockPage;