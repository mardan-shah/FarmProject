import React from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, Droplet, DollarSign, Download, ShoppingCart, FileText, Edit, Trash2, X } from 'lucide-react';

export default function MilkSale() {
    const { recentSales, monthlyTotals } = usePage().props;
    const [successMessage, setSuccessMessage] = useState('');
    const [editingSale, setEditingSale] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        sale_date: new Date().toISOString().split('T')[0],
        milk_kg: '',
        sale_amount: '',
        notes: '',
    });

    const { data: editData, setData: setEditData, put: edit, processing: editProcessing } = useForm({
        sale_date: '',
        milk_kg: '',
        sale_amount: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('milk-sale.store'), {
            onSuccess: () => {
                setSuccessMessage('Sale recorded successfully!');
                reset('milk_kg', 'sale_amount', 'notes');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
            onFinish: () => reset('milk_kg', 'sale_amount', 'notes'),
        });
    };

    const startEdit = (sale) => {
        setEditingSale(sale);
        setEditData({
            sale_date: sale.sale_date,
            milk_kg: sale.milk_kg,
            sale_amount: sale.sale_amount,
            notes: sale.notes || '',
        });
    };

    const cancelEdit = () => {
        setEditingSale(null);
        setEditData({
            sale_date: '',
            milk_kg: '',
            sale_amount: '',
            notes: '',
        });
    };

    const updateSale = (e) => {
        e.preventDefault();
        edit(route('milk-sale.update', editingSale.id), {
            onSuccess: () => {
                setSuccessMessage('Sale updated successfully!');
                cancelEdit();
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                console.error('Edit errors:', errors);
            },
        });
    };

    const deleteSale = (saleId) => {
        if (confirm('Are you sure you want to delete this sale record?')) {
            router.delete(route('milk-sale.destroy', saleId), {
                onSuccess: () => {
                    setSuccessMessage('Sale deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                },
                onError: (errors) => {
                    console.error('Delete errors:', errors);
                },
            });
        }
    };

    const downloadReport = async (period) => {
        try {
            const response = await fetch(`/milk-sale/report/${period}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `milk-sale-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error downloading report:', error);
            window.open(`/milk-sale/report/${period}`, '_blank');
        }
    };

    const isFormValid = data.sale_date && data.milk_kg && data.sale_amount;

    return (
        <DashboardLayout title="Milk Sale">
            <Head title="Milk Sale" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Form Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ShoppingCart className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Record Milk Sale</h2>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {successMessage && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-600">{successMessage}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date Picker */}
                                <div>
                                    <label htmlFor="sale_date" className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>Sale Date</span>
                                        </div>
                                    </label>
                                    <input
                                        type="date"
                                        id="sale_date"
                                        value={data.sale_date}
                                        onChange={(e) => setData('sale_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    />
                                    {errors.sale_date && (
                                        <p className="mt-2 text-sm text-red-600">{errors.sale_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Milk Sold Input */}
                                <div>
                                    <label htmlFor="milk_kg" className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Droplet className="w-4 h-4 text-gray-400" />
                                            <span>Milk Sold (KG)</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        id="milk_kg"
                                        value={data.milk_kg}
                                        onChange={(e) => setData('milk_kg', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        placeholder="Enter milk sold in kg"
                                    />
                                    {errors.milk_kg && (
                                        <p className="mt-2 text-sm text-red-600">{errors.milk_kg}</p>
                                    )}
                                </div>

                                {/* Sale Amount Input */}
                                <div>
                                    <label htmlFor="sale_amount" className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span>Sale Amount ($)</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        id="sale_amount"
                                        value={data.sale_amount}
                                        onChange={(e) => setData('sale_amount', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        placeholder="Enter sale amount"
                                    />
                                    {errors.sale_amount && (
                                        <p className="mt-2 text-sm text-red-600">{errors.sale_amount}</p>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Any additional notes..."
                                />
                                {errors.notes && (
                                    <p className="mt-2 text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>

                            {/* Save Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={!isFormValid || processing}
                                    className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>Record Sale</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary and Reports */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Monthly Summary */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Monthly Summary</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                            <Droplet className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Milk Sold (This Month)
                                                </dt>
                                                <dd className="text-2xl font-bold text-blue-600">
                                                    {parseFloat(monthlyTotals?.total_milk || 0).toFixed(2)} KG
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                            <DollarSign className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Sale Amount (This Month)
                                                </dt>
                                                <dd className="text-2xl font-bold text-green-600">
                                                    ${parseFloat(monthlyTotals?.total_amount || 0).toFixed(2)}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { period: 'weekly', label: 'Weekly Report' },
                                        { period: 'monthly', label: 'Monthly Report' },
                                        { period: '3-month', label: '3-Month Report' },
                                        { period: '6-month', label: '6-Month Report' },
                                        { period: '12-month', label: '12-Month Report' },
                                    ].map((report) => (
                                        <button
                                            key={report.period}
                                            onClick={() => downloadReport(report.period)}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <Download className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">{report.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Sales Records */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Recent Sales Records</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="overflow-hidden border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Milk (KG)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount ($)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price/KG
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Notes
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentSales && recentSales.length > 0 ? (
                                            recentSales.map((sale) => {
                                                const pricePerKg = sale.milk_kg > 0 ? (sale.sale_amount / sale.milk_kg).toFixed(2) : '0.00';
                                                return (
                                                    <tr key={sale.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(sale.sale_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {parseFloat(sale.milk_kg).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ${parseFloat(sale.sale_amount).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ${pricePerKg}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {sale.notes || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => startEdit(sale)}
                                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteSale(sale.id)}
                                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                    No sales records found. Start by adding your first milk sale record above.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingSale && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Edit Milk Sale</h3>
                                <button
                                    onClick={cancelEdit}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={updateSale} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sale Date
                                    </label>
                                    <input
                                        type="date"
                                        value={editData.sale_date}
                                        onChange={(e) => setEditData('sale_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Milk Sold (KG)
                                    </label>
                                    <input
                                        type="number"
                                        value={editData.milk_kg}
                                        onChange={(e) => setEditData('milk_kg', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter milk sold in kg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sale Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={editData.sale_amount}
                                        onChange={(e) => setEditData('sale_amount', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter sale amount"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={editData.notes}
                                        onChange={(e) => setEditData('notes', e.target.value)}
                                        rows={3}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Any additional notes..."
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
                                    >
                                        {editProcessing ? 'Updating...' : 'Update Sale'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
