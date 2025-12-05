import React from 'react';
import { UserCircleIcon } from "@heroicons/react/24/outline";

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
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Customer Name"
                className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-indigo-500"
            />
            <input
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-indigo-500"
            />
            <textarea
                name="notes"
                value={customer.notes}
                onChange={handleChange}
                placeholder="Notes..."
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-lg"
            />
        </div>
    );
};
export default CustomerInfoCard;
