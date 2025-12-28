import React from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { TrendingUp, DollarSign, Users, AlertCircle, Droplet, ShoppingCart, PlusCircle, Calendar } from 'lucide-react';

export default function Dashboard() {
    const { todayProduction, todaySales, recentProductions, totalCows, totalExpenses, todayNetProfit } = usePage().props;

    const stats = [
        {
            name: "Today's Production",
            value: todayProduction ? `${parseFloat(todayProduction.milk_kg).toFixed(2)} KG` : "0 KG",
            change: todayProduction ? "Recorded" : "Not recorded",
            changeType: todayProduction ? "increase" : "neutral",
            icon: Droplet,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            name: "Today's Sales",
            value: todaySales ? `$${parseFloat(todaySales.sale_amount).toFixed(2)}` : "$0",
            change: todaySales ? "Recorded" : "Not recorded",
            changeType: todaySales ? "increase" : "neutral",
            icon: DollarSign,
            iconBg: "bg-green-50",
            iconColor: "text-green-600"
        },
        {
            name: "Total Cows",
            value: totalCows ? totalCows.toString() : "0",
            change: "Active",
            changeType: "increase",
            icon: Users,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600"
        },
        {
            name: "Total Expenses",
            value: totalExpenses ? `$${parseFloat(totalExpenses).toFixed(2)}` : "$0",
            change: "All time",
            changeType: "decrease",
            icon: ShoppingCart,
            iconBg: "bg-red-50",
            iconColor: "text-red-600"
        },
        {
            name: "Today's Net Profit",
            value: todayNetProfit !== null ? `$${parseFloat(todayNetProfit).toFixed(2)}` : "$0",
            change: todayNetProfit >= 0 ? "Profit" : "Loss",
            changeType: todayNetProfit >= 0 ? "increase" : "decrease",
            icon: TrendingUp,
            iconBg: "bg-yellow-50",
            iconColor: "text-yellow-600"
        }
    ];

    const quickActions = [
        { name: "Add Production", icon: Droplet, color: "bg-blue-600 hover:bg-blue-700", route: "milk-production" },
        { name: "Record Sale", icon: ShoppingCart, color: "bg-green-600 hover:bg-green-700", route: "milk-sale" },
        { name: "Add Expense", icon: DollarSign, color: "bg-orange-600 hover:bg-orange-700", route: "expenses" },
        { name: "Add New Cow", icon: PlusCircle, color: "bg-purple-600 hover:bg-purple-700", route: "cows" }
    ];

    const recentActivity = recentProductions?.slice(0, 4).map(production => ({
        type: "production",
        desc: `Milk production - ${production.notes || 'No notes'}`,
        amount: `${parseFloat(production.milk_kg).toFixed(2)} KG`,
        time: new Date(production.production_date).toLocaleDateString(),
        date: production.production_date
    })) || [];

    return (
        <DashboardLayout title="Dashboard">
            <Head title="Dashboard" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.iconBg} rounded-lg p-3`}>
                                        <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                                    </div>
                                    <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : stat.changeType === 'neutral' ? 'text-gray-600' : 'text-red-600'} flex items-center`}>
                                        {stat.changeType === 'increase' && <TrendingUp className="h-4 w-4 mr-1" />}
                                        {stat.change}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {stat.name}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.name}
                                    href={route(action.route)}
                                    className={`${action.color} text-white rounded-lg p-4 flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{action.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold opacity-90">Today's Net Profit</h2>
                        <DollarSign className="h-8 w-8 opacity-80" />
                    </div>
                    <p className="text-4xl font-bold mb-2">$330</p>
                    <p className="text-sm opacity-90">Sales: $450 - Expenses: $120</p>
                    <div className="mt-4 pt-4 border-t border-green-400">
                        <p className="text-sm font-medium">Profit Margin: 73.3%</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Production Activity</h2>
                    <Link href={route('milk-production')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View All
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                                        <Droplet className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{activity.desc}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{activity.amount}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No production records yet</p>
                            <Link href={route('milk-production')} className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                                Add your first production record
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}