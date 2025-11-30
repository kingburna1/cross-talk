'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; 
import { CubeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ProductStockValueCard = ({ product }) => {
  const {
    id,
    imageSrc,
    name,
    costPrice,     // Assuming this is the cost/unit used for valuation
    qtyLeft,       // Total stocks available
  } = product;

  // Calculate the stock value for this specific product
  const stockValue = costPrice * qtyLeft;

  return (
    <motion.div
      key={id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-4 mb-3 rounded-lg shadow-sm transition-all duration-300 bg-white border border-gray-200 hover:shadow-md"
    >
      
      {/* 1. Product Name and Image (Left Block) */}
      <div className="flex items-center grow min-w-0 pr-4 mb-3 md:mb-0 md:max-w-[350px]">
        <Image
          src={imageSrc}
          width={48}
          height={48}
          alt={name}
          className="w-12 h-12 object-cover rounded-md mr-4 shrink-0"
        />
        {/* Product Name (truncated to prevent overflow) */}
        <h3 className="text-base font-semibold text-gray-800 truncate">{name}</h3>
      </div>

      {/* 2. Inventory Metrics (Responsive Grid/Row) */}
      <div className="flex flex-wrap gap-y-3 gap-x-8 md:flex md:items-center md:space-x-12 px-0 md:px-6 md:border-x border-gray-300 w-full md:w-auto">
        
        {/* Unit Price (Cost Price for Valuation) */}
        <div className="detail-group text-left md:text-center min-w-20">
          <span className="text-xs font-medium text-gray-500 uppercase flex items-center">
            <CurrencyDollarIcon className="w-4 h-4 mr-1 text-gray-400" /> Unit Cost
          </span>
          <span className="text-lg font-bold text-blue-600 block">
            ${costPrice.toFixed(2)}
          </span>
        </div>

        {/* Total Stocks Available */}
        <div className="detail-group text-left md:text-center min-w-20">
          <span className="text-xs font-medium text-gray-500 uppercase flex items-center">
             <CubeIcon className="w-4 h-4 mr-1 text-gray-400" /> Total Stock
          </span>
          <span className="text-lg font-bold text-gray-700 block">
            {qtyLeft}
          </span>
        </div>

        {/* Total Stock Value (Calculated) */}
        <div className="detail-group text-left md:text-center min-w-[120px]">
          <span className="text-xs font-medium text-gray-500 uppercase">
            Stock Value
          </span>
          <span className="text-xl font-extrabold text-green-600 block">
            ${stockValue.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductStockValueCard;