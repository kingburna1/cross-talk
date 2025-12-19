
'use client';
import React, { useState } from 'react';
import { 
    XMarkIcon, PencilIcon, CurrencyDollarIcon, TagIcon, PhoneIcon, MapPinIcon, ClockIcon, EnvelopeIcon, BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const EditSupplierForm = ({ supplier, onUpdate, onClose }) => {
    // Initialize state with the passed supplier data
    const [formData, setFormData] = useState({
        ...supplier,
        // Ensure numbers are strings for input value fields
        pricePerUnit: String(supplier.pricePerUnit), 
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            // Prepare updated object, ensuring numbers are parsed correctly
            const updatedSupplier = {
                name: formData.name,
                address: formData.address,
                productName: formData.productName,
                maxDeliveryTime: formData.maxDeliveryTime,
                pricePerUnit: parseFloat(formData.pricePerUnit),
                supplierEmail: formData.supplierEmail,
                firstContact: formData.firstContact,
                secondContact: formData.secondContact,
            };

            // Send update to backend API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/suppliers/${supplier._id || supplier.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(updatedSupplier),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update supplier");
            }

            const savedSupplier = await response.json();

            // Call the parent update function with the response from server
            onUpdate(savedSupplier);

            onClose();
        } catch (error) {
            console.error("Error updating supplier:", error);
            showErrorToast(`Failed to update supplier: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                
                {/* Header */}
                <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-yellow-700 flex items-center">
                        <PencilIcon className="w-6 h-6 mr-2 text-yellow-500" />
                        Edit Supplier: {supplier.name}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Form Body - Fields are identical to AddSupplierForm */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* --- Basic Supplier Info --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Supplier Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                            <div className="relative">
                                <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <BuildingStorefrontIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
                            <div className="relative">
                                <input type="text" id="address" value={formData.address} onChange={handleChange} required className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* --- Product & Pricing --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        
                        {/* Primary Product Supplied */}
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Primary Product / Item</label>
                            <div className="relative">
                                <input type="text" id="productName" value={formData.productName} onChange={handleChange} required className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        
                        {/* Price Per Unit */}
                        <div>
                            <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">Price Per Unit ($)</label>
                            <div className="relative">
                                <input type="number" id="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} required step="0.01" min="0" className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Max Delivery Time */}
                        <div>
                            <label htmlFor="maxDeliveryTime" className="block text-sm font-medium text-gray-700 mb-1">Max Delivery Time (e.g., 7 days)</label>
                            <div className="relative">
                                <input type="text" id="maxDeliveryTime" value={formData.maxDeliveryTime} onChange={handleChange} required className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* --- Contact Information --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="supplierEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <input type="email" id="supplierEmail" value={formData.supplierEmail} onChange={handleChange} required className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        
                        {/* Primary Contact */}
                        <div>
                            <label htmlFor="firstContact" className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                            <div className="relative">
                                <input type="tel" id="firstContact" value={formData.firstContact} onChange={handleChange} required className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        
                        {/* Secondary Contact */}
                        <div>
                            <label htmlFor="secondContact" className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone (Optional)</label>
                            <div className="relative">
                                <input type="tel" id="secondContact" value={formData.secondContact} onChange={handleChange} className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>


                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex items-center px-6 py-2 font-semibold rounded-lg transition duration-150 ${
                                isSaving ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'
                            } text-white`}
                        >
                            {isSaving ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSupplierForm;