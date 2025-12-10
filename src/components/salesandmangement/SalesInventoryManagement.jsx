'use client'
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast, showConfirmToast } from "../../lib/toast";
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
    const num = Number(amount) || 0; 
    return new Intl.NumberFormat("fr-CM", {
        style: "currency",
        currency: "XAF",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};


// --- DATABASE HOOK ---

const useDatabaseProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/products`,
                    { credentials: "include" }
                );

                if (!res.ok) {
                    console.error("Failed to fetch products");
                    setIsLoading(false);
                    return;
                }

                const dbProducts = await res.json();
                
                // Map products to POS format
                const mapped = dbProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    sku: p.name.substring(0, 10).toUpperCase(),
                    price: p.sellPrice || 0,
                    stock: p.qtyLeft || 0,
                }));

                setProducts(mapped);
            } catch (err) {
                console.error("Network error loading products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    const saveSale = useCallback(async (saleData, lineItems) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"}/api/sales`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ ...saleData, lineItems }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save sale");
            }

            const result = await response.json();
            const savedSale = result.sale || result;
            const lowStockNotifications = result.lowStockNotifications || [];
            
            // Trigger notification refresh event
            window.dispatchEvent(new CustomEvent('newNotificationCreated'));
            
            // Show toast notifications for low stock items
            if (lowStockNotifications.length > 0) {
                lowStockNotifications.forEach(notification => {
                    showWarningToast(notification.message);
                });
            }
            
            // Update local products stock
            setProducts(prev => prev.map(p => {
                const itemSold = lineItems.find(item => item.productId === p.id);
                if (itemSold) {
                    return { ...p, stock: Math.max(0, p.stock - itemSold.quantity) };
                }
                return p;
            }));

            return { success: true, sale: savedSale, lowStockNotifications };
        } catch (e) {
            console.error("Error saving sale:", e);
            return { success: false, error: e.message };
        }
    }, []);

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
                                    key={item.lineItemId}
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
                                            onClick={() => onEditItem(item.lineItemId)} 
                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                            title="Edit Item (Simulated)"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => onRemoveItem(item.lineItemId)} 
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

const generateReceiptPDF = (saleData, lineItems, totals) => {
    const { customer, summary } = saleData;
    const date = new Date().toLocaleString('fr-CM', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Africa/Douala'
    });
    
    // Create receipt HTML
    const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Sales Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .logo { width: 80px; height: 80px; margin: 0 auto 10px; }
                .company-name { font-size: 24px; font-weight: bold; color: #333; margin: 10px 0; }
                .receipt-title { font-size: 20px; color: #666; margin-top: 10px; }
                .info-section { margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; padding: 5px 0; }
                .label { font-weight: bold; color: #555; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th { background: #f0f0f0; padding: 10px; text-align: left; border-bottom: 2px solid #333; }
                td { padding: 10px; border-bottom: 1px solid #ddd; }
                .total-row { font-weight: bold; background: #f9f9f9; }
                .grand-total { font-size: 18px; color: #333; background: #e8e8e8; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #333; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">
                    <img src="/image3.png" alt="Company Logo" style="width: 80px; height: 80px; object-fit: contain;" />
                </div>
                <div class="company-name">Cross-Talk Supermarket</div>
                <div class="receipt-title">SALES RECEIPT</div>
            </div>
            
            <div class="info-section">
                <div class="info-row">
                    <span class="label">Date:</span>
                    <span>${date}</span>
                </div>
                <div class="info-row">
                    <span class="label">Customer:</span>
                    <span>${customer.name || 'Walk-in Customer'}</span>
                </div>
                ${customer.phone ? `<div class="info-row"><span class="label">Phone:</span><span>${customer.phone}</span></div>` : ''}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th style="text-align: right;">Unit Price</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${lineItems.map(item => `
                        <tr>
                            <td>${item.productName}</td>
                            <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
                            <td style="text-align: center;">${item.quantity}</td>
                            <td style="text-align: right;">${formatCurrency(item.totalPrice)}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="3">Subtotal:</td>
                        <td style="text-align: right;">${formatCurrency(totals.subtotal)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3">Discount:</td>
                        <td style="text-align: right;">-${formatCurrency(totals.discount)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3">Tax (5%):</td>
                        <td style="text-align: right;">${formatCurrency(totals.tax)}</td>
                    </tr>
                    <tr class="grand-total">
                        <td colspan="3"><strong>GRAND TOTAL:</strong></td>
                        <td style="text-align: right;"><strong>${formatCurrency(totals.grandTotal)}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div class="info-section">
                <div class="info-row">
                    <span class="label">Payment Method:</span>
                    <span>${summary.paymentMethod}</span>
                </div>
                <div class="info-row">
                    <span class="label">Amount Paid:</span>
                    <span>${formatCurrency(summary.amountPaid)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Change:</span>
                    <span>${formatCurrency(totals.change)}</span>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for your business!</p>
                <p style="font-size: 12px;">This is a computer-generated receipt.</p>
            </div>
        </body>
        </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
        showWarningToast('Please allow pop-ups to print receipts');
        return;
    }
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 500);
};

const ActionButtons = ({ onSave, onCancel, onPrint, onEdit, isSaleValid, isProcessing }) => {
    return (
        <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100 md:col-span-3">
            <button
                onClick={onSave}
                disabled={!isSaleValid || isProcessing}
                className="flex-1 min-w-[120px] py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <ClipboardDocumentCheckIcon className="w-5 h-5 inline mr-1" />
                {isProcessing ? 'Saving...' : 'Save Sale'}
            </button>
            
            <button
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 min-w-[120px] py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition disabled:bg-gray-400"
            >
                <XMarkIcon className="w-5 h-5 inline mr-1" />
                Discard Sale
            </button>
            
            <button
                onClick={onPrint}
                disabled={!isSaleValid}
                className="flex-1 min-w-[120px] py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition disabled:bg-gray-400"
            >
                <PrinterIcon className="w-5 h-5 inline mr-1" />
                Print Receipt
            </button>
            
            <button
                onClick={onEdit}
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
    const router = useRouter();
    const { products, isLoading, saveSale } = useDatabaseProducts();
    
    // 2. Customer State
    const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' });
    
    // 4. Line Items State
    const [lineItems, setLineItems] = useState([]);

    // 5. Payment State
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amountPaid, setAmountPaid] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentSaleId, setCurrentSaleId] = useState(null);
    
    // Utility for New Sale (Reset All State)
    const startNewSale = useCallback(() => {
        setCustomer({ name: '', phone: '', notes: '' });
        setLineItems([]);
        setDiscount(0);
        setPaymentMethod('Cash');
        setAmountPaid(0);
        setCurrentSaleId(null);
    }, []);


    // Aggregated Totals Calculation
    const totals = useMemo(() => {
        const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const appliedDiscount = discount;
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
        // Add unique lineItemId to prevent duplicate keys
        const lineItemWithId = { ...item, lineItemId: Date.now() + Math.random() };
        setLineItems(prev => [...prev, lineItemWithId]);
    };

    const handleRemoveItem = (lineItemId) => {
        setLineItems(prev => prev.filter(item => item.lineItemId !== lineItemId));
    };

    const handleEditItem = (lineItemId) => {
        // For edit, we remove and let user re-add
        const item = lineItems.find(i => i.lineItemId === lineItemId);
        if (item) {
            showConfirmToast(
                `Remove ${item.productName} so you can re-add it with different quantity?`,
                () => handleRemoveItem(lineItemId)
            );
        }
    };

    // 6. Action Handlers
    const handleSaveSale = async () => {
        if (!isSaleValid) {
            showErrorToast("Cannot save sale: Please add items and ensure the amount paid covers the Grand Total.");
            return;
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

        const result = await saveSale(saleData, lineItems);
        setIsProcessing(false);
        
        if (result.success) {
            showSuccessToast(`Sale of ${formatCurrency(totals.grandTotal)} successfully saved! Stock has been updated.`);
            setCurrentSaleId(result.sale._id);
            // Don't reset immediately, allow print first
            setTimeout(startNewSale, 1000);
        } else {
            showErrorToast(`Failed to save sale: ${result.error}`);
        }
    };

    const handlePrintReceipt = () => {
        if (!isSaleValid) {
            showWarningToast("Cannot print: Please complete the sale first.");
            return;
        }
        
        const saleData = {
            customer,
            summary: {
                ...totals,
                paymentMethod,
                amountPaid,
            },
        };
        
        generateReceiptPDF(saleData, lineItems, totals);
    };

    const handleDiscardSale = () => {
        if (lineItems.length > 0) {
            showConfirmToast(
                "Are you sure you want to discard this sale? All items will be removed.",
                () => startNewSale()
            );
        } else {
            startNewSale();
        }
    };
    
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-semibold text-indigo-600">
            <ArrowPathIcon className="w-6 h-6 mr-2 animate-spin" /> Loading Products...
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
                        <button onClick={() => router.push('/dashboard/sales')} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 transition">
                            <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" /> View All Sales
                        </button>
                    </div>
                    <p className="text-xs mt-2 text-gray-500 flex items-center">
                        <ServerStackIcon className="w-4 h-4 mr-1 text-green-500" /> Data Storage: MongoDB Database
                    </p>
                </header>

                {/* 2 & 3. Top Section: Customer and Add Item */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <CustomerInfoCard customer={customer} setCustomer={setCustomer} />
                    <AddItemCard products={products} onAddItem={handleAddItem} />
                </div>

                {/* 4. Sales Items Table */}
                <div className="mb-6">
                    <SalesItemsTable 
                        lineItems={lineItems} 
                        onRemoveItem={handleRemoveItem} 
                        onEditItem={handleEditItem}
                    />
                </div>

                {/* 5 & 6. Bottom Section: Summary and Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <OrderSummaryCard 
                            totals={totals}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            amountPaid={amountPaid}
                            setAmountPaid={setAmountPaid}
                            onCalculateChange={() => totals.change}
                        />
                    </div>
                    
                    <div className="md:col-span-1">
                        <ActionButtons 
                            onSave={handleSaveSale}
                            onCancel={handleDiscardSale}
                            onPrint={handlePrintReceipt}
                            onEdit={() => showInfoToast("Edit functionality: Modify quantities or remove items above, then save again.")}
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