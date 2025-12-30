import React from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, Droplet, Download, FileText, Trash2 } from 'lucide-react';

export default function MilkProduction() {
    const { recentProductions } = usePage().props;
    const [successMessage, setSuccessMessage] = useState('');
    const [loadingReport, setLoadingReport] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        production_date: new Date().toISOString().split('T')[0],
        milk_kg: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('milk-production.store'), {
            onSuccess: (page) => {
                setSuccessMessage('Production saved successfully!');
                reset('milk_kg', 'notes');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
            onFinish: () => reset('milk_kg', 'notes'),
        });
    };

    const downloadReport = async (period) => {
        setLoadingReport(period);
        try {
            const response = await fetch(`/milk-production/report/${period}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            // Create blob from response
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `milk-production-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error downloading report:', error);
            // Fallback to window.open for server-side errors
            window.open(`/milk-production/report/${period}`, '_blank');
        } finally {
            setLoadingReport(null);
        }
    };

    const deleteProduction = (productionId) => {
        if (confirm('Are you sure you want to delete this milk production record?')) {
            router.delete(route('milk-production.destroy', productionId), {
                onSuccess: () => {
                    setSuccessMessage('Production record deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                },
                onError: (errors) => {
                    console.error('Delete errors:', errors);
                },
            });
        }
    };

    const isFormValid = data.production_date && data.milk_kg;

    return (
        <DashboardLayout title="Daily Milk Production">
            <Head title="Daily Milk Production" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Form Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Add Milk Production</h2>
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
                                    <label htmlFor="production_date" className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>Select Date</span>
                                        </div>
                                    </label>
                                    <input
                                        type="date"
                                        id="production_date"
                                        value={data.production_date}
                                        onChange={(e) => setData('production_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    {errors.production_date && (
                                        <p className="mt-2 text-sm text-red-600">{errors.production_date}</p>
                                    )}
                                </div>

                                {/* Milk Production Input */}
                                <div>
                                    <label htmlFor="milk_kg" className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Droplet className="w-4 h-4 text-gray-400" />
                                            <span>Milk Production (KG)</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        id="milk_kg"
                                        value={data.milk_kg}
                                        onChange={(e) => setData('milk_kg', e.target.value)}
                                        step="0.01"
                                        min="0"
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter milk production in kg"
                                    />
                                    {errors.milk_kg && (
                                        <p className="mt-2 text-sm text-red-600">{errors.milk_kg}</p>
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
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                    className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
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
                                            <Droplet className="w-4 h-4" />
                                            <span>Save Production</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Reports Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Production Reports</h2>
                        </div>
                    </div>
                    
                    <div className="p-6">
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
                                    disabled={loadingReport === report.period}
                                    className="relative px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {loadingReport === report.period ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700">Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                                            <span className="text-sm font-medium text-gray-700">{report.label}</span>
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Recent Production Records */}
                        <div className="mt-8">
                            <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Production Records</h3>
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
                                                Notes
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Added By
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentProductions && recentProductions.length > 0 ? (
                                            recentProductions.map((production) => (
                                                <tr key={production.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(production.production_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {parseFloat(production.milk_kg).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {production.notes || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {production.user?.name || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <button
                                                            onClick={() => deleteProduction(production.id)}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                            title="Delete Production Record"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                                                    No production records found. Start by adding your first milk production record above.
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
        </DashboardLayout>
    );
}
