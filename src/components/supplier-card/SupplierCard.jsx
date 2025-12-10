'use client';
import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid'; 

// 1. Accept the onEdit function as a prop
const SupplierCard = ({ supplier, onEdit }) => { 
  const {
    name,
    address,
    productName,
    maxDeliveryTime,
    pricePerUnit,
    supplierEmail,
    firstContact,
    secondContact,
  } = supplier;

  // 2. Update the handler to call the passed onEdit function
  const handleEditClick = (e) => {
    e.stopPropagation(); 
    // Instead of just logging, we call the function passed from the parent
    // and give it the current supplier object so the parent knows what to edit.
    if (onEdit) {
      onEdit(supplier); 
    } else {
      console.log(`Editing Supplier: ${name} (No onEdit handler provided)`);
    }
  };

  return (
    // Main container now uses flex-col by default and ensures items stretch to full width
    <div className="supplier-card-row flex flex-col lg:flex-row items-start lg:items-center justify-between w-full p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 overflow-hidden">
      
      {/* -------------------- ROW 1: Name, Product, and Edit Button (Mobile Top Row) -------------------- */}
      <div className="flex items-center justify-between w-full lg:w-auto lg:pr-4 lg:mb-0 mb-3">
        
        {/* 1. Supplier Name and Product (Left Block) */}
        <div className="supplier-id-info flex flex-col min-w-0 pr-4 flex-1">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {name || 'Unknown Supplier'}
          </h3>
          <span className="text-sm text-blue-600 font-semibold truncate mt-1">
            Product: {productName || 'N/A'}
          </span>
        </div>

        {/* Edit Button (Visible always, moves to the far right on mobile) */}
        <button
          onClick={handleEditClick}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-150 flex items-center justify-center h-10 w-10 shrink-0 lg:hidden" // Hidden on lg+
          aria-label="Edit Supplier"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>
      
      
      
      <div className="flex flex-col lg:flex-row w-full lg:flex-1 lg:items-center lg:space-x-4 min-w-0">
          
        {/* 2. Contact Information Block (Merged into the flow) */}
       
        <div className="contact-info flex flex-col pr-4 mb-3 lg:mb-0 lg:border-r border-gray-300 min-w-0"> 
          <span className="text-xs font-medium text-gray-400 uppercase mb-1">
              Contact Information
          </span>
          <span className="text-sm text-gray-700 truncate">📧 {supplierEmail || 'N/A'}</span>
          <span className="text-sm text-gray-700 truncate">📞 1: {firstContact || 'N/A'}</span>
          {secondContact && (
            <span className="text-sm text-gray-700 truncate">📞 2: {secondContact}</span>
          )}
        </div>

       
        <div className="logistics-details flex flex-wrap gap-x-6 gap-y-3 lg:flex lg:items-center lg:space-x-6 px-0 lg:px-4 lg:border-r border-gray-300 min-w-0">
          
          {/* Product Price */}
          <div className="detail-group text-left lg:text-center">
            <span className="text-xs font-medium text-gray-500 uppercase">Unit Price</span>
            <span className="text-xl font-bold text-green-600 block">
              ${pricePerUnit ? Number(pricePerUnit).toFixed(2) : '0.00'}
            </span>
          </div>

          {/* Max Delivery Time */}
          <div className="detail-group text-left lg:text-center">
            <span className="text-xs font-medium text-gray-500 uppercase">Max Delivery</span>
            <span className="text-sm font-bold text-gray-700 block">{maxDeliveryTime || 'N/A'}</span>
          </div>
        </div>

        {/* 4. Address and Edit Button Container (Right Block) */}
        <div className="flex flex-row items-center gap-3 lg:gap-4 mt-4 lg:mt-0 lg:ml-4 min-w-0 flex-shrink-0">
          {/* Address */}
          <div className="address-info flex flex-col items-start lg:items-end flex-1 min-w-0 text-left lg:text-right">
            <span className="text-xs font-medium text-gray-400 uppercase mb-1">
                Supplier Address
            </span>
            <p className="text-sm text-gray-700 leading-snug truncate w-full">{address || 'N/A'}</p>
          </div>
          
          {/* Edit Button (Hidden on mobile, visible on lg+ as the last element) */}
          <button
            onClick={handleEditClick}
            className="hidden lg:flex p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-150 items-center justify-center h-10 w-10 shrink-0"
            aria-label="Edit Supplier"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;