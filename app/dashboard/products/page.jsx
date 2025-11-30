import React from 'react';
import ProductCard from '../../../src/components/product-card/ProductCard';

const sampleProductData = [
  {
    imageSrc: '/image1.jpg', 
    name: 'Luxury Smartwatch Pro X900',
    buyPrice: 150.00,
    qtyBought: 50,
    supplierName: 'TechCorp Global Inc.',
    supplierContact: '(555) 123-4567',
    supplierEmail: 'contact@techcorp.com',
    sellPrice: 299.99,
    qtyLeft: 12, 
  },
  {
    imageSrc: '/image1.jpg',
    name: 'Wireless Ergonomic Mouse',
    buyPrice: 15.50,
    qtyBought: 200,
    supplierName: 'Budget Electronics Ltd',
    supplierContact: '(555) 987-6543',
    supplierEmail: 'sales@budgetelec.co',
    sellPrice: 35.99,
    qtyLeft: 98,
  },
];

const page = () => {
  return (
    <div className='p-5 '>
      <div className='flex justify-between  items-center p-5'>
        <h1 className='text-md md:text-2xl font-bold  text-green-700'>Products Dashboard</h1>
        <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300 text-xs md:text-sm'>
          Add New Products
        </button>
         </div>
        {sampleProductData.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
        
    </div>
  );
}

export default page;
