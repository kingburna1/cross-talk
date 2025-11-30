'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, TruckIcon, CurrencyDollarIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const cardVariants = {
  hidden: { opacity: 0, scaleY: 0.9 },
  visible: { opacity: 1, scaleY: 1, transition: { duration: 0.3 } },
};

// Component to handle long text truncation (reused for customer/delivery info)
const useTruncatedText = (text, limit = 100) => {
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


const OrderCard = ({ order }) => {
  const {
    orderId,
    productName,
    quantity,
    unitCost, // Cost price per unit
    unitSalePrice, // Selling price per unit
    customerInfo, // Name, Email, Phone
    deliveryAddress, // Full address string
    deliveryMethod, // e.g., 'Standard', 'Express', 'Pickup'
    orderNotes, // Any special instructions
  } = order;

  // --- Financial Calculations ---
  const totalCost = unitCost * quantity;
  const totalRevenue = unitSalePrice * quantity;
  const netProfit = totalRevenue - totalCost;
  
  // Calculate Profit/Loss Percentage based on Total Revenue
  const profitLossPercentage = (netProfit / totalRevenue) * 100;
  
  const isProfit = netProfit >= 0;
  const percentageClass = isProfit ? 'text-green-600' : 'text-red-600';
  const percentageSign = isProfit ? '+' : '-';
  const statusLabel = isProfit ? 'Profit' : 'Loss';

  // --- Truncation Hooks ---
  const addressContent = useTruncatedText(deliveryAddress, 50);
  const notesContent = useTruncatedText(orderNotes || 'No special notes.', 70);

  return (
    <motion.div
      key={orderId}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full p-4 mb-3 rounded-xl shadow-lg transition-all duration-300 bg-white border border-gray-100 hover:shadow-xl"
    >
      {/* --- Top Row: Order ID and Status --- */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-indigo-600" />
            Order #{orderId}
        </h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
            {statusLabel}
        </span>
      </div>

      {/* --- Main Content Row: Product, Customer, Delivery, Profit (Highly Responsive) --- */}
      {/* Uses flex-col on mobile, transitions to a multi-column flex on tablet/desktop */}
      <div className="flex flex-col md:flex-row md:divide-x divide-gray-200">

        {/* 1. Product Details (Wider on small screens) */}
        <div className="flex-1 md:w-1/4 pr-4 pb-4 md:pb-0">
          <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Product Ordered</h4>
          <p className="text-base font-medium text-gray-900 leading-snug">{productName}</p>
          <div className="mt-2 text-sm text-gray-600">
            <p>Qty: <span className="font-bold">{quantity}</span></p>
            <p>Sale Price (Unit): <span className="font-medium">${unitSalePrice.toFixed(2)}</span></p>
            <p>Total Revenue: <span className="font-bold">${totalRevenue.toFixed(2)}</span></p>
          </div>
        </div>
        
        {/* 2. Customer Information */}
        <div className="flex-1 md:w-1/4 px-0 md:px-4 border-t pt-4 md:pt-0 md:border-t-0">
          <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center">
            <UserIcon className="w-4 h-4 mr-1 text-blue-500" /> Customer Info
          </h4>
          <p className="text-sm text-gray-600">
            Name: {customerInfo.name}
            <br/>
            Email: {customerInfo.email}
            <br/>
            Phone: {customerInfo.phone}
          </p>
        </div>

        {/* 3. Delivery Information (Including View More/Less for long address) */}
        <div className="flex-1 md:w-1/4 px-0 md:px-4 border-t pt-4 md:pt-0">
          <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2 flex items-center">
            <TruckIcon className="w-4 h-4 mr-1 text-yellow-500" /> Delivery
          </h4>
          <p className="text-sm text-gray-600">
            Method: {deliveryMethod}
            <br/>
            Address: {addressContent.displayText}
          </p>
          {addressContent.showToggle && (
            <button 
                onClick={addressContent.toggleExpansion}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium mt-1">
              {addressContent.isExpanded ? 'View Less' : 'View More Address'}
            </button>
          )}
        </div>
        
        {/* 4. Profit/Loss Metrics (Rightmost, fixed width for emphasis) */}
        <div className="flex-none w-full md:w-[180px] pt-4 md:pt-0 pl-0 md:pl-4 border-t md:border-t-0">
          <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Financial Outcome</h4>
          
          <div className="p-3 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm font-medium text-gray-500">Net Profit/Loss</p>
            <p className={`text-2xl font-extrabold ${percentageClass}`}>
              {percentageSign}${Math.abs(netProfit).toFixed(2)}
            </p>
            
            <p className="text-xs font-medium text-gray-500 mt-2">P/L Percentage</p>
            <p className={`text-xl font-extrabold ${percentageClass}`}>
              {percentageSign}{Math.abs(profitLossPercentage).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
      
      {/* --- Bottom Row: Notes (Always Full Width) --- */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-600 uppercase mb-1 flex items-center">
            <ChatBubbleBottomCenterTextIcon className="w-4 h-4 mr-1" /> Order Notes
        </h4>
        <p className="text-sm italic text-gray-500">
            {notesContent.displayText}
        </p>
        {notesContent.showToggle && (
            <button 
                onClick={notesContent.toggleExpansion}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium mt-1">
              {notesContent.isExpanded ? 'View Less' : 'View More Notes'}
            </button>
        )}
      </div>

    </motion.div>
  );
};

export default OrderCard;