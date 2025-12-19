'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { showSuccessToast, showErrorToast, showConfirmToast } from '../../../src/lib/toast'
import {
    MagnifyingGlassIcon,
    EyeIcon,
    TrashIcon,
    XMarkIcon,
    CheckCircleIcon,
    BanknotesIcon,
    ShoppingBagIcon,
    CalendarDaysIcon,
    UserIcon,
    PhoneIcon,
    CreditCardIcon,
    ReceiptRefundIcon,
} from '@heroicons/react/24/outline'

const SalesPage = () => {
    const [sales, setSales] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedSale, setSelectedSale] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        fetchSales()
    }, [])

    const fetchSales = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/sales`,
                { credentials: "include" }
            )

            if (!res.ok) {
                console.error("Failed to fetch sales")
                setIsLoading(false)
                return
            }

            const data = await res.json()
            setSales(data)
        } catch (err) {
            console.error("Network error loading sales:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteSale = async (id) => {
        showConfirmToast(
            'Are you sure you want to delete this sale? Stock will be restored.',
            async () => {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/sales/${id}`,
                        {
                            method: "DELETE",
                            credentials: "include"
                        }
                    )

                    if (!res.ok) {
                        showErrorToast('Failed to delete sale')
                        return
                    }

                    showSuccessToast('Sale deleted and stock restored successfully')
                    fetchSales()
                    setSelectedSale(null)
                } catch (err) {
                    console.error("Error deleting sale:", err)
                    showErrorToast('Error deleting sale')
                }
            }
        )
    }

    const formatCurrency = (amount) => {
        const num = Number(amount) || 0
        return new Intl.NumberFormat("fr-CM", {
            style: "currency",
            currency: "XAF",
            minimumFractionDigits: 0,
        }).format(num)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('fr-CM', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Africa/Douala'
        })
    }

    const filteredSales = sales.filter(sale => {
        const matchesSearch = 
            sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.customer?.phone?.includes(searchTerm) ||
            sale._id.includes(searchTerm)
        
        const matchesFilter = filterStatus === 'all' || sale.status === filterStatus

        return matchesSearch && matchesFilter
    })

    const stats = {
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, s) => sum + (s.summary?.grandTotal || 0), 0),
        completedSales: sales.filter(s => s.status === 'completed').length,
        todaySales: sales.filter(s => {
            const today = new Date().toDateString()
            return new Date(s.createdAt).toDateString() === today
        }).length
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading sales...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <ShoppingBagIcon className="w-8 h-8 mr-3 text-indigo-600" />
                        Sales History
                    </h1>
                    <p className="text-gray-600 mt-1">View and manage all sales transactions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Sales</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                            </div>
                            <ShoppingBagIcon className="w-10 h-10 text-indigo-500 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                            </div>
                            <BanknotesIcon className="w-10 h-10 text-green-500 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedSales}</p>
                            </div>
                            <CheckCircleIcon className="w-10 h-10 text-blue-500 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Today's Sales</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.todaySales}</p>
                            </div>
                            <CalendarDaysIcon className="w-10 h-10 text-purple-500 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by customer name, phone, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSales.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No sales found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSales.map((sale) => (
                                        <motion.tr
                                            key={sale._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(sale.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {sale.customer?.name || 'Walk-in Customer'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {sale.customer?.phone || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {sale.lineItems?.length || 0} items
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatCurrency(sale.summary?.grandTotal)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {sale.summary?.paymentMethod || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    sale.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {sale.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setSelectedSale(sale)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="w-5 h-5 inline" />
                                                </button>
                                                <button
                                                    onClick={() => deleteSale(sale._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete Sale"
                                                >
                                                    <TrashIcon className="w-5 h-5 inline" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Sale Detail Modal */}
            <AnimatePresence>
                {selectedSale && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedSale(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Sale Details</h2>
                                    <button
                                        onClick={() => setSelectedSale(null)}
                                        className="text-white hover:text-gray-200"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-indigo-100 text-sm mt-1">
                                    ID: {selectedSale._id}
                                </p>
                            </div>

                            <div className="p-6">
                                {/* Customer Info */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                                        <UserIcon className="w-5 h-5 mr-2 text-indigo-600" />
                                        Customer Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-medium">{selectedSale.customer?.name || 'Walk-in Customer'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{selectedSale.customer?.phone || '-'}</p>
                                        </div>
                                        {selectedSale.customer?.notes && (
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-600">Notes</p>
                                                <p className="font-medium">{selectedSale.customer.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Line Items */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-lg mb-3">Items Purchased</h3>
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedSale.lineItems?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {item.productName}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                                                            {formatCurrency(item.unitPrice)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                                                            {formatCurrency(item.totalPrice)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                                        <ReceiptRefundIcon className="w-5 h-5 mr-2 text-indigo-600" />
                                        Payment Summary
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">{formatCurrency(selectedSale.summary?.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-red-600">
                                            <span>Discount:</span>
                                            <span className="font-medium">-{formatCurrency(selectedSale.summary?.discount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax (5%):</span>
                                            <span className="font-medium">{formatCurrency(selectedSale.summary?.tax)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t-2 border-gray-300 text-lg">
                                            <span className="font-bold">Grand Total:</span>
                                            <span className="font-bold text-indigo-600">
                                                {formatCurrency(selectedSale.summary?.grandTotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                                            <span className="text-gray-600">Payment Method:</span>
                                            <span className="font-medium">{selectedSale.summary?.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Amount Paid:</span>
                                            <span className="font-medium">{formatCurrency(selectedSale.summary?.amountPaid)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Change:</span>
                                            <span className="font-medium text-green-600">
                                                {formatCurrency(selectedSale.summary?.change)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status and Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Status</p>
                                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                                            selectedSale.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            selectedSale.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedSale.status}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Date</p>
                                        <p className="font-medium text-sm">{formatDate(selectedSale.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        deleteSale(selectedSale._id)
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    <TrashIcon className="w-4 h-4 inline mr-1" />
                                    Delete Sale
                                </button>
                                <button
                                    onClick={() => setSelectedSale(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SalesPage
