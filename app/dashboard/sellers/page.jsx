"use client";
import React, { useState, useEffect, useMemo } from 'react'; // 1. IMPORT useMemo
import SupplierCard from '../../../src/components/supplier-card/SupplierCard'; 

import { PlusIcon } from '@heroicons/react/24/outline';
import AddSupplierForm from '../../../src/components/supplier-card/AddSupplierForm';
import EditSupplierForm from '../../../src/components/supplier-card/EditSupplierForm';
import { useSearchStore } from '../../../src/store/searchStore';



// ... (initialSampleData remains the same) ...
const initialSampleData = [
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
        supplierEmail: 'office@essential.com',
        firstContact: '555-300-4000',
        secondContact: '',
    },
];

const SupplierPage = () => {
    // --- STATES ---
    const [suppliers, setSuppliers] = useState(initialSampleData);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 3. GET GLOBAL SEARCH STATE (Must be at the top level with other hooks)
    const { search } = useSearchStore();

    // --- EFFECT 1: Load products from localStorage on initial load ---
    useEffect(() => {
        try {
            const tempSuppliers = JSON.parse(localStorage.getItem('tempSuppliers'));
            if (tempSuppliers && tempSuppliers.length > 0) {
                // Ensure unique IDs for temporary storage items for reliable editing
                const suppliersWithIds = tempSuppliers.map((supplier, index) => ({ 
                    ...supplier, 
                    // Create a pseudo-unique ID for local storage items
                    id: `temp-${index}-${supplier.name.replace(/\s/g, '')}` 
                }));
                setSuppliers([...suppliersWithIds, ...initialSampleData.map((s, i) => ({ ...s, id: `static-${i}` }))]);
            } else {
                setSuppliers(initialSampleData.map((s, i) => ({ ...s, id: `static-${i}` })));
            }
        } catch (error) {
            console.error("Could not load suppliers from local storage:", error);
        }
        setIsLoading(false);
    }, []);

    // Function to handle adding a new supplier (remains the same)
    const handleSupplierAdded = (newSupplier) => {
        // Add a temporary ID for the new item
        const supplierWithId = { 
            ...newSupplier, 
            id: `temp-${Date.now()}-${newSupplier.name.replace(/\s/g, '')}` 
        };
        setSuppliers(prevSuppliers => [supplierWithId, ...prevSuppliers]);
    };

    // NEW: Function to handle updating an existing supplier
    const handleSupplierUpdated = (updatedSupplier) => {
        const newSuppliers = suppliers.map(s => 
            s.id === updatedSupplier.id ? updatedSupplier : s
        );
        setSuppliers(newSuppliers);
        setEditingSupplier(null); // Close the form

        // Update Local Storage: Only update 'tempSuppliers'
        const tempSuppliers = newSuppliers.filter(s => s.id.startsWith('temp-'));
        localStorage.setItem('tempSuppliers', JSON.stringify(tempSuppliers));
    };

    // NEW: Function passed to SupplierCard to start editing
    const startEditing = (supplier) => {
        setEditingSupplier(supplier);
    };

    // If editing a supplier, use the EditSupplierForm
    const isEditMode = !!editingSupplier;

    // 4. FILTERING LOGIC using useMemo
    const filteredSuppliers = useMemo(() => {
        if (!search) {
            return suppliers; // Show all suppliers if search is empty
        }

        const lowerCaseSearch = search.toLowerCase();

        return suppliers.filter(supplier => 
            // Filter logic: Check if the supplier name or their product name includes the search text
            supplier.name.toLowerCase().includes(lowerCaseSearch) ||
            supplier.productName.toLowerCase().includes(lowerCaseSearch)
        );
    }, [search, suppliers]); // Re-run filter on search change or supplier list change


    if (isLoading) {
        return <div className="p-5 text-center text-gray-500">Loading suppliers...</div>;
    }

    const showNoResults = filteredSuppliers.length === 0 && search;

    return (
        <div className='p-5 '>
            {/* --- Dashboard Header and Add Button --- */}
            <div className='flex justify-between items-center p-5'>
                <h1 className='text-md md:text-2xl font-bold text-green-700'>
                    Suppliers Dashboard ({filteredSuppliers.length})
                </h1>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300 text-xs md:text-sm flex items-center'
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add New Supplier
                </button>
            </div>
            
            {search && (
                <p className="text-sm text-gray-500 mb-4 px-5">
                    Showing results for: <span className="font-semibold text-green-600">"{search}"</span>
                </p>
            )}
            
            {/* --- Supplier List --- */}
            <div className="space-y-3">
                {showNoResults ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow-md mx-5">
                        <p className="text-lg font-medium text-red-500">
                            No suppliers found matching **"{search}"**.
                        </p>
                    </div>
                ) : (
                    // 5. MAP OVER FILTERED SUPPLIERS
                    filteredSuppliers.map((supplier, index) => (
                        <SupplierCard 
                            key={supplier.id || index} 
                            supplier={supplier} 
                            onEdit={() => startEditing(supplier)} 
                        />
                    ))
                )}
            </div>

            {/* --- MODALS --- */}
            {isFormOpen && (
                <AddSupplierForm 
                    onClose={() => setIsFormOpen(false)} 
                    onSupplierAdded={handleSupplierAdded}
                />
            )}

            {isEditMode && (
                <EditSupplierForm
                    supplier={editingSupplier}
                    onClose={() => setEditingSupplier(null)}
                    onUpdate={handleSupplierUpdated}
                />
            )}
        </div>
    );
}

export default SupplierPage;