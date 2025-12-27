'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Cookie } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/LanguageContext';

export default function CookiePolicyPage() {
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
                            <Cookie className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">{t('cookie_page.title')}</h1>
                    </div>

                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] space-y-8">
                        <p className="text-text-light">
                            {t('common.last_updated')}: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('cookie_page.section1.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('cookie_page.section1.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('cookie_page.section2.title')}</h2>
                            
                            <div className="space-y-4">
                                <div className="bg-bg-main rounded-xl p-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">1</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark mb-2">{t('cookie_page.section2.type1_title')}</h3>
                                            <p className="text-text-light text-sm mb-2">
                                                {t('cookie_page.section2.type1_desc')}
                                            </p>
                                            <p className="text-text-dark text-sm"><strong>{t('cookie_page.section2.purpose_label')}</strong> {t('cookie_page.section2.type1_purpose')}</p>
                                            <p className="text-text-dark text-sm"><strong>{t('cookie_page.section2.validity_label')}</strong> {t('cookie_page.section2.type1_validity')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark mb-2">{t('cookie_page.section2.type2_title')}</h3>
                                            <p className="text-text-light text-sm mb-2">
                                                {t('cookie_page.section2.type2_desc')}
                                            </p>
                                            <p className="text-text-dark text-sm"><strong>{t('cookie_page.section2.purpose_label')}</strong> {t('cookie_page.section2.type2_purpose')}</p>
                                            <p className="text-text-dark text-sm"><strong>{t('cookie_page.section2.validity_label')}</strong> {t('cookie_page.section2.type2_validity')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">3</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark mb-2">{t('cookie_page.section2.type3_title')}</h3>
                                            <p className="text-text-light text-sm mb-2">
                                                {t('cookie_page.section2.type3_desc')}
                                            </p>
                                            <p className="text-text-dark text-sm"><strong>{t('cookie_page.section2.purpose_label')}</strong> {t('cookie_page.section2.type3_purpose')}</p>
                                            <p className="text-text-dark text-sm"><strong>{t('cookie_page.section2.validity_label')}</strong> {t('cookie_page.section2.type3_validity')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-text-light rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">4</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark mb-2">{t('cookie_page.section2.type4_title')}</h3>
                                            <p className="text-text-light text-sm mb-2">
                                                {t('cookie_page.section2.type4_desc')}
                                            </p>
                                            <p className="text-text-dark text-sm"><strong>{t('cookie_page.section2.purpose_label')}</strong> {t('cookie_page.section2.type4_purpose')}</p>
                                            <p className="text-text-dark text-sm"><strong>{t('cookie_page.section2.validity_label')}</strong> {t('cookie_page.section2.type4_validity')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('cookie_page.section3.title')}</h2>
                            <p className="text-text-dark leading-relaxed mb-4">
                                {t('cookie_page.section3.intro')}
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <p className="text-text-dark"><strong>{t('cookie_page.section3.provider1')}</strong> {t('cookie_page.section3.provider1_desc')}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <p className="text-text-dark"><strong>{t('cookie_page.section3.provider2')}</strong> {t('cookie_page.section3.provider2_desc')}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <p className="text-text-dark"><strong>{t('cookie_page.section3.provider3')}</strong> {t('cookie_page.section3.provider3_desc')}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('cookie_page.section4.title')}</h2>
                            <p className="text-text-dark leading-relaxed mb-4">
                                {t('cookie_page.section4.intro')}
                            </p>
                            
                            <div className="bg-accent/10 border border-accent rounded-xl p-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold text-text-dark mb-2">{t('cookie_page.section4.browser_title')}</h3>
                                    <ul className="list-disc list-inside text-text-dark space-y-1 ml-4">
                                        <li><strong>Chrome:</strong> {t('cookie_page.section4.chrome')}</li>
                                        <li><strong>Firefox:</strong> {t('cookie_page.section4.firefox')}</li>
                                        <li><strong>Safari:</strong> {t('cookie_page.section4.safari')}</li>
                                        <li><strong>Edge:</strong> {t('cookie_page.section4.edge')}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-dark mb-2">{t('cookie_page.section4.site_title')}</h3>
                                    <p className="text-text-dark">{t('cookie_page.section4.site_desc')}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('cookie_page.section5.title')}</h2>
                            <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <p className="text-text-dark leading-relaxed">
                                    {t('cookie_page.section5.content')}
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('cookie_page.section6.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('cookie_page.section6.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('cookie_page.section7.title')}</h2>
                            <p className="text-text-dark leading-relaxed mb-4">
                                {t('cookie_page.section7.intro')}
                            </p>
                            <div className="bg-accent/10 border border-accent rounded-xl p-4">
                                <p className="text-text-dark"><strong>{t('cookie_page.section7.email_label')}</strong> cookies@taxa.sk</p>
                                <p className="text-text-dark"><strong>{t('cookie_page.section7.phone_label')}</strong> +421 900 000 000</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
