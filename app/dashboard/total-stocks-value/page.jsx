'use client';
import React, { useMemo } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import ProductStockValueCard from '../../../src/components/stocksvaluecard/ProductStockValueCard';


// Example Data Structure
const PRODUCTS_INVENTORY = [
  {
    id: 1,
    imageSrc: '/image1.jpg', 
    name: 'Luxury Smartwatch Pro X900',
    qtyLeft: 50,
    costPrice: 100.00,
  },
  {
    id: 2,
    imageSrc: '/image1.jpg', 
    name: 'Wireless Ergonomic Mouse',
    qtyLeft: 300,
    costPrice: 8.00,
  },
  {
    id: 3,
    imageSrc: '/image1.jpg', 
    name: 'Advanced Gaming Keyboard',
    qtyLeft: 75,
    costPrice: 75.00,
  },
  {
    id: 4,
    imageSrc: '/image1.jpg', 
    name: 'High-Speed USB-C Cable 6ft',
    qtyLeft: 1200,
    costPrice: 2.50,
  },
];

const page = () => {
  // Calculate the Grand Total Stock Value using useMemo for efficiency
  const grandTotalStockValue = useMemo(() => {
    return PRODUCTS_INVENTORY.reduce((total, product) => {
      return total + (product.costPrice * product.qtyLeft);
    }, 0);
  }, [PRODUCTS_INVENTORY]); // Re-calculate only if inventory changes
  return (
    <div>

        {/* <ProductStockValueCard/> */}
        <div className="p-4 md:p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Valuation Overview</h1>
      
      {/* --- 1. List of Individual Product Cards --- */}
      <div className="space-y-3">
        {PRODUCTS_INVENTORY.map(product => (
          <ProductStockValueCard key={product.id} product={product} />
        ))}
      </div>

      {/* --- 2. Grand Total Stock Value Summary Box (BOTTOM) --- */}
      <div className="mt-6 p-6 bg-indigo-600 rounded-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <CurrencyDollarIcon className="w-8 h-8 text-indigo-200 mr-4" />
          <div>
            <p className="text-lg font-medium text-indigo-200 uppercase">
              Total Stock Value (All Products)
            </p>
            <p className="text-sm text-indigo-200">
                Calculated from inventory cost price.
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-auto text-left md:text-right">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            ${grandTotalStockValue.toFixed(2).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
    </div>
  );
}

export default page;
