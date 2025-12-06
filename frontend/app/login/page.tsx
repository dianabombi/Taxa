'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { API_BASE_URL } from '@/lib/api';


function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // FastAPI OAuth2PasswordRequestForm expects form data with 'username' field
            const loginData = new URLSearchParams();
            loginData.append('username', formData.email);
            loginData.append('password', formData.password);
            
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: loginData
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                const data = await response.json();
                // Handle Pydantic validation errors (array format)
                if (Array.isArray(data.detail)) {
                    setError(data.detail[0]?.msg || t('auth.login.error_invalid'));
                } else {
                    setError(data.detail || t('auth.login.error_invalid'));
                }
            }
        } catch (err) {
            setError(t('auth.login.error_connection'));
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
                    <h2 className="text-3xl font-bold text-primary mb-2">{t('auth.login.welcome')}</h2>
                    <p className="text-text-light mb-8">{t('auth.login.subtitle')}</p>

                    {registered && (
                        <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl mb-6 shadow-inner">
                            {t('auth.login.success_registered')}
                        </div>
                    )}

                    {error && (
                        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-xl mb-6 shadow-inner">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">
                                {t('auth.login.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                    placeholder={t('auth.login.placeholder_email')}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-2">
                                {t('auth.login.password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                    placeholder={t('auth.login.placeholder_password')}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <span>{loading ? t('auth.login.button_loading') : t('auth.login.button')}</span>
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-text-light">
                        {t('auth.login.no_account')}{' '}
                        <Link href="/register" className="text-accent hover:text-primary font-medium">
                            {t('auth.login.register_link')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-bg-main flex items-center justify-center">
                <div className="text-primary">Loading...</div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
