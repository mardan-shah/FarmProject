import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Search, Plus, ArrowLeft, Download, Save, Calendar, Scale, DollarSign, User, Trash2, Eye } from 'lucide-react';

export default function PendingPayments() {
    const { customer } = usePage().props;
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
    const [entries, setEntries] = useState([{ entry_date: '', quantity_kg: '', price_per_kg: '', total_amount: '', notes: '' }]);
    const [notifications, setNotifications] = useState([]);

    // Load customers from localStorage on component mount
    useEffect(() => {
        const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
        setCustomers(storedCustomers);
        
        // Check for unpaid bills and generate notifications
        checkUnpaidBills(storedCustomers);
    }, []);

    // Function to check for unpaid bills
    const checkUnpaidBills = (customerList) => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstWeekOfDay = 7; // First week of month (day 7)
        
        const unpaidNotifications = [];
        
        customerList.forEach(customer => {
            const customerEntries = JSON.parse(localStorage.getItem(`milk_entries_${customer.id}`) || '[]');
            const paymentStatus = customer.payment_status || 'pending';
            
            // Check if it's after the first week of current month and payment is still pending
            if (today.getDate() > firstWeekOfDay && paymentStatus === 'pending' && customerEntries.length > 0) {
                // Get the latest entry date to determine billing month
                const latestEntry = customerEntries.reduce((latest, entry) => {
                    return new Date(entry.entry_date) > new Date(latest.entry_date) ? entry : latest;
                }, customerEntries[0]);
                
                const entryDate = new Date(latestEntry.entry_date);
                const entryMonth = entryDate.getMonth();
                const entryYear = entryDate.getFullYear();
                
                // Check if the entry is from previous month or current month
                if ((entryMonth < currentMonth) || (entryMonth === currentMonth && entryYear === currentYear)) {
                    unpaidNotifications.push({
                        id: customer.id,
                        customerName: customer.name,
                        totalAmount: customerEntries.reduce((sum, entry) => sum + parseFloat(entry.total_amount || 0), 0),
                        lastEntryDate: latestEntry.entry_date,
                        message: `${customer.name} has not yet paid the bill of Rs. ${customerEntries.reduce((sum, entry) => sum + parseFloat(entry.total_amount || 0), 0).toFixed(2)}`
                    });
                }
            }
        });
        
        setNotifications(unpaidNotifications);
    };

    // Clear notification
    const clearNotification = (notificationId) => {
        setNotifications(notifications.filter(n => n.id !== notificationId));
    };

    // Form for adding customer
    const customerForm = useForm({
        name: '',
        notes: '',
    });

    // Form for milk entries
    const milkForm = useForm({
        customer_id: customer?.id || '',
        entries: entries,
    });

    const filteredCustomers = (customers || []).filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCustomer = (e) => {
        e.preventDefault();
        // Store in localStorage
        const newCustomer = {
            id: Date.now(),
            name: customerForm.data.name,
            notes: customerForm.data.notes,
            total_entries: 0,
            total_amount: 0,
            payment_status: 'pending', // Add payment status
            created_at: new Date().toISOString()
        };
        
        // Get existing customers from localStorage or use empty array
        const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
        existingCustomers.push(newCustomer);
        localStorage.setItem('customers', JSON.stringify(existingCustomers));
        
        // Update state to show new customer immediately
        setCustomers(existingCustomers);
        
        setSuccessMessage('Customer added successfully!');
        customerForm.reset();
        setShowAddCustomerForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleCustomerClick = (customer) => {
        // Set selected customer to show detail view
        setSelectedCustomer(customer);
    };

    const togglePaymentStatus = (customerId, currentStatus) => {
        const updatedCustomers = customers.map(customer => {
            if (customer.id === customerId) {
                const newStatus = currentStatus === 'pending' ? 'received' : 'pending';
                return { ...customer, payment_status: newStatus };
            }
            return customer;
        });
        
        // Update localStorage
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        // Update state
        setCustomers(updatedCustomers);
        
        // If in detail view, update selected customer too
        if (selectedCustomer && selectedCustomer.id === customerId) {
            const updatedSelected = updatedCustomers.find(c => c.id === customerId);
            setSelectedCustomer(updatedSelected);
        }
        
        // Re-check unpaid bills after status change
        checkUnpaidBills(updatedCustomers);
        
        setSuccessMessage('Payment status updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const addEntryRow = () => {
        setEntries([...entries, { entry_date: '', quantity_kg: '', price_per_kg: '', total_amount: '', notes: '' }]);
    };

    const updateEntry = (index, field, value) => {
        const updatedEntries = [...entries];
        updatedEntries[index][field] = value;
        
        // Auto calculate total amount when quantity and price are entered
        if (field === 'quantity_kg' || field === 'price_per_kg') {
            const quantity = parseFloat(updatedEntries[index].quantity_kg) || 0;
            const price = parseFloat(updatedEntries[index].price_per_kg) || 0;
            updatedEntries[index].total_amount = (quantity * price).toFixed(2);
        }
        
        setEntries(updatedEntries);
    };

    const removeEntryRow = (index) => {
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
    };

    const submitEntries = (e) => {
        e.preventDefault();
        const validEntries = entries.filter(entry => entry.quantity_kg && entry.price_per_kg);
        
        if (validEntries.length === 0) {
            alert('Please add at least one valid milk entry');
            return;
        }
        
        // Store entries in localStorage for now
        const existingEntries = JSON.parse(localStorage.getItem(`milk_entries_${selectedCustomer?.id}`) || '[]');
        const newEntries = validEntries.map(entry => ({
            ...entry,
            id: Date.now() + Math.random(),
            customer_id: selectedCustomer?.id,
            created_at: new Date().toISOString()
        }));
        
        existingEntries.push(...newEntries);
        localStorage.setItem(`milk_entries_${selectedCustomer?.id}`, JSON.stringify(existingEntries));
        
        setSuccessMessage('Milk entries saved successfully!');
        setEntries([{ entry_date: '', quantity_kg: '', price_per_kg: '', total_amount: '', notes: '' }]);
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Reload the component to show updated entries
        setSelectedCustomer({...selectedCustomer});
    };

    const downloadReport = () => {
        if (selectedCustomer) {
            const entries = JSON.parse(localStorage.getItem(`milk_entries_${selectedCustomer.id}`) || '[]');
            const csvContent = [
                ['Date', 'Quantity (KG)', 'Price per KG', 'Total Amount', 'Notes'],
                ...entries.map(entry => [
                    entry.entry_date,
                    entry.quantity_kg,
                    entry.price_per_kg,
                    entry.total_amount,
                    entry.notes || ''
                ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedCustomer.name}_milk_entries.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    const handleDeleteEntry = (entryId) => {
        if (confirm('Are you sure you want to delete this milk entry?')) {
            const existingEntries = JSON.parse(localStorage.getItem(`milk_entries_${selectedCustomer?.id}`) || '[]');
            const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
            localStorage.setItem(`milk_entries_${selectedCustomer?.id}`, JSON.stringify(updatedEntries));
            
            setSuccessMessage('Milk entry deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            // Reload the component to show updated entries
            setSelectedCustomer({...selectedCustomer});
        }
    };

    // Customer Detail View
    if (selectedCustomer) {
        const customerEntries = JSON.parse(localStorage.getItem(`milk_entries_${selectedCustomer.id}`) || '[]');
        const totalAmount = customerEntries.reduce((sum, entry) => sum + parseFloat(entry.total_amount || 0), 0);
        
        return (
            <DashboardLayout title={`Customer Details - ${selectedCustomer.name} - Mehmood Cattle and Dairy Farm`}>
                <Head title={`Customer Details - ${selectedCustomer.name}`} />
                
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Notifications */}
                    {notifications.filter(n => n.id === selectedCustomer.id).length > 0 && (
                        <div className="space-y-2">
                            {notifications.filter(n => n.id === selectedCustomer.id).map((notification) => (
                                <div key={notification.id} className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{notification.message}</p>
                                            <p className="text-sm text-red-600">Last entry: {new Date(notification.lastEntryDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => clearNotification(notification.id)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h1>
                                    <p className="text-gray-600">Customer Details & Milk Entries</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePaymentStatus(selectedCustomer.id, selectedCustomer.payment_status || 'pending');
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        (selectedCustomer.payment_status || 'pending') === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    }`}
                                >
                                    {(selectedCustomer.payment_status || 'pending') === 'pending' ? 'Payment Pending' : 'Payment Received'}
                                </button>
                                <button
                                    onClick={downloadReport}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Report</span>
                                </button>
                                <button
                                    onClick={submitEntries}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>

                        {/* Customer Summary */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                    <Scale className="w-4 h-4" />
                                    <span className="text-sm">Total Entries</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{customerEntries.length}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 text-green-600 mb-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm">Total Amount</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900">Rs. {totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Add Milk Entry Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Daily Milk Details</h2>
                            <button
                                onClick={addEntryRow}
                                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Row</span>
                            </button>
                        </div>

                        <form onSubmit={submitEntries}>
                            <div className="space-y-4">
                                {entries.map((entry, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-700">Entry #{index + 1}</h3>
                                            {entries.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeEntryRow(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={entry.entry_date}
                                                    onChange={(e) => updateEntry(index, 'entry_date', e.target.value)}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Quantity (KG) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={entry.quantity_kg}
                                                    onChange={(e) => updateEntry(index, 'quantity_kg', e.target.value)}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="1.5"
                                                    step="0.1"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Price per KG <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={entry.price_per_kg}
                                                    onChange={(e) => updateEntry(index, 'price_per_kg', e.target.value)}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Total Amount <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={entry.total_amount}
                                                    readOnly
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notes
                                            </label>
                                            <input
                                                type="text"
                                                value={entry.notes}
                                                onChange={(e) => updateEntry(index, 'notes', e.target.value)}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                placeholder="Additional notes..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setEntries([{ entry_date: '', quantity_kg: '', price_per_kg: '', total_amount: '', notes: '' }])}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Clear All
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    Save Entries
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Milk Entries Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Scale className="w-5 h-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Milk Entries History</h2>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (KG)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per KG</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customerEntries.length > 0 ? (
                                        customerEntries.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {entry.entry_date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {parseFloat(entry.quantity_kg).toFixed(1)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Rs. {parseFloat(entry.price_per_kg).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Rs. {parseFloat(entry.total_amount).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {entry.notes || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                        onClick={() => handleDeleteEntry(entry.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <Scale className="w-12 h-12 text-gray-400 mb-4" />
                                                    <p className="text-gray-500">No milk entries found</p>
                                                    <p className="text-sm text-gray-400 mt-1">Add your first milk entry above</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Customer List View
    return (
        <DashboardLayout title="Pending Payments - Mehmood Cattle and Dairy Farm">
            <Head title="Pending Payments" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Notifications */}
                {notifications.length > 0 && (
                    <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{notification.message}</p>
                                        <p className="text-sm text-red-600">Last entry: {new Date(notification.lastEntryDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => clearNotification(notification.id)}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pending Payments</h1>
                            <p className="text-gray-600 mt-1">Manage customer milk entries and payments</p>
                        </div>
                        
                        <button
                            onClick={() => setShowAddCustomerForm(true)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Customer</span>
                        </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="mt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Add Customer Form */}
                {showAddCustomerForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Customer</h3>
                            <button
                                onClick={() => setShowAddCustomerForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddCustomer}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Customer Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customerForm.data.name}
                                        onChange={(e) => customerForm.setData('name', e.target.value)}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Enter customer name"
                                    />
                                    {customerForm.errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{customerForm.errors.name}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={customerForm.data.notes}
                                        onChange={(e) => customerForm.setData('notes', e.target.value)}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        rows="3"
                                        placeholder="Additional notes about the customer..."
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddCustomerForm(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={customerForm.processing}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                                >
                                    {customerForm.processing ? 'Adding...' : 'Add Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Customer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => {
                            const customerEntries = JSON.parse(localStorage.getItem(`milk_entries_${customer.id}`) || '[]');
                            const totalAmount = customerEntries.reduce((sum, entry) => sum + parseFloat(entry.total_amount || 0), 0);
                            
                            return (
                                <div
                                    key={customer.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-green-300 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                                <User className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                                    {customer.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">Customer</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePaymentStatus(customer.id, customer.payment_status || 'pending');
                                                }}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                                    (customer.payment_status || 'pending') === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                }`}
                                            >
                                                {(customer.payment_status || 'pending') === 'pending' ? 'Payment Pending' : 'Payment Received'}
                                            </button>
                                            <Eye 
                                                className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors cursor-pointer"
                                                onClick={() => handleCustomerClick(customer)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Total Entries</span>
                                            <span className="text-sm font-medium text-gray-900">{customerEntries.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Total Amount</span>
                                            <span className="text-sm font-medium text-green-600">Rs. {totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    {customer.notes && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-500 truncate">{customer.notes}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No customers found</p>
                                <p className="text-gray-400 mt-2">
                                    {searchTerm ? 'Try adjusting your search' : 'Add your first customer to get started'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
