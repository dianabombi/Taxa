'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Building, Search, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import Footer from '@/components/Footer';
import { API_BASE_URL } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [registrationType, setRegistrationType] = useState<'email' | 'ico'>('email');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        ico: '',
        business_name: '',
        business_address: '',
        legal_form: '',
        dic: '',
        ic_dph: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifyingICO, setVerifyingICO] = useState(false);
    const [icoVerified, setIcoVerified] = useState(false);

    const handleVerifyICO = async () => {
        if (!formData.ico || formData.ico.length < 8) {
            setError('IČO musí obsahovať minimálne 8 číslic');
            return;
        }

        setVerifyingICO(true);
        setError('');

        try {
            // Call ICO verification endpoint
            const response = await fetch(`${API_BASE_URL}/api/ico/details/${formData.ico}`);

            if (response.ok) {
                const data = await response.json();
                
                // Check if ICO was found
                if (data.error) {
                    setError(data.error || 'IČO sa nepodarilo overiť v registroch SR');
                    setIcoVerified(false);
                } else {
                    // Auto-fill form with verified data
                    setFormData({
                        ...formData,
                        business_name: data.company_name || '',
                        business_address: data.business_address || '',
                        legal_form: data.legal_form || '',
                        dic: data.dic || '',
                        ic_dph: data.ic_dph || '',
                        name: data.company_name || formData.name
                    });
                    setIcoVerified(true);
                    setError('');
                }
            } else {
                setError('Chyba pri overovaní IČO. Skúste znova.');
                setIcoVerified(false);
            }
        } catch (err) {
            setError('Chyba pripojenia k serveru. Skontrolujte internetové pripojenie.');
            setIcoVerified(false);
        } finally {
            setVerifyingICO(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.error_password_mismatch'));
            return;
        }

        setLoading(true);

        try {
            const registrationData: any = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            // Add IČO data if registering with IČO
            if (registrationType === 'ico' && formData.ico) {
                registrationData.ico = formData.ico;
                registrationData.business_name = formData.business_name;
                registrationData.business_address = formData.business_address;
                registrationData.legal_form = formData.legal_form;
                registrationData.dic = formData.dic;
                registrationData.ic_dph = formData.ic_dph;
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/onboarding');
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
        <div className="min-h-screen bg-bg-main">
            {/* Logo - Fixed Position */}
            <Link href="/" className="fixed top-2 left-4 lg:left-12 z-[100] flex items-center hover:opacity-80 transition-opacity">
                <Image src="/taxa logo.jpg" alt="TAXA Logo" width={80} height={80} className="lg:w-[100px] lg:h-[100px] object-contain rounded-xl" priority />
            </Link>
            
            {/* Top Navigation */}
            <nav className="container mx-auto px-4 lg:px-6 py-4">
                <div className="flex justify-end items-center">
                    <LanguageSwitcher />
                </div>
            </nav>

            {/* Main Content - Two Columns */}
            <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Tagline */}
                    <div className="hidden lg:flex flex-col justify-center space-y-8">
                        <div>
                            <h1 className="text-6xl font-bold leading-tight mb-6">
                                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                    {t('auth.register.tagline_1')}
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                                    {t('auth.register.tagline_2')}
                                </span>
                            </h1>
                            <p className="text-xl text-text-light leading-relaxed">
                                {t('auth.register.tagline_description')}
                            </p>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="flex space-x-4">
                            <div className="w-20 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                            <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                            <div className="w-8 h-1 bg-accent rounded-full"></div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full max-w-xl mx-auto lg:mx-0">
                        <div className="bg-bg-card rounded-3xl p-6 md:p-8 lg:p-12 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF]">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t('auth.register.create_account')}</h2>
                    <p className="text-text-light mb-6">{t('auth.register.subtitle')}</p>

                    {error && (
                        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-xl mb-6 shadow-inner">
                            {error}
                        </div>
                    )}

                    {/* Registration Type Toggle */}
                    <div className="flex gap-2 p-1 bg-bg-main rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setRegistrationType('email')}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                registrationType === 'email'
                                    ? 'bg-accent text-white shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                    : 'text-text-light hover:text-text-dark'
                            }`}
                        >
                            <Mail className="w-5 h-5 inline mr-2" />
                            E-mail
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setRegistrationType('ico');
                                setIcoVerified(false);
                            }}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                registrationType === 'ico'
                                    ? 'bg-accent text-white shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                    : 'text-text-light hover:text-text-dark'
                            }`}
                        >
                            <Building className="w-5 h-5 inline mr-2" />
                            IČO
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* IČO Registration */}
                        {registrationType === 'ico' && (
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-2">
                                    IČO *
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.ico}
                                            onChange={(e) => {
                                                setFormData({ ...formData, ico: e.target.value });
                                                setIcoVerified(false);
                                            }}
                                            className="w-full pl-12 pr-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                            placeholder="12345678"
                                            disabled={icoVerified}
                                        />
                                        {icoVerified && (
                                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyICO}
                                        disabled={verifyingICO || icoVerified || !formData.ico}
                                        className="px-4 py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        {verifyingICO ? (
                                            t('auth.register.verifying')
                                        ) : icoVerified ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <>
                                                <Search className="w-5 h-5 inline mr-1" />
                                                {t('auth.register.verify')}
                                            </>
                                        )}
                                    </button>
                                </div>
                                {icoVerified && formData.business_name && (
                                    <div className="mt-3 p-3 bg-success/10 border border-success/30 rounded-lg">
                                        <p className="text-sm text-success font-medium">✓ {t('auth.register.ico_verified')}</p>
                                        <p className="text-sm text-text-dark mt-1">{formData.business_name}</p>
                                        {formData.business_address && (
                                            <p className="text-xs text-text-light mt-1">{formData.business_address}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

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
            </div>
            
            {/* Footer */}
            <Footer />

            {/* Mobile Menu */}
            <MobileMenu />
        </div>
    );
}
