'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Cookie } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-bg-main">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <Image src="/moneybag.png" alt="TAXA Logo" width={50} height={50} className="object-contain" priority />
                        <span className="text-3xl font-bold text-primary">TAXA</span>
                    </Link>
                    <LanguageSwitcher />
                </div>
            </nav>

            {/* Content */}
            <div className="container mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center space-x-2 text-text-light hover:text-accent mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Späť na hlavnú stránku</span>
                </Link>

                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                            <Cookie className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">Zásady používania cookies</h1>
                    </div>

                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] space-y-8">
                        <p className="text-text-light">
                            Posledná aktualizácia: {new Date().toLocaleDateString('sk-SK')}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">1. Čo sú cookies?</h2>
                            <p className="text-text-dark leading-relaxed">
                                Cookies sú malé textové súbory, ktoré sa ukladajú vo vašom zariadení (počítač, tablet, smartfón) 
                                pri návšteve webových stránok. Pomáhajú nám zabezpečiť správne fungovanie stránky, zlepšiť 
                                používateľský zážitok a analyzovať návštevnosť.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">2. Typy cookies, ktoré používame</h2>
                            
                            <div className="space-y-4">
                                <div className="bg-bg-main rounded-xl p-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">1</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark mb-2">Nevyhnutné cookies</h3>
                                            <p className="text-text-light text-sm mb-2">
                                                Tieto cookies sú nevyhnutné pre správne fungovanie webovej stránky. 
                                                Bez nich by stránka nefungovala správne.
                                            </p>
                                            <p className="text-text-dark text-sm"><strong>Účel:</strong> Autentifikácia, bezpečnosť, jazykové nastavenia</p>
                                            <p className="text-text-dark text-sm"><strong>Platnosť:</strong> Session / 1 rok</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark mb-2">Analytické cookies</h3>
                                            <p className="text-text-light text-sm mb-2">
                                                Pomáhajú nám pochopiť, ako používatelia interagujú s našou stránkou. 
                                                Zbierame anonymné štatistiky o návštevnosti.
                                            </p>
                                            <p className="text-text-dark text-sm"><strong>Účel:</strong> Google Analytics, analýza návštevnosti</p>
                                            <p className="text-text-dark text-sm"><strong>Platnosť:</strong> 2 roky</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">3</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark mb-2">Funkčné cookies</h3>
                                            <p className="text-text-light text-sm mb-2">
                                                Umožňujú stránke zapamätať si vaše preferencie a nastavenia 
                                                pre lepší používateľský zážitok.
                                            </p>
                                            <p className="text-text-dark text-sm"><strong>Účel:</strong> Jazykové preferencie, nastavenia zobrazenia</p>
                                            <p className="text-text-dark text-sm"><strong>Platnosť:</strong> 1 rok</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-6 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-text-light rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">4</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-dark mb-2">Marketingové cookies</h3>
                                            <p className="text-text-light text-sm mb-2">
                                                Používajú sa na zobrazenie relevantných reklám a meranie efektivity 
                                                marketingových kampaní.
                                            </p>
                                            <p className="text-text-dark text-sm"><strong>Účel:</strong> Cielená reklama, remarketing</p>
                                            <p className="text-text-dark text-sm"><strong>Platnosť:</strong> 90 dní</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">3. Cookies tretích strán</h2>
                            <p className="text-text-dark leading-relaxed mb-4">
                                Na našej stránke môžu byť použité cookies od nasledujúcich poskytovateľov:
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <p className="text-text-dark"><strong>Google Analytics:</strong> Analýza návštevnosti</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <p className="text-text-dark"><strong>Google Ads:</strong> Marketingové kampane</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <p className="text-text-dark"><strong>Facebook Pixel:</strong> Sociálne médiá a remarketing</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">4. Správa cookies</h2>
                            <p className="text-text-dark leading-relaxed mb-4">
                                Môžete kedykoľvek zmeniť nastavenia cookies alebo ich odmietnuť:
                            </p>
                            
                            <div className="bg-accent/10 border border-accent rounded-xl p-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold text-text-dark mb-2">V nastaveniach prehliadača:</h3>
                                    <ul className="list-disc list-inside text-text-dark space-y-1 ml-4">
                                        <li><strong>Chrome:</strong> Nastavenia → Ochrana súkromia a zabezpečenie → Cookies</li>
                                        <li><strong>Firefox:</strong> Možnosti → Súkromie a zabezpečenie → Cookies</li>
                                        <li><strong>Safari:</strong> Predvoľby → Súkromie → Cookies</li>
                                        <li><strong>Edge:</strong> Nastavenia → Cookies a povolenia stránok</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-dark mb-2">Na našej stránke:</h3>
                                    <p className="text-text-dark">Môžete upraviť svoje preferencie v nastaveniach účtu.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">5. Dôsledky odmietnutia cookies</h2>
                            <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <p className="text-text-dark leading-relaxed">
                                    Ak odmietne nevyhnutné cookies, niektoré funkcie stránky nebudú fungovať správne. 
                                    Nebudete sa môcť prihlásiť do účtu a používať plný rozsah služieb platformy TAXA.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">6. Aktualizácie zásad</h2>
                            <p className="text-text-dark leading-relaxed">
                                Tieto zásady používania cookies môžeme príležitostne aktualizovať. O významných zmenách 
                                vás budeme informovať prostredníctvom oznámenia na stránke alebo e-mailom.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">7. Kontakt</h2>
                            <p className="text-text-dark leading-relaxed mb-4">
                                Ak máte otázky týkajúce sa používania cookies, kontaktujte nás:
                            </p>
                            <div className="bg-accent/10 border border-accent rounded-xl p-4">
                                <p className="text-text-dark"><strong>E-mail:</strong> cookies@taxa.sk</p>
                                <p className="text-text-dark"><strong>Telefón:</strong> +421 900 000 000</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
