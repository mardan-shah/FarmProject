import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Calendar, Search, X, Package, TrendingUp } from 'lucide-react';

export default function Silage() {
    const { props } = usePage();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newSilage, setNewSilage] = useState({ date: '', amount: '' });
    const [newUsage, setNewUsage] = useState({ date: '', amount: '' });
    
    const silages = props.feeds || [];
    const totalSilageMade = parseFloat(props.totalFeedMade) || 0;

    const handleAddSilage = () => {
        if (newSilage.date && newSilage.amount) {
            router.post('/silage', {
                date: newSilage.date,
                amount: parseFloat(newSilage.amount),
                type: 'made'
            }, {
                onSuccess: () => {
                    setNewSilage({ date: '', amount: '' });
                    setShowModal(false);
                }
            });
        }
    };

    const handleAddUsage = () => {
        if (newUsage.date && newUsage.amount) {
            router.post('/silage', {
                date: newUsage.date,
                amount: parseFloat(newUsage.amount),
                type: 'used'
            }, {
                onSuccess: () => {
                    setNewUsage({ date: '', amount: '' });
                }
            });
        }
    };

    const handleDeleteSilage = (silageId) => {
        if (confirm('Are you sure you want to delete this silage record?')) {
            router.delete(`/silage/${silageId}`);
        }
    };

    const filteredSilages = silages.filter(silage => 
        silage.date.includes(searchTerm) ||
        silage.amount.toString().includes(searchTerm)
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <DashboardLayout title="Silage Management">
            <Head title="Silage Management" />
            
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Silage Management</h2>
                            <p className="text-sm text-gray-500">Track silage production and usage</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search silage records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Total Silage Card */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                     onClick={() => setShowModal(true)}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-lg font-medium">Total Silage Made</p>
                            <p className="text-4xl font-bold mt-2">{totalSilageMade.toFixed(2)} kgs</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full p-4">
                            <Package className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Silage Usage Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Silage Usage</h3>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Silage Used Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={newUsage.date}
                                    onChange={(e) => setNewUsage({...newUsage, date: e.target.value})}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount Used (kgs) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newUsage.amount}
                                    onChange={(e) => setNewUsage({...newUsage, amount: e.target.value})}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter amount used in kgs"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                onClick={handleAddUsage}
                                disabled={!newUsage.date || !newUsage.amount}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                            >
                                Add Silage Usage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Silage List Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Silage Records</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount (kgs)
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSilages.length > 0 ? (
                                    filteredSilages.map((silage) => (
                                        <tr key={silage.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(silage.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    silage.type === 'made' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {silage.type === 'made' ? 'Made' : 'Used'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {parseFloat(silage.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => handleDeleteSilage(silage.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <Package className="w-12 h-12 text-gray-400 mb-4" />
                                                <p className="text-gray-500">
                                                    No silage records found
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {searchTerm ? 'Try adjusting your search' : 'Add your first silage record to get started'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Silage Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
                        
                        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Add Silage Made</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={newSilage.date}
                                        onChange={(e) => setNewSilage({...newSilage, date: e.target.value})}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount (kgs) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newSilage.amount}
                                        onChange={(e) => setNewSilage({...newSilage, amount: e.target.value})}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Enter amount in kgs"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSilage}
                                    disabled={!newSilage.date || !newSilage.amount}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                                >
                                    Add Silage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
