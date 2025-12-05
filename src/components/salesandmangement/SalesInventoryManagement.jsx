'use client'
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    CalculatorIcon,
    PrinterIcon,
    ShoppingCartIcon,
    UserCircleIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    ArrowPathIcon,
    ClipboardDocumentCheckIcon,
    TagIcon,
    ServerStackIcon,
} from "@heroicons/react/24/outline";


// --- GLOBAL CONFIGURATION & UTILS ---

const formatCurrency = (amount) => {
    // Ensure amount is a number before formatting
    const num = Number(amount) || 0; 
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

const DUMMY_PRODUCTS = [
    { id: 'p001', name: 'Premium Coffee Beans (1kg)', sku: 'CFB-1K', price: 18.50, stock: 50, sales: 200, revenue: 3700.00 },
    { id: 'p002', name: 'Organic Green Tea (Box of 20)', sku: 'OGT-20', price: 5.99, stock: 120, sales: 500, revenue: 2995.00 },
    { id: 'p003', name: 'Stainless Steel Water Bottle', sku: 'SS-WTR', price: 25.00, stock: 80, sales: 150, revenue: 3750.00 },
    { id: 'p004', name: 'Ergonomic Desk Chair', sku: 'EDC-01', price: 199.99, stock: 10, sales: 5, revenue: 999.95 },
];

const LOCAL_STORAGE_KEY_PRODUCTS = 'sales_inventory_products';
const LOCAL_STORAGE_KEY_SALES = 'sales_inventory_transactions';


// --- LOCAL STORAGE DATA HOOK ---

const useLocalStorageData = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Load Data on Mount and Initialize with Dummy Data
    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
            if (storedProducts) {
                // If data exists, load it
                setProducts(JSON.parse(storedProducts));
            } else {
                // If no data, initialize with dummy data
                localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(DUMMY_PRODUCTS));
                setProducts(DUMMY_PRODUCTS);
            }
        } catch (error) {
            console.error("Error loading data from localStorage:", error);
            setProducts(DUMMY_PRODUCTS); // Fallback to dummy data
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Helper to update localStorage
    const updateLocalStorage = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving data to ${key} in localStorage:`, error);
        }
    };

    // 2. Save Sale & Update Stock
    const saveSale = useCallback(async (saleData, lineItems) => {
        try {
            // --- TRANSACTION 1: Update Products Stock ---
            const newProducts = products.map(p => {
                const itemSold = lineItems.find(item => item.productId === p.id);
                if (itemSold) {
                    const newStock = Math.max(0, (Number(p.stock) || 0) - itemSold.quantity);
                    const newSales = (Number(p.sales) || 0) + itemSold.quantity;
                    const newRevenue = (Number(p.revenue) || 0) + itemSold.totalPrice;
                    return { 
                        ...p, 
                        stock: newStock,
                        sales: newSales,
                        revenue: newRevenue,
                    };
                }
                return p;
            });
            setProducts(newProducts);
            updateLocalStorage(LOCAL_STORAGE_KEY_PRODUCTS, newProducts);

            // --- TRANSACTION 2: Save the new sale transaction ---
            const storedSales = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SALES) || '[]');
            const newSaleId = `S-${Date.now()}`;
            const newTransaction = {
                id: newSaleId,
                ...saleData,
                lineItems,
                timestamp: new Date().toISOString(),
            };
            
            const newStoredSales = [...storedSales, newTransaction];
            updateLocalStorage(LOCAL_STORAGE_KEY_SALES, newStoredSales);

            return true; // Success
        } catch (e) {
            console.error("Error saving sale or updating inventory: ", e);
            return false; // Failure
        }
    }, [products]);


    return {
        products,
        isLoading,
        saveSale,
    };
};


// --- 2. CUSTOMER INFORMATION CARD COMPONENT ---

const CustomerInfoCard = ({ customer, setCustomer }) => {
    const handleChange = (e) => {
        setCustomer(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <UserCircleIcon className="w-5 h-5 mr-2 text-indigo-500" />
                Customer Information
            </h3>
            <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Customer Name"
                className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
                type="text"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                placeholder="Customer ID / Phone Number"
                className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <textarea
                name="notes"
                value={customer.notes}
                onChange={handleChange}
                placeholder="Optional: Customer Notes"
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
    );
};

// --- 3. ADD PRODUCT TO SALE CARD COMPONENT ---

const AddItemCard = ({ products, onAddItem }) => {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    const selectedProduct = useMemo(() => {
        return products.find(p => p.id === selectedProductId);
    }, [products, selectedProductId]);

    const unitPrice = selectedProduct?.price || 0;
    const totalPrice = (unitPrice * quantity);
    const maxStock = selectedProduct?.stock || 0;

    const handleAdd = () => {
        setErrorMessage('');
        if (!selectedProduct) {
            return setErrorMessage("Please select a valid product.");
        }
        if (quantity <= 0) {
            return setErrorMessage("Quantity must be greater than zero.");
        }
        if (quantity > maxStock) {
            return setErrorMessage(`Only ${maxStock} units of ${selectedProduct.name} are available.`);
        }

        const itemToAdd = {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            unitPrice: unitPrice,
            quantity: quantity,
            totalPrice: totalPrice,
            stockBefore: maxStock,
            stockAfter: maxStock - quantity,
        };

        onAddItem(itemToAdd);
        // Reset fields after successful addition
        setSelectedProductId('');
        setQuantity(1);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <ShoppingCartIcon className="w-5 h-5 mr-2 text-green-500" />
                Add Product to Sale
            </h3>

            <select
                value={selectedProductId}
                onChange={(e) => { setSelectedProductId(e.target.value); setErrorMessage(''); }}
                className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="">-- Select Product --</option>
                {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                        {p.name} ({p.sku} | Stock: {p.stock})
                    </option>
                ))}
            </select>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                    type="text"
                    value={`Price: ${formatCurrency(unitPrice)}`}
                    readOnly
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600"
                />
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                    placeholder="Quantity Bought"
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            
            <div className="flex justify-between items-center mb-4 pt-2 border-t border-dashed border-gray-200">
                <span className="font-bold text-md text-gray-700">Total Price:</span>
                <span className="font-extrabold text-xl text-indigo-600">{formatCurrency(totalPrice)}</span>
            </div>

            {errorMessage && (
                <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
            )}

            <button
                onClick={handleAdd}
                className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition disabled:bg-gray-400"
                disabled={!selectedProductId || quantity <= 0 || quantity > maxStock}
            >
                <PlusIcon className="w-5 h-5 inline mr-1" />
                Add Item to Sale
            </button>
        </div>
    );
};

// --- 4. SALES ITEMS TABLE / CARDS SECTION COMPONENT ---

const SalesItemsTable = ({ lineItems, onRemoveItem, onEditItem }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2 text-indigo-500" />
                List of Items in this Sale ({lineItems.length})
            </h3>
            
            {lineItems.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No items added to the current sale.</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-3 py-2 text-left">Product</th>
                            <th className="px-3 py-2 text-right">Price</th>
                            <th className="px-3 py-2 text-right">Qty</th>
                            <th className="px-3 py-2 text-right">Total</th>
                            <th className="px-3 py-2 text-center">Stock</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence initial={false}>
                            {lineItems.map((item) => (
                                <motion.tr
                                    key={item.productId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="text-sm text-gray-800 hover:bg-gray-50 transition"
                                >
                                    <td className="px-3 py-3 font-semibold truncate max-w-[150px]">{item.productName}</td>
                                    <td className="px-3 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                                    <td className="px-3 py-3 text-right">{item.quantity}</td>
                                    <td className="px-3 py-3 text-right font-bold text-indigo-600">{formatCurrency(item.totalPrice)}</td>
                                    <td className="px-3 py-3 text-center text-xs">
                                        <span className="block">{item.stockBefore}</span>
                                        <span className="block text-red-500">({item.stockAfter})</span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-center text-sm font-medium">
                                        {/* Edit logic is complex due to stock, but we include the button */}
                                        <button 
                                            onClick={() => onEditItem(item.productId)} 
                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                            title="Edit Item (Simulated)"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => onRemoveItem(item.productId)} 
                                            className="text-red-600 hover:text-red-900 p-1 ml-1"
                                            title="Remove Item"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            )}
        </div>
    );
};

// --- 5. ORDER SUMMARY CARD COMPONENT ---

const OrderSummaryCard = ({ totals, paymentMethod, setPaymentMethod, amountPaid, setAmountPaid, onCalculateChange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <CalculatorIcon className="w-5 h-5 mr-2 text-teal-500" />
                Order Summary
            </h3>
            
            <div className="space-y-2 border-b pb-3 mb-3">
                <SummaryRow label="Subtotal" value={formatCurrency(totals.subtotal)} color="text-gray-700" />
                <SummaryRow label="Discount" value={formatCurrency(totals.discount)} color="text-red-500" />
                <SummaryRow label="Tax / VAT (5%)" value={formatCurrency(totals.tax)} color="text-gray-700" />
                <SummaryRow label="GRAND TOTAL" value={formatCurrency(totals.grandTotal)} color="text-indigo-600" size="text-xl font-extrabold" />
            </div>

            <select
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
                value={paymentMethod}
            >
                <option value="Cash">Cash</option>
                <option value="POS">POS (Card)</option>
                <option value="Mobile Money">Mobile Money</option>
            </select>
            
            <input
                type="number"
                value={amountPaid === 0 ? '' : amountPaid} // Clear input if 0 for better UX
                onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                placeholder="Amount Paid by Customer"
                className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            <button
                onClick={onCalculateChange}
                className="w-full py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition mb-3"
            >
                Calculate Change
            </button>

            <SummaryRow label="Balance / Change" value={formatCurrency(totals.change)} color={totals.change < 0 ? 'text-red-500' : 'text-green-600'} size="text-lg font-bold" />

        </div>
    );
};

const SummaryRow = ({ label, value, color, size = 'text-md font-medium' }) => (
    <div className="flex justify-between">
        <span className={`${size} text-gray-500`}>{label}</span>
        <span className={`${size} ${color}`}>{value}</span>
    </div>
);


// --- 6. ACTION BUTTONS COMPONENT ---

const ActionButtons = ({ onSave, onCancel, onPrint, isSaleValid, isProcessing }) => {
    // Note: Edit Sale functionality is complex (requires reversing stock, finding transaction) and is simulated.
    return (
        <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100 md:col-span-3">
            <button
                onClick={onSave}
                disabled={!isSaleValid || isProcessing}
                className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
                <ClipboardDocumentCheckIcon className="w-5 h-5 inline mr-1" />
                {isProcessing ? 'Saving...' : 'Save Sale'}
            </button>
            
            <button
                onClick={onCancel}
                className="flex-1 min-w-[120px] py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
            >
                <XMarkIcon className="w-5 h-5 inline mr-1" />
                Discard Sale
            </button>
            
            <button
                onClick={onPrint}
                className="flex-1 min-w-[120px] py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
            >
                <PrinterIcon className="w-5 h-5 inline mr-1" />
                Print Receipt
            </button>
            
             <button
                onClick={() => alert("Edit Sale functionality is simulated. It would require complex stock reversal logic.")}
                className="flex-1 min-w-[120px] py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition"
            >
                <PencilSquareIcon className="w-5 h-5 inline mr-1" />
                Edit Sale
            </button>
        </div>
    );
};


// --- MAIN SALES INVENTORY MANAGEMENT COMPONENT (Parent) ---

const SalesInventoryManagement = () => {
    const { products, isLoading, saveSale } = useLocalStorageData();
    
    // 2. Customer State
    const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' });
    
    // 4. Line Items State
    const [lineItems, setLineItems] = useState([]);

    // 5. Payment State
    const [discount, setDiscount] = useState(0); // Simple fixed discount for demo
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amountPaid, setAmountPaid] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Utility for New Sale (Reset All State)
    const startNewSale = useCallback(() => {
        setCustomer({ name: '', phone: '', notes: '' });
        setLineItems([]);
        setDiscount(0);
        setPaymentMethod('Cash');
        setAmountPaid(0);
    }, []);


    // Aggregated Totals Calculation
    const totals = useMemo(() => {
        const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const appliedDiscount = discount; // In a real app, this would be calculated
        const taxableBase = subtotal - appliedDiscount;
        const taxRate = 0.05; // 5% VAT/Tax
        const tax = taxableBase * taxRate;
        const grandTotal = taxableBase + tax;
        const change = amountPaid - grandTotal;

        return {
            subtotal,
            discount: appliedDiscount,
            tax,
            grandTotal,
            change,
        };
    }, [lineItems, discount, amountPaid]);

    // Sale Validity Check
    const isSaleValid = lineItems.length > 0 && totals.grandTotal > 0 && amountPaid >= totals.grandTotal;

    // Line Item Handlers
    const handleAddItem = (item) => {
        // Simple logic: add item, assumes unique product per entry for simplicity
        setLineItems(prev => [...prev, item]);
    };

    const handleRemoveItem = (productId) => {
        // Removes ALL line items associated with this product ID.
        // In a real app, you might only remove one entry based on a unique transaction ID.
        setLineItems(prev => prev.filter(item => item.productId !== productId));
    };

    // 6. Action Handlers
    const handleSaveSale = async () => {
        if (!isSaleValid) {
            return alert("Cannot save sale: Please add items and ensure the amount paid covers the Grand Total.");
        }
        
        setIsProcessing(true);
        const saleData = {
            customer,
            summary: {
                ...totals,
                paymentMethod,
                amountPaid,
            },
            
        };

        const success = await saveSale(saleData, lineItems);
        setIsProcessing(false);
        
        if (success) {
            alert(`Sale of ${formatCurrency(totals.grandTotal)} successfully saved to local storage! Stock has been updated. Starting new sale.`);
            startNewSale();
        } else {
            alert("Failed to save sale. Check console for details.");
        }
    };
    
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-semibold text-indigo-600">
            <ArrowPathIcon className="w-6 h-6 mr-2 animate-spin" /> Loading Inventory...
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* 1. Header */}
                <header className="mb-6 pb-4 border-b-2 border-indigo-500">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center">
                        <TagIcon className="w-8 h-8 mr-3 text-indigo-600" />
                        Sales Inventory (Point of Sale)
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={startNewSale} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">
                            <PlusIcon className="w-4 h-4 inline mr-1" /> New Sale
                        </button>
                        <button onClick={() => alert("Functionality to view all sales is not implemented yet. Sales are stored in local storage.")} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 transition">
                            <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" /> View All Sales
                        </button>
                        <button onClick={() => alert("Print functionality simulated.")} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 transition">
                            <PrinterIcon className="w-4 h-4 inline mr-1" /> Print Receipt
                        </button>
                    </div>
                    <p className="text-xs mt-2 text-gray-500 flex items-center">
                        <ServerStackIcon className="w-4 h-4 mr-1 text-red-500" /> Data Storage: Local Storage (Dummy Data Initialized)
                    </p>
                </header>

                {/* 2 & 3. Top Section: Customer and Add Item (Horizontal on Large Screens) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <CustomerInfoCard customer={customer} setCustomer={setCustomer} />
                    <AddItemCard products={products} onAddItem={handleAddItem} />
                </div>

                {/* 4. Sales Items Table (Full Width) */}
                <div className="mb-6">
                    <SalesItemsTable 
                        lineItems={lineItems} 
                        onRemoveItem={handleRemoveItem} 
                        onEditItem={(id) => alert(`Editing item ${id} is a complex stock adjustment feature, which is currently simulated.`)}
                    />
                </div>

                {/* 5 & 6. Bottom Section: Summary and Actions (Horizontal on Large Screens) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Summary takes 2/3 width on large screens */}
                    <div className="md:col-span-2">
                        <OrderSummaryCard 
                            totals={totals}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            amountPaid={amountPaid}
                            setAmountPaid={setAmountPaid}
                            onCalculateChange={() => totals.change} // Calculation happens on state change
                        />
                    </div>
                    
                    {/* Action Buttons take 1/3 width on large screens */}
                    <div className="md:col-span-1">
                        <ActionButtons 
                            onSave={handleSaveSale}
                            onCancel={startNewSale}
                            onPrint={() => alert("Simulating print...")}
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