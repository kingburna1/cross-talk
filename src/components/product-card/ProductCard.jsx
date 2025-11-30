"use client";
import React from "react";
import Image from "next/image";

import { PencilSquareIcon } from "@heroicons/react/24/solid";

const ProductCard = ({ product }) => {
  const {
    imageSrc,
    name,
    buyPrice,
    qtyBought,
    supplierName,
    supplierContact,
    supplierEmail,
    sellPrice,
    qtyLeft,
  } = product;

  const isLowStock = qtyLeft <= 10;

  // Function to handle the edit click
  const handleEditClick = () => {
    console.log(`Editing product: ${name}`);
    // Add your routing or state logic here (e.g., router.push('/edit/' + product.id))
  };

  return (
    <div className="product-card-row  flex flex-col md:flex-row items-start md:items-center justify-between  p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
      {/* 1. Image and Product Name (Always Visible) */}
      <div className="product-info flex items-center grow min-w-0 pr-4 mb-3 md:mb-0 md:max-w-[300px] shrink-0">
        <Image
          src={imageSrc}
          width={64}
          height={64}
          alt={name}
          className="w-16 h-16 object-cover rounded-md mr-4 shrink-0"
        />
        <h3 className="text-base font-semibold text-gray-800 truncate">
          {name}
        </h3>
      </div>

      {/* 2. Inventory and Pricing Details - STACKED on small screens, ROW on medium+ */}
      {/* Note: Added 'grid grid-cols-2' for small screens to prevent overflow */}
      <div className="product-details grid grid-cols-2 gap-y-3 gap-x-6 md:flex md:items-center md:justify-between md:space-x-8 lg:space-x-12 px-0 md:px-4 md:border-x border-gray-300 md:shrink-0 w-full md:w-auto">
        {/* Buy Price */}
        <div className="detail-group text-left md:text-center min-w-[70px]">
          <span className="text-xs font-medium text-gray-500 uppercase">
            Buy Price
          </span>
          <span className="text-lg font-bold text-blue-600 block">
            ${buyPrice.toFixed(2)}
          </span>
        </div>

        {/* Quantity Bought */}
        <div className="detail-group text-left md:text-center min-w-[70px]">
          <span className="text-xs font-medium text-gray-500 uppercase">
            Qty Bought
          </span>
          <span className="text-lg font-bold text-gray-700 block">
            {qtyBought}
          </span>
        </div>

        {/* Quantity Left (Low Stock Highlight) */}
        <div className="detail-group text-left md:text-center min-w-[70px]">
          <span className="text-xs font-medium text-gray-500 uppercase">
            Qty Left
          </span>
          <span
            className={`text-lg font-bold block ${
              isLowStock ? "text-red-600 animate-pulse" : "text-gray-700"
            }`}
          >
            {qtyLeft}
          </span>
        </div>

        {/* Sell Price */}
        <div className="detail-group text-left md:text-center min-w-[70px]">
          <span className="text-xs font-medium text-gray-500 uppercase">
            Sell Price
          </span>
          <span className="text-lg font-bold text-green-600 block">
            ${sellPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 3. Supplier Contact Info & Edit Button - Stacked on small screens */}
      <div className="flex flex-col md:flex-row items-start md:items-center ml-0 mt-4 md:mt-0 md:ml-4 w-full md:w-auto">
        {/* Supplier Info Block */}
        <div className="supplier-info  flex flex-col md:hidden  items-start md:items-end shrink-0 min-w-[220px] text-left md:text-right mb-3 md:mb-0">
          {/* New Supplier Information Label */}
          <span className="text-xs font-medium text-gray-400 uppercase mb-1">
            Supplier Information
          </span>

          <span className="text-sm font-semibold text-gray-800">
            {supplierName}
          </span>
          <span className="text-xs text-gray-600 mt-1 flex flex-col md:flex-row md:space-x-2">
            <span>📞 {supplierContact}</span>
            <span>📧 {supplierEmail}</span>
          </span>
        </div>

        {/* Edit Button */}
        <button
          onClick={handleEditClick}
          className="ml-0 md:ml-4 p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-150 flex items-center justify-center h-10 w-10 shrink-0"
          aria-label="Edit Product"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
