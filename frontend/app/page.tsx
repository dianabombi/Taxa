'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText, MessageSquare, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import PrivacyBanner from '@/components/PrivacyBanner';

export default function LandingPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-bg-main">
            {/* Privacy Banner */}
            <PrivacyBanner />
            
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <Image src="/moneybag.png" alt="TAXA Logo" width={50} height={50} className="object-contain" priority />
                        <span className="text-3xl font-bold text-primary">TAXA</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        <Link
                            href="/login"
                            className="px-4 py-2 text-text-dark hover:text-accent transition-colors"
                        >
                            {t('auth.login.button')}
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-2 bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                        >
                            {t('auth.register.title')}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-20 pb-12 text-center relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                
                <div className="max-w-4xl mx-auto relative">
                    {/* Trust badges */}
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <div className="px-4 py-2 bg-bg-card rounded-full shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-text-dark">AI-Powered</span>
                        </div>
                        <div className="px-4 py-2 bg-bg-card rounded-full shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-text-dark">Secure</span>
                        </div>
                        <div className="px-4 py-2 bg-bg-card rounded-full shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] flex items-center space-x-2">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span className="text-sm font-medium text-text-dark">Fast & Easy</span>
                        </div>
                    </div>

                    <h1 className="text-6xl font-bold text-primary mb-6 leading-tight">
                        {t('landing.title')}
                        <span className="text-accent"> {t('landing.subtitle')}</span>
                    </h1>
                    <p className="text-xl text-text-light mb-8 leading-relaxed">
                        {t('landing.description')}
                    </p>
                    
                    {/* Key benefits */}
                    <div className="flex items-center justify-center space-x-6 mb-12 text-sm text-text-light">
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                            <span>Automatické spracovanie</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                            <span>AI asistent 24/7</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                            <span>Bezpečné úložisko</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-accent text-white text-lg rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all flex items-center space-x-2"
                        >
                            <span>{t('landing.cta.start')}</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 bg-bg-card text-text-dark text-lg rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                        >
                            {t('landing.cta.login')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 pt-8 pb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 - AI Consultant */}
                    <Link href="/dashboard/chat" className="block">
                        <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <MessageSquare className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">{t('landing.feature1.title')}</h3>
                            <p className="text-text-light leading-relaxed">
                                {t('landing.feature1.desc')}
                            </p>
                        </div>
                    </Link>

                    {/* Feature 2 - Document Processing */}
                    <Link href="/dashboard/upload" className="block">
                        <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">{t('landing.feature2.title')}</h3>
                            <p className="text-text-light leading-relaxed">
                                {t('landing.feature2.desc')}
                            </p>
                        </div>
                    </Link>

                    {/* Feature 3 - Tax Returns */}
                    <Link href="/dashboard" className="block">
                        <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">{t('landing.feature3.title')}</h3>
                            <p className="text-text-light leading-relaxed">
                                {t('landing.feature3.desc')}
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="bg-bg-card rounded-3xl p-12 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] text-center">
                    <h2 className="text-4xl font-bold text-primary mb-6">
                        {t('landing.title')}
                    </h2>
                    <p className="text-xl text-text-light mb-8">
                        {t('landing.description')}
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-accent text-white text-lg rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                    >
                        <span>{t('landing.cta.start')}</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
