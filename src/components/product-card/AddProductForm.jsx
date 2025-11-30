// src/components/AddProductForm.jsx
'use client';
import React, { useState, useRef } from 'react';
import { 
    XMarkIcon, PlusIcon, CurrencyDollarIcon, TagIcon, UserIcon, PhoneIcon, CubeIcon, CloudArrowUpIcon, BuildingStorefrontIcon 
} from '@heroicons/react/24/outline';

const initialFormData = {
    name: '',
    buyPrice: '',
    qtyBought: '',
    supplierName: '',
    supplierContact: '',
    supplierEmail: '',
    sellPrice: '',
    qtyLeft: '',
    imageFile: null, // Holds the File object
    imageSrc: '',    // Holds the URL for preview
};

const AddProductForm = ({ onProductAdded, onClose }) => {
    const [formData, setFormData] = useState(initialFormData);
    const fileInputRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store the file object and create a URL for preview
            const url = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imageSrc: url,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // 1. Prepare new product object (QtyLeft should equal QtyBought initially)
        const newProduct = {
            ...formData,
            buyPrice: parseFloat(formData.buyPrice),
            sellPrice: parseFloat(formData.sellPrice),
            qtyBought: parseInt(formData.qtyBought, 10),
            qtyLeft: parseInt(formData.qtyBought, 10),
            // The imageSrc is the URL for the temporary file upload
        };

        // 2. Add to Local Storage
        const existingProducts = JSON.parse(localStorage.getItem('tempProducts')) || [];
        existingProducts.unshift(newProduct); // Add to the beginning
        localStorage.setItem('tempProducts', JSON.stringify(existingProducts));

        // 3. Notify parent component (page.jsx) that a product was added
        onProductAdded(newProduct);

        // 4. Reset and Close
        setTimeout(() => {
            setIsSaving(false);
            setFormData(initialFormData);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                
                {/* Header */}
                <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-indigo-700 flex items-center">
                        <PlusIcon className="w-6 h-6 mr-2 text-indigo-500" />
                        Add New Product
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* --- Image Upload & Name --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                        
                        {/* Image Upload */}
                        <div className="md:col-span-1 flex flex-col items-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                                {formData.imageSrc ? (
                                    <img src={formData.imageSrc} alt="Product Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="mt-3 px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition"
                            >
                                {formData.imageSrc ? 'Change Image' : 'Select Image'}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                required
                            />
                        </div>

                        {/* Product Name */}
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <div className="relative">
                                <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* --- Pricing and Inventory --- */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Buy Price */}
                        <div>
                            <label htmlFor="buyPrice" className="block text-sm font-medium text-gray-700 mb-1">Buy Price ($)</label>
                            <div className="relative">
                                <input type="number" id="buyPrice" value={formData.buyPrice} onChange={handleChange} required step="0.01" min="0" className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        {/* Sell Price */}
                        <div>
                            <label htmlFor="sellPrice" className="block text-sm font-medium text-gray-700 mb-1">Sell Price ($)</label>
                            <div className="relative">
                                <input type="number" id="sellPrice" value={formData.sellPrice} onChange={handleChange} required step="0.01" min="0" className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        {/* Quantity Bought */}
                        <div className="md:col-span-2">
                            <label htmlFor="qtyBought" className="block text-sm font-medium text-gray-700 mb-1">Quantity Bought (Initial Stock)</label>
                            <div className="relative">
                                <input type="number" id="qtyBought" value={formData.qtyBought} onChange={handleChange} required min="1" className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <CubeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    
                    {/* --- Supplier Information --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        {/* Supplier Name */}
                        <div>
                            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                            <div className="relative">
                                <input type="text" id="supplierName" value={formData.supplierName} onChange={handleChange} required className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <BuildingStorefrontIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        {/* Supplier Contact */}
                        <div>
                            <label htmlFor="supplierContact" className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact (Phone)</label>
                            <div className="relative">
                                <input type="tel" id="supplierContact" value={formData.supplierContact} onChange={handleChange} className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        {/* Supplier Email */}
                        <div>
                            <label htmlFor="supplierEmail" className="block text-sm font-medium text-gray-700 mb-1">Supplier Email</label>
                            <div className="relative">
                                <input type="email" id="supplierEmail" value={formData.supplierEmail} onChange={handleChange} className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex items-center px-6 py-2 font-semibold rounded-lg transition duration-150 ${
                                isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white`}
                        >
                            {isSaving ? 'Saving...' : 'Add Product & Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;