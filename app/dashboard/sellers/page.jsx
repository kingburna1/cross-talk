"use client";
import React, { useState, useEffect, useMemo } from 'react'; // 1. IMPORT useMemo
import SupplierCard from '../../../src/components/supplier-card/SupplierCard'; 

import { PlusIcon } from '@heroicons/react/24/outline';
import AddSupplierForm from '../../../src/components/supplier-card/AddSupplierForm';
import EditSupplierForm from '../../../src/components/supplier-card/EditSupplierForm';
import { useSearchStore } from '../../../src/store/searchStore';



const SupplierPage = () => {
    // --- STATES ---
    const [suppliers, setSuppliers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // GET GLOBAL SEARCH STATE
    const { search } = useSearchStore();

    // --- EFFECT: Load suppliers from backend MongoDB ---
    useEffect(() => {
        const loadFromServer = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/suppliers`,
                    { credentials: "include" }
                );

                console.log("Fetch /api/suppliers status:", res.status);

                if (!res.ok) {
                    console.error("Failed to fetch suppliers:", await res.text());
                    setIsLoading(false);
                    return;
                }

                const dbSuppliers = await res.json();
                console.log("Fetched suppliers:", dbSuppliers);

                // Map suppliers to include id field from _id
                const mapped = dbSuppliers.map(s => ({
                    ...s,
                    id: s._id,
                }));

                setSuppliers(mapped);
            } catch (err) {
                console.error("Network error loading suppliers:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadFromServer();
    }, []);

    // Function to handle adding a new supplier
    const handleSupplierAdded = (newSupplier) => {
        const supplierWithId = {
            ...newSupplier,
            id: newSupplier._id,
        };
        setSuppliers(prevSuppliers => [supplierWithId, ...prevSuppliers]);
    };

    // Function to handle updating an existing supplier
    const handleSupplierUpdated = (updatedSupplier) => {
        // Map the updated supplier with proper id field
        const supplierWithId = {
            ...updatedSupplier,
            id: updatedSupplier._id || updatedSupplier.id,
        };
        
        const newSuppliers = suppliers.map(s =>
            s.id === supplierWithId.id ? supplierWithId : s
        );
        setSuppliers(newSuppliers);
        setEditingSupplier(null);
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
                    // Map over filtered suppliers with unique keys
                    filteredSuppliers.map((supplier) => (
                        <SupplierCard 
                            key={supplier.id} 
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