import React, { useState, useMemo } from 'react';
import { ShoppingCartIcon, PlusIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from '../../lib/utils';

const AddItemCard = ({ products, onAddItem }) => {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');

    const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);

    const handleAdd = () => {
        setError('');
        if (!selectedProduct) return setError("Select a product.");
        if (quantity <= 0) return setError("Invalid quantity.");
        if (quantity > selectedProduct.stock) return setError(`Only ${selectedProduct.stock} available.`);

        onAddItem({
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            unitPrice: selectedProduct.price,
            quantity,
            totalPrice: selectedProduct.price * quantity,
            stockBefore: selectedProduct.stock,
            stockAfter: selectedProduct.stock - quantity,
        });
        
        setSelectedProductId('');
        setQuantity(1);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <ShoppingCartIcon className="w-5 h-5 mr-2 text-green-500" />
                Add Product
            </h3>
            <select
                value={selectedProductId}
                onChange={(e) => { setSelectedProductId(e.target.value); setError(''); }}
                className="w-full p-2 border border-gray-300 rounded-lg mb-3"
            >
                <option value="">-- Select Product --</option>
                {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                        {p.name} (Stock: {p.stock})
                    </option>
                ))}
            </select>
            
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-lg mb-3"
            />
            
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            
            <button onClick={handleAdd} className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <PlusIcon className="w-5 h-5 inline mr-1" /> Add Item
            </button>
        </div>
    );
};
export default AddItemCard;
