import React from 'react';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import PrimaryButton from '../../Components/PrimaryButton';
import TextInput from '../../Components/TextInput';
import GuestLayout from '../../Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword, canRegister }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        if (canRegister) {
            post(route('register'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        } else {
            post(route('login'), {
                onFinish: () => reset('password'),
            });
        }
    };

    return (
        <GuestLayout>
            <Head title={canRegister ? "Register Admin" : "Farm Login"} />

            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-white rounded-full shadow-lg overflow-hidden">
                        <img src="/build/assets/farm.jpeg" alt="Farm Logo" className="w-full h-full object-cover" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Mehmood Cattle and Dairy Farm
                </h1>
                <p className="text-gray-600">
                    Farm Management System
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {canRegister && (
                <div className="mb-4 text-sm text-center text-red-600 font-medium">
                    Note: This is the only time you can create an account.
                </div>
            )}

            <form onSubmit={submit} autoComplete="on">
                {canRegister && (
                    <div className="mb-4">
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="email" value="Email Address" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete={canRegister ? "new-password" : "current-password"}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {canRegister && (
                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                )}

                <div className="mt-6">
                    <PrimaryButton className="w-full justify-center" disabled={processing}>
                        {processing ? 'Processing...' : (canRegister ? 'Register Admin' : 'Sign In')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
