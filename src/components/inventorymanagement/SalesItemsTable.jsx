import React from 'react';
import { ClipboardDocumentCheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from '../../lib/utils';

const SalesItemsTable = ({ lineItems, onRemoveItem }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2 text-indigo-500" />
                Cart ({lineItems.length})
            </h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-3 py-2"></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {lineItems.map((item) => (
                        <tr key={item.productId}>
                            <td className="px-3 py-2">{item.productName}</td>
                            <td className="px-3 py-2 text-right">{item.quantity}</td>
                            <td className="px-3 py-2 text-right">{formatCurrency(item.totalPrice)}</td>
                            <td className="px-3 py-2 text-right">
                                <button onClick={() => onRemoveItem(item.productId)} className="text-red-600 hover:text-red-900">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default SalesItemsTable;
