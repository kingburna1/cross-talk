import React from 'react';
import { CalculatorIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from '../../lib/utils';

const OrderSummaryCard = ({ totals, setPaymentMethod, setAmountPaid }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <CalculatorIcon className="w-5 h-5 mr-2 text-teal-500" />
                Summary
            </h3>
            <div className="space-y-2 mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                <div className="flex justify-between text-xl font-bold text-indigo-600"><span>Total</span><span>{formatCurrency(totals.grandTotal)}</span></div>
            </div>
            <select onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded-lg mb-3">
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
            </select>
            <input 
                type="number" 
                placeholder="Amount Paid" 
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
            />
            <div className="mt-4 font-bold text-lg">
                Change: {formatCurrency(totals.change)}
            </div>
        </div>
    );
};
export default OrderSummaryCard;
