'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/LanguageContext';

export default function PrivacyPolicyPage() {
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
                    <span>{t('privacy.back_home')}</span>
                </Link>

                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">{t('privacy.title')}</h1>
                    </div>

                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] space-y-8">
                        <p className="text-text-light">
                            {t('privacy.last_updated')}: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('privacy.section1.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('privacy.section1.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('privacy.section2.title')}</h2>
                            <div className="space-y-4">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('privacy.section2.personal_title')}</h3>
                                    <ul className="list-disc list-inside text-text-light space-y-1">
                                        <li>{t('privacy.section2.personal_1')}</li>
                                        <li>{t('privacy.section2.personal_2')}</li>
                                        <li>{t('privacy.section2.personal_3')}</li>
                                        <li>{t('privacy.section2.personal_4')}</li>
                                    </ul>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('privacy.section2.usage_title')}</h3>
                                    <ul className="list-disc list-inside text-text-light space-y-1">
                                        <li>{t('privacy.section2.usage_1')}</li>
                                        <li>{t('privacy.section2.usage_2')}</li>
                                        <li>{t('privacy.section2.usage_3')}</li>
                                        <li>{t('privacy.section2.usage_4')}</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('privacy.section3.title')}</h2>
                            <p className="text-text-dark leading-relaxed mb-4">{t('privacy.section3.intro')}</p>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4">
                                <li>{t('privacy.section3.item_1')}</li>
                                <li>{t('privacy.section3.item_2')}</li>
                                <li>{t('privacy.section3.item_3')}</li>
                                <li>{t('privacy.section3.item_4')}</li>
                                <li>{t('privacy.section3.item_5')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('privacy.section4.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('privacy.section4.intro')}
                            </p>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4 mt-4">
                                <li>{t('privacy.section4.item_1')}</li>
                                <li>{t('privacy.section4.item_2')}</li>
                                <li>{t('privacy.section4.item_3')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('privacy.section5.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('privacy.section5.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('privacy.section6.title')}</h2>
                            <p className="text-text-dark leading-relaxed mb-4">{t('privacy.section6.intro')}</p>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4">
                                <li>{t('privacy.section6.right_1')}</li>
                                <li>{t('privacy.section6.right_2')}</li>
                                <li>{t('privacy.section6.right_3')}</li>
                                <li>{t('privacy.section6.right_4')}</li>
                                <li>{t('privacy.section6.right_5')}</li>
                                <li>{t('privacy.section6.right_6')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('privacy.section7.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('privacy.section7.intro')}
                            </p>
                            <div className="mt-4 bg-accent/10 border border-accent rounded-xl p-4">
                                <p className="text-text-dark"><strong>{t('privacy.section7.email_label')}</strong> privacy@taxa.sk</p>
                                <p className="text-text-dark"><strong>{t('privacy.section7.address_label')}</strong> {t('privacy.section7.address')}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
