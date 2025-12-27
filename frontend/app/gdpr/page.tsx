'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Scale, Check } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/LanguageContext';

export default function GDPRPage() {
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
                            <Scale className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">{t('gdpr.title')}</h1>
                    </div>

                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] space-y-8">
                        <p className="text-text-light">
                            {t('common.last_updated')}: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('gdpr.intro.title')}</h2>
                            <p className="text-text-dark leading-relaxed">
                                {t('gdpr.intro.content')}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('gdpr.rights.title')}</h2>
                            <div className="space-y-3">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">{t('gdpr.rights.right1_title')}</h3>
                                        <p className="text-text-light text-sm">{t('gdpr.rights.right1_desc')}</p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">{t('gdpr.rights.right2_title')}</h3>
                                        <p className="text-text-light text-sm">{t('gdpr.rights.right2_desc')}</p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">{t('gdpr.rights.right3_title')}</h3>
                                        <p className="text-text-light text-sm">{t('gdpr.rights.right3_desc')}</p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">{t('gdpr.rights.right4_title')}</h3>
                                        <p className="text-text-light text-sm">{t('gdpr.rights.right4_desc')}</p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">{t('gdpr.rights.right5_title')}</h3>
                                        <p className="text-text-light text-sm">{t('gdpr.rights.right5_desc')}</p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">{t('gdpr.rights.right6_title')}</h3>
                                        <p className="text-text-light text-sm">{t('gdpr.rights.right6_desc')}</p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">{t('gdpr.rights.right7_title')}</h3>
                                        <p className="text-text-light text-sm">{t('gdpr.rights.right7_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('gdpr.exercise.title')}</h2>
                            <div className="bg-accent/10 border border-accent rounded-xl p-6 space-y-4">
                                <p className="text-text-dark leading-relaxed">{t('gdpr.exercise.intro')}</p>
                                <div className="space-y-2">
                                    <p className="text-text-dark"><strong>{t('gdpr.exercise.email_label')}</strong> gdpr@taxa.sk</p>
                                    <p className="text-text-dark"><strong>{t('gdpr.exercise.address_label')}</strong> {t('gdpr.exercise.address')}</p>
                                    <p className="text-text-dark"><strong>{t('gdpr.exercise.phone_label')}</strong> +421 900 000 000</p>
                                </div>
                                <p className="text-text-light text-sm">{t('gdpr.exercise.response_time')}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('gdpr.legal_basis.title')}</h2>
                            <div className="space-y-3">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('gdpr.legal_basis.basis1_title')}</h3>
                                    <p className="text-text-light text-sm">{t('gdpr.legal_basis.basis1_desc')}</p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('gdpr.legal_basis.basis2_title')}</h3>
                                    <p className="text-text-light text-sm">{t('gdpr.legal_basis.basis2_desc')}</p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('gdpr.legal_basis.basis3_title')}</h3>
                                    <p className="text-text-light text-sm">{t('gdpr.legal_basis.basis3_desc')}</p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">{t('gdpr.legal_basis.basis4_title')}</h3>
                                    <p className="text-text-light text-sm">{t('gdpr.legal_basis.basis4_desc')}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('gdpr.retention.title')}</h2>
                            <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <ul className="space-y-2 text-text-dark">
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">{t('gdpr.retention.item1_label')}</span>
                                        <span>{t('gdpr.retention.item1_period')}</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">{t('gdpr.retention.item2_label')}</span>
                                        <span>{t('gdpr.retention.item2_period')}</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">{t('gdpr.retention.item3_label')}</span>
                                        <span>{t('gdpr.retention.item3_period')}</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">{t('gdpr.retention.item4_label')}</span>
                                        <span>{t('gdpr.retention.item4_period')}</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">{t('gdpr.retention.item5_label')}</span>
                                        <span>{t('gdpr.retention.item5_period')}</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('gdpr.security.title')}</h2>
                            <p className="text-text-dark leading-relaxed mb-4">{t('gdpr.security.intro')}</p>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">{t('gdpr.security.measure1')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">{t('gdpr.security.measure2')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">{t('gdpr.security.measure3')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">{t('gdpr.security.measure4')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">{t('gdpr.security.measure5')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">{t('gdpr.security.measure6')}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('gdpr.dpo.title')}</h2>
                            <div className="bg-accent/10 border border-accent rounded-xl p-6">
                                <p className="text-text-dark mb-4">{t('gdpr.dpo.intro')}</p>
                                <div className="space-y-2">
                                    <p className="text-text-dark"><strong>{t('gdpr.dpo.email_label')}</strong> dpo@taxa.sk</p>
                                    <p className="text-text-dark"><strong>{t('gdpr.dpo.phone_label')}</strong> +421 900 000 000</p>
                                    <p className="text-text-dark"><strong>{t('gdpr.dpo.address_label')}</strong> {t('gdpr.dpo.address')}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">{t('gdpr.authority.title')}</h2>
                            <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <p className="text-text-dark mb-3">{t('gdpr.authority.intro')}</p>
                                <p className="text-text-dark"><strong>{t('gdpr.authority.name')}</strong></p>
                                <p className="text-text-light text-sm">{t('gdpr.authority.address')}</p>
                                <p className="text-text-light text-sm">{t('gdpr.authority.phone')}</p>
                                <p className="text-text-light text-sm">{t('gdpr.authority.email')}</p>
                                <p className="text-text-light text-sm">{t('gdpr.authority.web')}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
