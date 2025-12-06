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
            <nav className="sticky top-0 z-50 bg-bg-card/95 backdrop-blur-md border-b border-text-light/10 shadow-[0_4px_12px_rgba(163,177,198,0.3)]">
                <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
                            <Image src="/moneybag.png" alt="TAXA Logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px] object-contain" priority />
                            <span className="text-2xl sm:text-3xl font-bold text-primary">TAXA</span>
                        </Link>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <LanguageSwitcher />
                            <Link
                                href="/login"
                                className="px-3 py-2 text-sm sm:text-base text-text-dark hover:text-accent transition-colors hidden sm:block"
                            >
                                {t('auth.login.button')}
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-accent text-white rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                            >
                                {t('auth.register.title')}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-8 sm:pb-12 text-center relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                
                <div className="max-w-4xl mx-auto relative">
                    {/* Trust badges */}
                    <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
                        <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-bg-card rounded-full shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs sm:text-sm font-medium text-text-dark">AI-Powered</span>
                        </div>
                        <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-bg-card rounded-full shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] flex items-center space-x-2">
                            <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-accent" />
                            <span className="text-xs sm:text-sm font-medium text-text-dark">Secure</span>
                        </div>
                        <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-bg-card rounded-full shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] flex items-center space-x-2">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span className="text-xs sm:text-sm font-medium text-text-dark">Fast & Easy</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 sm:mb-6 leading-tight">
                        {t('landing.title')}
                        <span className="text-accent"> {t('landing.subtitle')}</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-text-light mb-6 sm:mb-8 leading-relaxed px-2">
                        {t('landing.description')}
                    </p>
                    
                    {/* Key benefits */}
                    <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 mb-8 sm:mb-12 text-xs sm:text-sm text-text-light">
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
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white text-base sm:text-lg rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all flex items-center justify-center space-x-2"
                        >
                            <span>{t('landing.cta.start')}</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-bg-card text-text-dark text-base sm:text-lg rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
                        >
                            {t('landing.cta.login')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* Feature 1 - AI Consultant */}
                    <Link href="/dashboard/chat" className="block">
                        <div className="bg-bg-card rounded-3xl p-6 sm:p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                                <MessageSquare className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">{t('landing.feature1.title')}</h3>
                            <p className="text-text-light leading-relaxed">
                                {t('landing.feature1.desc')}
                            </p>
                        </div>
                    </Link>

                    {/* Feature 2 - Document Processing */}
                    <Link href="/dashboard/upload" className="block">
                        <div className="bg-bg-card rounded-3xl p-6 sm:p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer">
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
                        <div className="bg-bg-card rounded-3xl p-6 sm:p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] hover:shadow-[10px_10px_20px_#A3B1C6,-10px_-10px_20px_#FFFFFF] hover:scale-105 transition-all cursor-pointer">
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
            <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <div className="bg-bg-card rounded-3xl p-6 sm:p-8 md:p-12 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6">
                        {t('landing.title')}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-text-light mb-6 sm:mb-8 px-2">
                        {t('landing.description')}
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white text-base sm:text-lg rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] transition-all"
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
