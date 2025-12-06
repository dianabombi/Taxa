'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { API_BASE_URL } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.error_password_mismatch'));
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                router.push('/login?registered=true');
            } else {
                const data = await response.json();
                // Handle Pydantic validation errors (array format)
                if (Array.isArray(data.detail)) {
                    setError(data.detail[0]?.msg || t('auth.register.error_registration'));
                } else {
                    setError(data.detail || t('auth.register.error_registration'));
                }
            }
        } catch (err) {
            setError(t('auth.register.error_connection'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                {/* Logo & Language Switcher */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/" className="flex items-center space-x-3">
                            <Image src="/TAXA.png" alt="TAXA Logo" width={50} height={50} className="object-contain" />
                        </Link>
                        <p className="text-sm text-text-light mt-2">Účtovníctvo ľahko a jednoducho</p>
                    </div>
                    <LanguageSwitcher />
                </div>

                {/* Card */}
                <div className="bg-bg-card rounded-3xl p-10 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                    <h2 className="text-3xl font-bold text-primary mb-2">{t('auth.register.create_account')}</h2>
                    <p className="text-text-light mb-8">{t('auth.register.subtitle')}</p>

                    {error && (
                        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-xl mb-6 shadow-inner">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">
                                {t('auth.register.name')}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                    placeholder={t('auth.register.placeholder_name')}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">
                                {t('auth.register.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                    placeholder={t('auth.register.placeholder_email')}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">
                                {t('auth.register.password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                    placeholder={t('auth.register.placeholder_password')}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">
                                {t('auth.register.confirm_password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                    placeholder={t('auth.register.placeholder_password')}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <span>{loading ? t('auth.register.button_loading') : t('auth.register.button')}</span>
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-text-light">
                        {t('auth.register.have_account')}{' '}
                        <Link href="/login" className="text-accent hover:text-primary font-medium">
                            {t('auth.register.login_link')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
