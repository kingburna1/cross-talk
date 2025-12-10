'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import ProductStockValueCard from '../../../src/components/stocksvaluecard/ProductStockValueCard';

const Page = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from the database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/products`,
          { credentials: "include" }
        );

        if (!res.ok) {
          console.error("Failed to fetch products:", await res.text());
          setIsLoading(false);
          return;
        }

        const dbProducts = await res.json();
        console.log("Fetched products for stock value:", dbProducts);

        // Map products to the format needed for stock value calculation
        const mappedProducts = dbProducts.map(p => ({
          id: p._id,
          imageSrc: p.imageSrc || '/image1.jpg',
          name: p.name,
          qtyLeft: p.qtyLeft || 0,
          costPrice: p.buyPrice || 0, // Using buyPrice as cost price
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Network error loading products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Calculate the Grand Total Stock Value using useMemo for efficiency
  const grandTotalStockValue = useMemo(() => {
    return products.reduce((total, product) => {
      return total + (product.costPrice * product.qtyLeft);
    }, 0);
  }, [products]); // Re-calculate only if products change

  if (isLoading) {
    return (
      <div className="p-5 text-center text-gray-500">
        Loading inventory valuation...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-5 text-center text-gray-500">
        No products found in inventory.
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 md:p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Valuation Overview</h1>
        
        {/* --- 1. List of Individual Product Cards --- */}
        <div className="space-y-3">
          {products.map(product => (
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
              ${grandTotalStockValue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
