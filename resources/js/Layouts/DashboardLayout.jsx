import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { auth } = usePage().props;

    // Load notifications on component mount
    useEffect(() => {
        checkUnpaidBills();
    }, []);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotificationDropdown && !event.target.closest('.notification-dropdown')) {
                setShowNotificationDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotificationDropdown]);

    // Function to check for unpaid bills
    const checkUnpaidBills = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstWeekOfDay = 7; // First week of month (day 7)
        
        const unpaidNotifications = [];
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        
        customers.forEach(customer => {
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

    const menuItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'Daily Milk Production',
            href: '/milk-production',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            name: 'Milk Sale',
            href: '/milk-sale',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            name: 'Expenses',
            href: '/expenses',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            name: 'Cows Detail',
            href: '/cows',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            name: 'Pending Payments',
            href: '/pending-payments',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            name: 'Daily Feed',
            href: '/daily-feed',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            ),
        },
    ];

    const getCurrentPath = () => {
        return window.location.pathname;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Head title={title} />

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-700 to-green-800 shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                {/* Sidebar Header */}
                <div className="flex flex-col items-center justify-center h-20 px-4 bg-green-900 border-b border-green-600">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center">
                            <img src="/build/assets/farm.jpeg" alt="Farm Logo" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-white text-md font-bold">Mehmood Dairy Farm</h1>
                            <p className="text-green-200 text-xs">Farm Management</p>
                        </div>
                    </div>
                </div>

                {/* User Profile in Sidebar */}
                <div className="px-4 py-6 border-b border-green-600">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                                {auth?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">{auth?.user?.name || 'Admin User'}</p>
                            <p className="text-green-200 text-xs">{auth?.user?.email || 'admin@farm.com'}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = getCurrentPath() === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-white text-green-700 shadow-md'
                                            : 'text-green-100 hover:bg-green-600 hover:text-white'
                                    }`}
                                >
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto">
                                            <svg className="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="px-4 py-4 border-t border-green-600">
                    <div className="space-y-3">
                        <button className="w-full flex items-center px-3 py-2 text-sm text-green-100 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-200">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </button>
                        <Link
                            href="/logout"
                            method="post"
                            className="w-full flex items-center px-3 py-2 text-sm text-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Page Title - Mobile */}
                            <div className="lg:hidden flex-1 text-center">
                                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                                <p className="text-xs text-gray-500">Farm Management System</p>
                            </div>

                            {/* Page Title - Desktop */}
                            <div className="hidden lg:flex items-center space-x-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                                    <p className="text-sm text-gray-500">Farm Management System</p>
                                </div>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center space-x-2 lg:space-x-4">
                                {/* Notifications */}
                                <div className="relative notification-dropdown">
                                    <button
                                        onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                                        className="p-2 text-gray-400 hover:text-gray-500 relative"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {notifications.length > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>
                                    
                                    {/* Notification Dropdown */}
                                    {showNotificationDropdown && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                            <div className="p-4 border-b border-gray-200">
                                                <h3 className="font-semibold text-gray-900">Unpaid Bills</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification) => (
                                                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                                                            <div className="flex items-start space-x-3">
                                                                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">Last entry: {new Date(notification.lastEntryDate).toLocaleDateString()}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        clearNotification(notification.id);
                                                                        if (notifications.length === 1) {
                                                                            setShowNotificationDropdown(false);
                                                                        }
                                                                    }}
                                                                    className="text-gray-400 hover:text-gray-600"
                                                                >
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center">
                                                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <p className="text-gray-500 text-sm">No unpaid bills</p>
                                                        <p className="text-gray-400 text-xs mt-1">All customers have paid up to date</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* User Menu - Desktop Only */}
                                <div className="hidden lg:flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{auth?.user?.name || 'Admin User'}</p>
                                        <p className="text-xs text-gray-500">Administrator</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-gray-600 font-semibold">
                                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a2 2 0 11-4 0 2 2 0 014 0zm8 8a6 6 0 01-12 0v-1a1 1 0 011-1h2a1 1 0 011 1v1a2 2 0 104 0v-1a1 1 0 011-1h2a1 1 0 011 1v1z"/>
                                </svg>
                                <p className="text-sm text-gray-600">
                                    © 2024 Mehmood Cattle and Dairy Farm. All rights reserved.
                                </p>
                            </div>
                            <div className="flex items-center space-x-6 mt-4 md:mt-0">
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Support</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
