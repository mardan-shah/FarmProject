import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
                <div className="max-w-4xl w-full">
                    <div className="text-center space-y-8">
                        {/* Main Title */}
                        <div className="space-y-4">
                            {/* Logo */}
                            <div className="flex justify-center">
                                <div className="w-16 h-16 bg-white rounded-full shadow-lg overflow-hidden border-2 border-green-200">
                                    <img 
                                        src="/build/assets/farm.jpeg" 
                                        alt="Mehmood Dairy Farm" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                Welcome to Management System
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
                        </div>
                        
                        {/* Subtitle */}
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-semibold text-gray-700">
                                of <span className="text-green-600"> Mehmood Cattle </span>
                                and <span className="text-emerald-600"> Dairy Farm</span>
                            </h2>
                            
                            {/* Description */}
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Professional farm management solution for modern dairy operations
                            </p>
                        </div>
                        
                        {/* Login Button */}
                        <div className="pt-8">
                            <Link
                                href={route('login')}
                                className="inline-flex items-center p-8 bg-white border-2 border-green-500 hover:bg-green-50 text-green-600 font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                            >
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Click to Login Here
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                            <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-md border border-green-100">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Easy Management</h3>
                                <p className="text-gray-600 text-sm">Streamlined farm operations</p>
                            </div>
                            
                            <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-md border border-emerald-100">
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
                                <p className="text-gray-600 text-sm">Monitor your dairy production</p>
                            </div>
                            
                            <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-md border border-teal-100">
                                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Data Analytics</h3>
                                <p className="text-gray-600 text-sm">Insights for better decisions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
