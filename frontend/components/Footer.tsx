'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-bg-card border-t border-text-light/10 mt-auto">
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <Link href="/" className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity w-fit">
                            <Image src="/taxa logo.jpg" alt="TAXA Logo" width={35} height={35} className="object-contain" priority />
                            <span className="text-xl font-bold text-primary">TAXA</span>
                        </Link>
                        <p className="text-text-light text-sm leading-relaxed mb-4">
                            {t('footer.company_description')}
                        </p>
                        {/* Social Media */}
                        <div className="flex space-x-3">
                            <a 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-bg-card rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] flex items-center justify-center text-accent hover:text-primary transition-all"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-bg-card rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] flex items-center justify-center text-accent hover:text-primary transition-all"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://linkedin.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-bg-card rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] flex items-center justify-center text-accent hover:text-primary transition-all"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-bg-card rounded-xl shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF] hover:shadow-[6px_6px_12px_#A3B1C6,-6px_-6px_12px_#FFFFFF] flex items-center justify-center text-accent hover:text-primary transition-all"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">{t('footer.legal')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/privacy" className="text-text-light hover:text-accent transition-colors text-sm">
                                    {t('footer.privacy_policy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-text-light hover:text-accent transition-colors text-sm">
                                    {t('footer.terms_of_service')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-text-light hover:text-accent transition-colors text-sm">
                                    {t('footer.cookie_policy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/gdpr" className="text-text-light hover:text-accent transition-colors text-sm">
                                    {t('footer.gdpr')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">{t('footer.contact')}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-2">
                                <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <a href="mailto:info@taxa.sk" className="text-text-light hover:text-accent transition-colors text-sm">
                                    info@taxa.sk
                                </a>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <a href="tel:+421900000000" className="text-text-light hover:text-accent transition-colors text-sm">
                                    +421 900 000 000
                                </a>
                            </li>
                            <li className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-text-light text-sm">
                                    {t('footer.location')}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-text-light/10">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-text-light text-sm">
                            &copy; {currentYear} TAXA. {t('footer.rights')}
                        </p>
                        <div className="flex items-center space-x-6">
                            <Link href="/about" className="text-text-light hover:text-accent transition-colors text-sm">
                                {t('footer.about_us')}
                            </Link>
                            <Link href="/support" className="text-text-light hover:text-accent transition-colors text-sm">
                                {t('footer.support')}
                            </Link>
                            <Link href="/blog" className="text-text-light hover:text-accent transition-colors text-sm">
                                {t('footer.blog')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
