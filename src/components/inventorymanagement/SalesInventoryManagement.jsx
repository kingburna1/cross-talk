'use client'
import React, { useState, useMemo, useCallback } from "react";
import { TagIcon, PlusIcon } from "@heroicons/react/24/outline";
import { showSuccessToast, showErrorToast } from "../../lib/toast";

// Import Hooks and Utils
import { usePOSData } from "../../hooks/usePOSData";
import { formatCurrency } from "../../lib/utils";
import CustomerInfoCard from "./CustomerInfoCard";
import AddItemCard from "./AddItemCard";
import SalesItemsTable from "./SalesItemsTable";
import OrderSummaryCard from "./OrderSummaryCard";
import ActionButtons from "./ActionButtons";



const SalesInventoryManagement = () => {
    const { products, isLoading, userId, saveSale } = usePOSData();
    
    // Local State
    const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' });
    const [lineItems, setLineItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amountPaid, setAmountPaid] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculations
    const totals = useMemo(() => {
        const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.05; // 5% Tax
        const grandTotal = subtotal + tax;
        return { subtotal, tax, grandTotal, change: amountPaid - grandTotal };
    }, [lineItems, amountPaid]);

    const isSaleValid = lineItems.length > 0 && totals.grandTotal > 0 && amountPaid >= totals.grandTotal;

    // Handlers
    const handleAddItem = (item) => setLineItems(prev => [...prev, item]);
    const handleRemoveItem = (id) => setLineItems(prev => prev.filter(i => i.productId !== id));
    
    const startNewSale = useCallback(() => {
        setCustomer({ name: '', phone: '', notes: '' });
        setLineItems([]);
        setAmountPaid(0);
    }, []);

    const handleSaveSale = async () => {
        if (!isSaleValid) {
            showErrorToast("Invalid Sale: Please add items and ensure payment covers the total");
            return;
        }
        setIsProcessing(true);
        
        const saleData = {
            customer,
            summary: { ...totals, paymentMethod, amountPaid }
        };

        const success = await saveSale(saleData, lineItems);
        setIsProcessing(false);
        
        if (success) {
            showSuccessToast(`Sale of ${formatCurrency(totals.grandTotal)} saved!`);
            startNewSale();
        } else {
            showErrorToast("Failed to save sale");
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading System...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-6 pb-4 border-b-2 border-indigo-500 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                        <TagIcon className="w-8 h-8 mr-3 text-indigo-600" />
                        POS System
                    </h1>
                    <button onClick={startNewSale} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <PlusIcon className="w-4 h-4 inline mr-1" /> New Sale
                    </button>
                </header>

                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <CustomerInfoCard customer={customer} setCustomer={setCustomer} />
                    <AddItemCard products={products} onAddItem={handleAddItem} />
                </div>

                {/* Middle Row */}
                <div className="mb-6">
                    <SalesItemsTable lineItems={lineItems} onRemoveItem={handleRemoveItem} />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <OrderSummaryCard 
                            totals={totals} 
                            setPaymentMethod={setPaymentMethod} 
                            setAmountPaid={setAmountPaid} 
                        />
                    </div>
                    <div className="md:col-span-1">
                        <ActionButtons 
                            onSave={handleSaveSale} 
                            onCancel={startNewSale} 
                            isSaleValid={isSaleValid} 
                            isProcessing={isProcessing} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesInventoryManagement;
