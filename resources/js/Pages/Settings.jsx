import React, { useState } from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Settings as SettingsIcon, Users, Plus, Edit2, Trash2, Mail, Lock, User as UserIcon, Save } from 'lucide-react';

export default function Settings() {
    const { users, currentUser } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Profile form
    const { data: profileData, setData: setProfileData, put: putProfile, processing: profileProcessing } = useForm({
        name: currentUser?.name || '',
    });

    // Add user form
    const { data: newUser, setData: setNewUser, post: postUser, processing: userProcessing, reset: resetUser } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Credentials form
    const { data: credentialsData, setData: setCredentialsData, put: putCredentials, processing: credentialsProcessing } = useForm({
        email: currentUser?.email || '',
        password: '',
        password_confirmation: '',
    });

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        putProfile(route('settings.profile.update'), {
            onSuccess: () => {
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        });
    };

    const handleUpdateCredentials = (e) => {
        e.preventDefault();
        putCredentials(route('settings.credentials.update'), {
            onSuccess: () => {
                setSuccessMessage('Credentials updated successfully!');
                setCredentialsData(prev => ({ ...prev, password: '', password_confirmation: '' }));
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        });
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        postUser(route('users.store'), {
            onSuccess: () => {
                setSuccessMessage('User added successfully!');
                resetUser();
                setShowAddUserForm(false);
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        });
    };

    const handleDeleteUser = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${userId}`, {
                onSuccess: () => {
                    setSuccessMessage('User deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                }
            });
        }
    };

    const tabs = [
        { id: 'profile', label: 'Your Name', icon: UserIcon },
        { id: 'credentials', label: 'Email & Password', icon: Lock },
        { id: 'users', label: 'Users', icon: Users },
    ];

    return (
        <DashboardLayout title="Settings">
            <Head title="Settings" />
            
            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {successMessage}
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Update Your Name</h3>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={profileProcessing}
                                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-md transition-colors flex items-center space-x-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {profileProcessing ? 'Updating...' : 'Update Name'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Credentials Tab */}
                {activeTab === 'credentials' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Update Email & Password</h3>
                        <form onSubmit={handleUpdateCredentials}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={credentialsData.email}
                                        onChange={(e) => setCredentialsData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                                    <input
                                        type="password"
                                        value={credentialsData.password}
                                        onChange={(e) => setCredentialsData('password', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={credentialsData.password_confirmation}
                                        onChange={(e) => setCredentialsData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={credentialsProcessing}
                                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-md transition-colors flex items-center space-x-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {credentialsProcessing ? 'Updating...' : 'Update Credentials'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
                            <button
                                onClick={() => setShowAddUserForm(true)}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors flex items-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add User
                            </button>
                        </div>

                        {/* Add User Form */}
                        {showAddUserForm && (
                            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Add New User</h4>
                                <form onSubmit={handleAddUser}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                value={newUser.name}
                                                onChange={(e) => setNewUser('name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Enter name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={newUser.email}
                                                onChange={(e) => setNewUser('email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Enter email"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Password</label>
                                            <input
                                                type="password"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser('password', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Enter password"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                            <input
                                                type="password"
                                                value={newUser.password_confirmation}
                                                onChange={(e) => setNewUser('password_confirmation', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                placeholder="Confirm password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddUserForm(false);
                                                resetUser();
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={userProcessing}
                                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-md transition-colors"
                                        >
                                            {userProcessing ? 'Adding...' : 'Add User'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Users List */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    {user.id !== currentUser?.id && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                    )}
                                                    {user.id === currentUser?.id && (
                                                        <span className="text-gray-500 text-xs">You</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
