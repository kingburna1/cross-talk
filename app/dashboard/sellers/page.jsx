import React from 'react';
import SupplierCard from '../../../src/components/supplier-card/SupplierCard';

const sampleSupplierData = [
  {
    name: 'TechCorp Global Inc.',
    address: '123 Tech Way, Shenzhen, China',
    productName: 'Luxury Smartwatch Pro X900',
    maxDeliveryTime: '14 days',
    pricePerUnit: 150.00,
    supplierEmail: 'techsales@corp.com',
    firstContact: '555-100-2000',
    secondContact: '555-100-2001',
  },
  {
    name: 'Office Essentials Ltd.',
    address: '45 Main Street, Toronto, Canada',
    productName: 'Wireless Ergonomic Mouse',
    maxDeliveryTime: '5 days',
    pricePerUnit: 15.50,
    supplierEmail: 'techsales@corp.com',
    firstContact: '555-100-2000',
    secondContact: '555-100-2001',
  },
];

const page = () => {
  return (
    <div className=''>
      <div className='flex justify-between  items-center p-5'>
        <h1 className='text-md md:text-2xl font-bold  text-green-700'>Suppliers Dashboard</h1>
        <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300 text-xs md:text-sm'>
          Add New Supplier
        </button>
         </div>
      {sampleSupplierData.map((supplier, index) => (
        <SupplierCard key={index} supplier={supplier} />
      ))}
    </div>
  );
}

export default page;
