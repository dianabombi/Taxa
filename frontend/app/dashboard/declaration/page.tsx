'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, Upload, MessageSquare, LogOut, User, FileText, Calendar, DollarSign, Building, CheckCircle, Download } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { API_BASE_URL } from '@/lib/api';

export default function DeclarationPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        taxYear: new Date().getFullYear() - 1,
        income: '',
        expenses: '',
        taxPaid: '',
        companyType: 'selfEmployed'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token || !userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (!user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Generate declaration
            alert('Daňové priznanie bolo vygenerované!');
        }
    };

    return (
        <div className="min-h-screen bg-bg-main">
            {/* Logo - Fixed Position */}
            <Link href="/" className="fixed top-2 left-12 z-[100] flex items-center hover:opacity-80 transition-opacity">
                <Image src="/taxa logo.jpg" alt="TAXA Logo" width={90} height={90} className="object-contain rounded-xl" priority />
            </Link>
            
            {/* Navigation */}
            <nav className="border-b border-text-light/10 bg-bg-card shadow-[0_4px_8px_#A3B1C6]">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-end">
                        {/* Navigation Menu */}
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/dashboard"
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all"
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.dashboard')}</span>
                            </Link>
                            <Link
                                href="/dashboard/upload"
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all"
                            >
                                <Upload className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.upload')}</span>
                            </Link>
                            <Link
                                href="/dashboard/chat"
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-text-dark hover:text-accent hover:bg-bg-main/50 transition-all"
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-medium">{t('dashboard.nav.chat')}</span>
                            </Link>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            <div className="flex items-center space-x-3 px-4 py-2 bg-bg-card rounded-xl shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <User className="w-5 h-5 text-accent" />
                                <span className="text-text-dark font-medium">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-text-light hover:text-error transition-colors rounded-lg hover:bg-error/10"
                                title={t('dashboard.logout')}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-2">Vytvoriť daňové priznanie</h1>
                        <p className="text-text-light text-lg">Automaticky vygenerujte daňové priznanie na základe vašich údajov</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-12">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                                    step >= s 
                                        ? 'bg-accent text-white shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]' 
                                        : 'bg-bg-card text-text-light shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]'
                                }`}>
                                    {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                                </div>
                                {s < 3 && (
                                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                                        step > s ? 'bg-accent' : 'bg-bg-card'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] mb-6">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-primary mb-6">Krok 1: Základné údaje</h2>
                                    
                                    {/* Tax Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-dark mb-2">
                                            <Calendar className="w-4 h-4 inline mr-2" />
                                            Zdaňovacie obdobie (rok)
                                        </label>
                                        <select
                                            value={formData.taxYear}
                                            onChange={(e) => setFormData({...formData, taxYear: parseInt(e.target.value)})}
                                            className="w-full px-4 py-3 bg-bg-card rounded-xl text-text-dark shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                        >
                                            <option value={2024}>2024</option>
                                            <option value={2023}>2023</option>
                                            <option value={2022}>2022</option>
                                        </select>
                                    </div>

                                    {/* Company Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-dark mb-2">
                                            <Building className="w-4 h-4 inline mr-2" />
                                            Typ podnikania
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({...formData, companyType: 'selfEmployed'})}
                                                className={`p-4 rounded-xl transition-all ${
                                                    formData.companyType === 'selfEmployed'
                                                        ? 'bg-accent text-white shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                                        : 'bg-bg-main text-text-dark shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]'
                                                }`}
                                            >
                                                SZČO
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({...formData, companyType: 'company'})}
                                                className={`p-4 rounded-xl transition-all ${
                                                    formData.companyType === 'company'
                                                        ? 'bg-accent text-white shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]'
                                                        : 'bg-bg-main text-text-dark shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]'
                                                }`}
                                            >
                                                S.r.o.
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-primary mb-6">Krok 2: Príjmy a výdavky</h2>
                                    
                                    {/* Income */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-dark mb-2">
                                            <DollarSign className="w-4 h-4 inline mr-2" />
                                            Celkové príjmy (€)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.income}
                                            onChange={(e) => setFormData({...formData, income: e.target.value})}
                                            placeholder="0.00"
                                            className="w-full px-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                            required
                                        />
                                    </div>

                                    {/* Expenses */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-dark mb-2">
                                            <FileText className="w-4 h-4 inline mr-2" />
                                            Celkové výdavky (€)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.expenses}
                                            onChange={(e) => setFormData({...formData, expenses: e.target.value})}
                                            placeholder="0.00"
                                            className="w-full px-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                            required
                                        />
                                    </div>

                                    {/* Tax Paid */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-dark mb-2">
                                            <DollarSign className="w-4 h-4 inline mr-2" />
                                            Zaplatená daň vopred (€)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.taxPaid}
                                            onChange={(e) => setFormData({...formData, taxPaid: e.target.value})}
                                            placeholder="0.00"
                                            className="w-full px-4 py-3 bg-bg-card rounded-xl text-text-dark placeholder-text-light shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] focus:outline-none focus:shadow-[inset_6px_6px_12px_#A3B1C6,inset_-6px_-6px_12px_#FFFFFF] transition-shadow"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-primary mb-6">Krok 3: Súhrn</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                            <p className="text-text-light text-sm">Zdaňovacie obdobie</p>
                                            <p className="text-text-dark font-bold text-lg">{formData.taxYear}</p>
                                        </div>
                                        
                                        <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                            <p className="text-text-light text-sm">Celkové príjmy</p>
                                            <p className="text-text-dark font-bold text-lg">{formData.income} €</p>
                                        </div>
                                        
                                        <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                            <p className="text-text-light text-sm">Celkové výdavky</p>
                                            <p className="text-text-dark font-bold text-lg">{formData.expenses} €</p>
                                        </div>
                                        
                                        <div className="bg-accent/10 border-2 border-accent rounded-xl p-4">
                                            <p className="text-accent text-sm font-medium">Vypočítaná daň</p>
                                            <p className="text-accent font-bold text-2xl">
                                                {((parseFloat(formData.income || '0') - parseFloat(formData.expenses || '0')) * 0.19).toFixed(2)} €
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-3 bg-bg-card text-text-dark rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                                >
                                    Späť
                                </button>
                            )}
                            <button
                                type="submit"
                                className="ml-auto px-8 py-3 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] transition-all flex items-center space-x-2"
                            >
                                {step < 3 ? (
                                    <>
                                        <span>Pokračovať</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        <span>Stiahnuť PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
