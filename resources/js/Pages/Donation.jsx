import React, { useState } from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Calendar, DollarSign, Edit2, Trash2, Search } from 'lucide-react';

export default function Donation({ donations }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newDonation, setNewDonation] = useState({
        amount: '',
        date: '',
        notes: ''
    });
    const [editingDonation, setEditingDonation] = useState(null);

    const filteredDonations = donations.filter(donation =>
        donation.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (donation.notes && donation.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddDonation = () => {
        if (newDonation.amount && newDonation.date) {
            router.post('/donations', newDonation, {
                onSuccess: () => {
                    setNewDonation({ amount: '', date: '', notes: '' });
                    setShowAddForm(false);
                }
            });
        }
    };

    const handleEditDonation = (donation) => {
        setEditingDonation(donation);
        setNewDonation({
            amount: donation.amount,
            date: donation.date,
            notes: donation.notes || ''
        });
        setShowAddForm(true);
    };

    const handleUpdateDonation = () => {
        if (editingDonation && newDonation.amount && newDonation.date) {
            router.put(`/donations/${editingDonation.id}`, newDonation, {
                onSuccess: () => {
                    setEditingDonation(null);
                    setNewDonation({ amount: '', date: '', notes: '' });
                    setShowAddForm(false);
                }
            });
        }
    };

    const handleDeleteDonation = (id) => {
        if (confirm('Are you sure you want to delete this donation?')) {
            router.delete(`/donations/${id}`);
        }
    };

    return (
        <DashboardLayout title="Donations">
            <Head title="Donations" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
                                <p className="mt-2 text-gray-600">Track and manage donations received</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddForm(true);
                                    setEditingDonation(null);
                                    setNewDonation({ amount: '', date: '', notes: '' });
                                }}
                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Donation
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search donations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Add/Edit Form */}
                    {showAddForm && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {editingDonation ? 'Edit Donation' : 'Add New Donation'}
                                    </h3>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount Received <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={newDonation.amount}
                                                onChange={(e) => setNewDonation({...newDonation, amount: e.target.value})}
                                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="date"
                                                value={newDonation.date}
                                                onChange={(e) => setNewDonation({...newDonation, date: e.target.value})}
                                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes
                                        </label>
                                        <textarea
                                            value={newDonation.notes}
                                            onChange={(e) => setNewDonation({...newDonation, notes: e.target.value})}
                                            rows={3}
                                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            placeholder="Additional notes about this donation..."
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0 mt-6">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingDonation ? handleUpdateDonation : handleAddDonation}
                                        disabled={!newDonation.amount || !newDonation.date}
                                        className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                                    >
                                        {editingDonation ? 'Update Donation' : 'Save Donation'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Donations Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notes
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredDonations.length > 0 ? (
                                        filteredDonations.map((donation) => (
                                            <tr key={donation.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <DollarSign className="w-4 h-4 text-green-500 mr-2" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            ${parseFloat(donation.amount).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900">{donation.date}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600">
                                                        {donation.notes || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button 
                                                            onClick={() => handleEditDonation(donation)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteDonation(donation.id)}
                                                            className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <DollarSign className="w-12 h-12 text-gray-400 mb-4" />
                                                    <p className="text-gray-500">
                                                        No donations found
                                                    </p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {searchTerm ? 'Try adjusting your search' : 'Add your first donation to get started'}
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
            </div>
        </DashboardLayout>
    );
}
