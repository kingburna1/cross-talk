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
    <div className="supplier-card-row flex flex-col md:flex-row items-start md:items-center justify-between w-full p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
      
      {/* -------------------- ROW 1: Name, Product, and Edit Button (Mobile Top Row) -------------------- */}
      <div className="flex items-center justify-between w-full md:w-auto md:pr-4 md:mb-0 mb-3">
        
        {/* 1. Supplier Name and Product (Left Block) */}
        <div className="supplier-id-info flex flex-col min-w-0 pr-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {name}
          </h3>
          <span className="text-sm text-blue-600 font-semibold truncate mt-1">
            Product: {productName}
          </span>
        </div>

        {/* Edit Button (Visible always, moves to the far right on mobile) */}
        <button
          onClick={handleEditClick}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-150 flex items-center justify-center h-10 w-10 shrink-0 md:hidden" // Hidden on md+
          aria-label="Edit Supplier"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* -------------------- ROW 2: All Details (Will wrap on small screens) -------------------- */}
      
      <div className="flex flex-col md:flex-row w-full md:w-auto md:items-center md:space-x-4">
          
        {/* 2. Contact Information Block (Merged into the flow) */}
        {/* Removed redundant classes/min-widths that caused overflow */}
        <div className="contact-info flex flex-col pr-4 mb-3 md:mb-0 md:border-r border-gray-300"> 
          <span className="text-xs font-medium text-gray-400 uppercase mb-1">
              Contact Information
          </span>
          <span className="text-sm text-gray-700 truncate">📧 {supplierEmail}</span>
          <span className="text-sm text-gray-700 truncate">📞 1: {firstContact}</span>
          {secondContact && (
            <span className="text-sm text-gray-700 truncate">📞 2: {secondContact}</span>
          )}
        </div>

        {/* 3. Key Logistics and Pricing Details */}
        {/* Using simple flex wrap on small screens */}
        <div className="logistics-details flex flex-wrap gap-x-6 gap-y-3 md:flex md:items-center md:space-x-12 px-0 md:px-6 md:border-x border-gray-300 w-full md:w-auto">
          
          {/* Product Price */}
          <div className="detail-group text-left md:text-center">
            <span className="text-xs font-medium text-gray-500 uppercase">Unit Price</span>
            <span className="text-xl font-bold text-green-600 block">${pricePerUnit.toFixed(2)}</span>
          </div>

          {/* Max Delivery Time */}
          <div className="detail-group text-left md:text-center">
            <span className="text-xs font-medium text-gray-500 uppercase">Max Delivery</span>
            <span className="text-lg font-bold text-gray-700 block">{maxDeliveryTime}</span>
          </div>
        </div>

        {/* 4. Address (Right Block) */}
        <div className="address-info flex flex-col items-start md:items-end shrink-0 ml-0 mt-4 md:mt-0 md:ml-4 text-left md:text-right">
          <span className="text-xs font-medium text-gray-400 uppercase mb-1">
              Supplier Address
          </span>
          <p className="text-sm text-gray-700 leading-snug">{address}</p>
        </div>
        
        {/* Edit Button (Hidden on mobile, visible on md+ as the last element) */}
       <button
          onClick={handleEditClick}
          className="hidden md:flex p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-150 items-center justify-center h-10 w-10 shrink-0 ml-4"
          aria-label="Edit Supplier"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SupplierCard;