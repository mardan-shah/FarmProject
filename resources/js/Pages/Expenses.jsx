import React from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { DollarSign, Car, Zap, Users, Home, Plus, X, Calendar, FileText, Edit, Trash2 } from 'lucide-react';

export default function Expenses() {
    const { recentExpenses } = usePage().props;
    const [activeTab, setActiveTab] = useState('petrol');
    const [successMessage, setSuccessMessage] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        expenses: [{ expense_date: '', amount: '', description: '' }]
    });

    const tabs = [
        { id: 'petrol', label: 'Petrol Expense', icon: Car },
        { id: 'electricity', label: 'Electricity Bill', icon: Zap },
        { id: 'employee', label: 'Employee Pay', icon: Users },
        { id: 'farm', label: 'Farm Expense', icon: Home },
    ];

    const submit = (e) => {
        e.preventDefault();
        console.log('Submit called');
        console.log('Current data:', data);
        console.log('Active tab:', activeTab);
        
        // Validate that at least one expense has required fields
        const hasValidExpense = data.expenses.some(expense => 
            expense.expense_date && expense.amount
        );
        
        if (!hasValidExpense) {
            alert('Please fill in date and amount for at least one expense.');
            return;
        }
        
        // Add expense_type to each expense based on active tab
        const expensesWithType = data.expenses.map(expense => ({
            ...expense,
            expense_type: activeTab === 'employee' ? 'employee_pay' : activeTab,
            expense_name: (activeTab === 'farm' || activeTab === 'electricity' || activeTab === 'employee') ? expense.expenseName || null : null
        }));
        
        // Double-check that expense_type is set
        expensesWithType.forEach(expense => {
            if (!expense.expense_type) {
                expense.expense_type = activeTab === 'employee' ? 'employee_pay' : activeTab;
            }
        });
        
        console.log('Final expenses to submit:', expensesWithType);
        console.log('First expense details:', expensesWithType[0]);
        console.log('Route:', route('expenses.store'));
        
        // Update the form data with the processed expenses
        const finalData = { 
            expenses: expensesWithType,
            activeTab: activeTab
        };
        setData('expenses', expensesWithType);
        
        post(route('expenses.store'), finalData, {
            onSuccess: (response) => {
                console.log('Success response:', response);
                setSuccessMessage('Expenses saved successfully!');
                setData('expenses', [{ expense_date: '', amount: '', description: '' }]);
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
            onFinish: () => {
                console.log('Request finished');
                setData('expenses', [{ expense_date: '', amount: '', description: '' }]);
            },
        });
    };

    const deleteExpense = (expenseId) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            router.delete(route('expenses.destroy', expenseId), {
                onSuccess: () => {
                    setSuccessMessage('Expense deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                },
                onError: (errors) => {
                    console.error('Delete errors:', errors);
                },
            });
        }
    };

    const addExpenseRow = () => {
        const newExpense = (activeTab === 'farm' || activeTab === 'electricity' || activeTab === 'employee')
            ? { expenseName: '', amount: '', expense_date: '', description: '' }
            : { expense_date: '', amount: '', description: '' };
        
        setData('expenses', [...data.expenses, newExpense]);
    };

    const updateExpense = (index, field, value) => {
        const updatedExpenses = [...data.expenses];
        updatedExpenses[index][field] = value;
        setData('expenses', updatedExpenses);
    };

    const removeExpenseRow = (index) => {
        setData('expenses', data.expenses.filter((_, i) => i !== index));
    };
    const renderCommonExpenseForm = () => (
        <form onSubmit={submit} className="space-y-4">
            {data.expenses.map((expense, index) => (
                <div key={index} className="flex items-end space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={expense.expense_date || ''}
                            onChange={(e) => updateExpense(index, 'expense_date', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    
                    {activeTab === 'electricity' && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bill Type
                            </label>
                            <input
                                type="text"
                                value={expense.expenseName || ''}
                                onChange={(e) => updateExpense(index, 'expenseName', e.target.value)}
                                placeholder="e.g., Monthly Bill, Maintenance"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    )}
                    
                    {activeTab === 'employee' && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employee Name
                            </label>
                            <input
                                type="text"
                                value={expense.expenseName || ''}
                                onChange={(e) => updateExpense(index, 'expenseName', e.target.value)}
                                placeholder="e.g., John Doe"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    )}
                    
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={expense.amount || ''}
                            onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                            placeholder="0.00"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            value={expense.description || ''}
                            onChange={(e) => updateExpense(index, 'description', e.target.value)}
                            placeholder="Enter description"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    
                    {data.expenses.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeExpenseRow(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
            
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                    {processing ? 'Saving...' : 'Save Expenses'}
                </button>
            </div>
        </form>
    );

    const renderFarmExpenseForm = () => (
        <form onSubmit={submit} className="space-y-4">
            {data.expenses.map((expense, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expense Name
                        </label>
                        <input
                            type="text"
                            value={expense.expenseName || ''}
                            onChange={(e) => updateExpense(index, 'expenseName', e.target.value)}
                            placeholder="e.g., Feed, Medicine"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={expense.amount || ''}
                            onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                            placeholder="0.00"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date Picker
                        </label>
                        <input
                            type="date"
                            value={expense.expense_date || ''}
                            onChange={(e) => updateExpense(index, 'expense_date', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    
                    <div className="flex items-end space-x-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <input
                                type="text"
                                value={expense.description || ''}
                                onChange={(e) => updateExpense(index, 'description', e.target.value)}
                                placeholder="Details"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        
                        {data.expenses.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeExpenseRow(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
            
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={addExpenseRow}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add More Expense</span>
                </button>
                
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                    {processing ? 'Saving...' : 'Save Expenses'}
                </button>
            </div>
        </form>
    );

    return (
        <DashboardLayout title="Expenses">
            <Head title="Expenses" />
            
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Expense Management</h2>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-600">{successMessage}</p>
                    </div>
                )}

                {/* Expense Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-orange-500 text-orange-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'petrol' && renderCommonExpenseForm()}
                        {activeTab === 'electricity' && renderCommonExpenseForm()}
                        {activeTab === 'employee' && renderCommonExpenseForm()}
                        {activeTab === 'farm' && renderFarmExpenseForm()}
                    </div>
                </div>

                {/* Recent Expenses Records */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <FileText className="w-5 h-5 text-orange-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Recent Expense Records</h2>
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
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {activeTab === 'employee' ? 'Employee Name' : 'Expense Name'}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentExpenses && recentExpenses.length > 0 ? (
                recentExpenses
                    .filter(expense => 
                        activeTab === 'employee' 
                            ? expense.expense_type === 'employee_pay'
                            : expense.expense_type === activeTab
                    )
                    .map((expense) => (
                                            <tr key={expense.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(expense.expense_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        expense.expense_type === 'petrol' ? 'bg-blue-100 text-blue-800' :
                                                        expense.expense_type === 'electricity' ? 'bg-yellow-100 text-yellow-800' :
                                                        expense.expense_type === 'employee_pay' ? 'bg-green-100 text-green-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {expense.expense_type === 'employee_pay' ? 'Employee Pay' : 
                                                         expense.expense_type.charAt(0).toUpperCase() + expense.expense_type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {expense.expense_name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${parseFloat(expense.amount).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {expense.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <button
                                                        onClick={() => deleteExpense(expense.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                No {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} records found. Start by adding your first {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} record above.
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
