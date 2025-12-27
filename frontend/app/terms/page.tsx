'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/LanguageContext';

export default function TermsPage() {
    const { t } = useLanguage();
    
    return (
        <div className="min-h-screen bg-bg-main">
            {/* Logo - Fixed Position */}
            <Link href="/" className="fixed top-2 left-12 z-[100] flex items-center hover:opacity-80 transition-opacity">
                <Image src="/taxa logo.jpg" alt="TAXA Logo" width={100} height={100} className="object-contain rounded-xl" priority />
            </Link>
            
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-end">
                    <LanguageSwitcher />
                </div>
            </nav>

            {/* Content */}
            <div className="container mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center space-x-2 text-text-light hover:text-accent mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t('common.back_home')}</span>
                </Link>

                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">{t('terms.title')}</h1>
                    </div>

                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] space-y-8">
                        <p className="text-text-light">
                            {t('common.last_updated')}: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section1.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('terms.section1.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section2.title')}</h2>
                            <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] space-y-2">
                                <p className="text-text-dark"><strong>{t('terms.section2.platform_label')}</strong> {t('terms.section2.platform_desc')}</p>
                                <p className="text-text-dark"><strong>{t('terms.section2.services_label')}</strong> {t('terms.section2.services_desc')}</p>
                                <p className="text-text-dark"><strong>{t('terms.section2.account_label')}</strong> {t('terms.section2.account_desc')}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section3.title')}</h2>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4">
                                <li>{t('terms.section3.item_1')}</li>
                                <li>{t('terms.section3.item_2')}</li>
                                <li>{t('terms.section3.item_3')}</li>
                                <li>{t('terms.section3.item_4')}</li>
                                <li>{t('terms.section3.item_5')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section4.title')}</h2>
                            <p className="text-text-dark leading-relaxed mb-4">{t('terms.section4.intro')}</p>
                            <div className="space-y-3">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('terms.section4.service1_title')}</h3>
                                    <p className="text-text-light text-sm">{t('terms.section4.service1_desc')}</p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('terms.section4.service2_title')}</h3>
                                    <p className="text-text-light text-sm">{t('terms.section4.service2_desc')}</p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('terms.section4.service3_title')}</h3>
                                    <p className="text-text-light text-sm">{t('terms.section4.service3_desc')}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section5.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('terms.section5.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section6.title')}</h2>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4">
                                <li>{t('terms.section6.item_1')}</li>
                                <li>{t('terms.section6.item_2')}</li>
                                <li>{t('terms.section6.item_3')}</li>
                                <li>{t('terms.section6.item_4')}</li>
                                <li>{t('terms.section6.item_5')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section7.title')}</h2>
                            <div className="bg-accent/10 border border-accent rounded-xl p-4">
                                <p className="text-text-dark leading-relaxed">
                                    {t('terms.section7.content')}
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section8.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('terms.section8.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section9.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('terms.section9.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section10.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('terms.section10.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('terms.section11.title')}</h2>
                            <div className="bg-accent/10 border border-accent rounded-xl p-4">
                                <p className="text-text-dark"><strong>{t('terms.section11.email_label')}</strong> info@taxa.sk</p>
                                <p className="text-text-dark"><strong>{t('terms.section11.phone_label')}</strong> +421 900 000 000</p>
                                <p className="text-text-dark"><strong>{t('terms.section11.address_label')}</strong> {t('terms.section11.address')}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
