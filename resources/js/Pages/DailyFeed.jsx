import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Calendar, DollarSign, Search, X, Package, TrendingUp } from 'lucide-react';

export default function DailyFeed() {
    const { props } = usePage();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newFeed, setNewFeed] = useState({ date: '', amount: '' });
    const [newUsage, setNewUsage] = useState({ date: '', amount: '' });
    
    const feeds = props.feeds || [];
    const totalFeed = parseFloat(props.totalFeedMade) || 0;

    const handleAddFeed = () => {
        if (newFeed.date && newFeed.amount) {
            router.post('/daily-feed', {
                date: newFeed.date,
                amount: parseFloat(newFeed.amount),
                type: 'made'
            }, {
                onSuccess: () => {
                    setNewFeed({ date: '', amount: '' });
                    setShowModal(false);
                }
            });
        }
    };

    const handleAddUsage = () => {
        if (newUsage.date && newUsage.amount) {
            router.post('/daily-feed', {
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

    const handleDeleteFeed = (feedId) => {
        if (confirm('Are you sure you want to delete this feed record?')) {
            router.delete(`/daily-feed/${feedId}`);
        }
    };

    const filteredFeeds = feeds.filter(feed => 
        feed.date.includes(searchTerm) ||
        feed.amount.toString().includes(searchTerm)
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <DashboardLayout title="Daily Feed">
            <Head title="Daily Feed" />
            
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Daily Feed Management</h2>
                            <p className="text-sm text-gray-500">Track daily feed consumption</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search feeds..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Total Feed Card */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                     onClick={() => setShowModal(true)}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-lg font-medium">Total Feed Made</p>
                            <p className="text-4xl font-bold mt-2">{totalFeed.toFixed(2)} kgs</p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-full p-4">
                            <Package className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Feed Usage Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Daily Feed Usage</h3>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Feed Used Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={newUsage.date}
                                    onChange={(e) => setNewUsage({...newUsage, date: e.target.value})}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                                Add Feed Usage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feed List Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount (kgs)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredFeeds.length > 0 ? (
                                    filteredFeeds.map((feed) => (
                                        <tr key={feed.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    feed.type === 'made' 
                                                        ? 'bg-orange-100 text-orange-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {feed.type === 'made' ? 'Made' : 'Used'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-orange-500" />
                                                    {new Date(feed.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div className="flex items-center space-x-2">
                                                    <Package className="w-4 h-4 text-green-500" />
                                                    {parseFloat(feed.amount).toFixed(2)} kgs
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center space-x-3">
                                                    <button 
                                                        onClick={() => handleDeleteFeed(feed.id)}
                                                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                                    >
                                                        <X className="w-4 h-4" />
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
                                                <Package className="w-12 h-12 text-gray-400 mb-4" />
                                                <p className="text-gray-500">No feed records found</p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {searchTerm ? 'Try adjusting your search' : 'Click card above to add total feed or use form below to add feed usage'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Feed Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Add Total Feed Made</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Feed Made Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={newFeed.date}
                                        onChange={(e) => setNewFeed({...newFeed, date: e.target.value})}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Feed Amount (kgs) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newFeed.amount}
                                        onChange={(e) => setNewFeed({...newFeed, amount: e.target.value})}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Enter total feed amount in kgs"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddFeed}
                                    disabled={!newFeed.date || !newFeed.amount}
                                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                                >
                                    Save Total Feed
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
