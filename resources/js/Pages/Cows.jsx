import React, { useState } from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Users, Plus, Edit2, Eye, Search, X, Milk, AlertCircle, Calendar, Baby } from 'lucide-react';

export default function Cows() {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState('milk-producing');
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCow, setNewCow] = useState({ 
        number: '', 
        name: '', 
        notes: '', 
        type: '',
        isPregnant: false,
        pregnancyDate: '',
        pregnancyMethod: ''
    });
    
    const milkProducingCows = props.milkProducingCows || [];
    const nonMilkProducingCows = props.nonMilkProducingCows || [];
    
    const cows = activeTab === 'milk-producing' ? milkProducingCows : nonMilkProducingCows;

    const handleAddCow = () => {
        if (newCow.number && newCow.type) {
            router.post('/cows', {
                number: newCow.number,
                name: newCow.name,
                notes: newCow.notes,
                type: newCow.type,
                is_pregnant: newCow.isPregnant,
                pregnancy_date: newCow.isPregnant ? newCow.pregnancyDate : null,
                pregnancy_method: newCow.isPregnant ? newCow.pregnancyMethod : null,
            }, {
                onSuccess: () => {
                    setNewCow({ 
                        number: '', 
                        name: '', 
                        notes: '', 
                        type: '',
                        isPregnant: false,
                        pregnancyDate: '',
                        pregnancyMethod: ''
                    });
                    setShowAddForm(false);
                }
            });
        }
    };

    const handleDeleteCow = (cowId) => {
        if (confirm('Are you sure you want to delete this cow?')) {
            router.delete(`/cows/${cowId}`);
        }
    };

    const filteredCows = cows.filter(cow => 
        (cow.number && cow.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cow.name && cow.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DashboardLayout title="Cow Details">
            <Head title="Cow Details" />
            
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Cow Management</h2>
                            <p className="text-sm text-gray-500">Manage your dairy farm cows</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search cows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        
                        {/* Add Cow Button */}
                        <button
                            onClick={() => {
                                setNewCow(prev => ({ 
                                    ...prev, 
                                    type: activeTab
                                }));
                                setShowAddForm(true);
                            }}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Cow</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('milk-producing')}
                                className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'milk-producing'
                                        ? 'border-purple-500 text-purple-600 bg-purple-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Milk className="w-4 h-4 mr-2" />
                                Milk Producing Cows
                                <span className="ml-2 bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                                    {milkProducingCows.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('non-milk-producing')}
                                className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'non-milk-producing'
                                        ? 'border-purple-500 text-purple-600 bg-purple-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Non-Milk Producing Cows
                                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                    {nonMilkProducingCows.length}
                                </span>
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Add Cow Form */}
                        {showAddForm && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Add New {activeTab === 'milk-producing' ? 'Milk Producing' : 'Non-Milk Producing'} Cow
                                        </h3>
                                        <button
                                            onClick={() => setShowAddForm(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cow Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newCow.number}
                                                onChange={(e) => setNewCow({...newCow, number: e.target.value})}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                placeholder="e.g., COW-004"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cow Name (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={newCow.name}
                                                onChange={(e) => setNewCow({...newCow, name: e.target.value})}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                placeholder="e.g., Rosie"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notes (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={newCow.notes}
                                                onChange={(e) => setNewCow({...newCow, notes: e.target.value})}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                placeholder="Health notes..."
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pregnancy Status
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="pregnancy"
                                                        checked={!newCow.isPregnant}
                                                        onChange={() => setNewCow({...newCow, isPregnant: false, pregnancyDate: '', pregnancyMethod: ''})}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">Not Pregnant</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="pregnancy"
                                                        checked={newCow.isPregnant}
                                                        onChange={() => setNewCow({...newCow, isPregnant: true})}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">Pregnant</span>
                                                </label>
                                            </div>
                                        </div>
                                        
                                        {newCow.isPregnant && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Pregnancy Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={newCow.pregnancyDate}
                                                        onChange={(e) => setNewCow({...newCow, pregnancyDate: e.target.value})}
                                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Pregnancy Method <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={newCow.pregnancyMethod}
                                                        onChange={(e) => setNewCow({...newCow, pregnancyMethod: e.target.value})}
                                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    >
                                                        <option value="">Select Method</option>
                                                        <option value="injection">Injection</option>
                                                        <option value="natural">Natural</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => setShowAddForm(false)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddCow}
                                            disabled={!newCow.number || (newCow.isPregnant && (!newCow.pregnancyDate || !newCow.pregnancyMethod))}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                                        >
                                            Save Cow
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cow List Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cow Number
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cow Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pregnancy
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
                                        {filteredCows.length > 0 ? (
                                            filteredCows.map((cow) => (
                                                <tr key={cow.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <div className="flex items-center space-x-2">
                                                            {cow.type === 'milk-producing' ? (
                                                                <Milk className="w-4 h-4 text-blue-500" />
                                                            ) : (
                                                                <AlertCircle className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            {cow.number}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {cow.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            cow.status === 'Active' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {cow.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {cow.is_pregnant ? (
                                                            <div className="flex items-center space-x-2">
                                                                <Baby className="w-4 h-4 text-pink-500" />
                                                                <div>
                                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                                                                        Pregnant
                                                                    </span>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        {cow.pregnancy_date && new Date(cow.pregnancy_date).toLocaleDateString()} • {cow.pregnancy_method}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                                                Not Pregnant
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        <div className="max-w-xs truncate">
                                                            {cow.notes || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center space-x-3">
                                                            <button className="text-purple-600 hover:text-purple-900 flex items-center space-x-1">
                                                                <Eye className="w-4 h-4" />
                                                                <span>View</span>
                                                            </button>
                                                            <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                                                                <Edit2 className="w-4 h-4" />
                                                                <span>Edit</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteCow(cow.id)}
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
                                                <td colSpan="6" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center">
                                                        {activeTab === 'milk-producing' ? (
                                                            <Milk className="w-12 h-12 text-gray-400 mb-4" />
                                                        ) : (
                                                            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                                                        )}
                                                        <p className="text-gray-500">
                                                            No {activeTab === 'milk-producing' ? 'milk producing' : 'non-milk producing'} cows found
                                                        </p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {searchTerm ? 'Try adjusting your search' : `Add your first ${activeTab === 'milk-producing' ? 'milk producing' : 'non-milk producing'} cow to get started`}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Milk className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">Milk Producing Cows</p>
                                        <p className="text-2xl font-bold text-blue-900">{milkProducingCows.length}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Non-Milk Producing Cows</p>
                                        <p className="text-2xl font-bold text-gray-900">{nonMilkProducingCows.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
