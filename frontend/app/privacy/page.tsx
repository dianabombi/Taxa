'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
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
                    <span>Späť na hlavnú stránku</span>
                </Link>

                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center shadow-[4px_4px_8px_#A3B1C6,-4px_-4px_8px_#FFFFFF]">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">Zásady ochrany osobných údajov</h1>
                    </div>

                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] space-y-8">
                        <p className="text-text-light">
                            Posledná aktualizácia: {new Date().toLocaleDateString('sk-SK')}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">1. Úvod</h2>
                            <p className="text-text-dark leading-relaxed">
                                Spoločnosť TAXA Platform ("my", "nás", "naša") rešpektuje vaše súkromie a zaväzuje sa chrániť vaše osobné údaje. 
                                Tieto zásady ochrany osobných údajov vysvetľujú, ako zhromažďujeme, používame, zverejňujeme a chránime vaše informácie, 
                                keď používate našu webovú stránku a služby.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">2. Zhromažďované údaje</h2>
                            <div className="space-y-4">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">Osobné identifikačné údaje:</h3>
                                    <ul className="list-disc list-inside text-text-light space-y-1">
                                        <li>Meno a priezvisko</li>
                                        <li>E-mailová adresa</li>
                                        <li>Telefónne číslo</li>
                                        <li>Fakturačné údaje</li>
                                    </ul>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">Údaje o používaní:</h3>
                                    <ul className="list-disc list-inside text-text-light space-y-1">
                                        <li>IP adresa</li>
                                        <li>Typ prehliadača</li>
                                        <li>Stránky, ktoré navštívite</li>
                                        <li>Čas a dátum návštevy</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">3. Použitie údajov</h2>
                            <p className="text-text-dark leading-relaxed mb-4">Vaše údaje používame na:</p>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4">
                                <li>Poskytovanie a zlepšovanie našich služieb</li>
                                <li>Spracovanie vašich daňových priznaní</li>
                                <li>Komunikáciu s vami o vašom účte</li>
                                <li>Zabezpečenie platformy</li>
                                <li>Splnenie zákonných povinností</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">4. Zdieľanie údajov</h2>
                            <p className="text-text-dark leading-relaxed">
                                Vaše osobné údaje nepredávame tretím stranám. Údaje môžeme zdieľať len v týchto prípadoch:
                            </p>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4 mt-4">
                                <li>S vaším výslovným súhlasom</li>
                                <li>Na splnenie zákonných požiadaviek</li>
                                <li>S dôveryhodnými poskytovateľmi služieb (napr. hosting, platobné brány)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">5. Bezpečnosť údajov</h2>
                            <p className="text-text-dark leading-relaxed">
                                Používame priemyselné štandardné bezpečnostné opatrenia na ochranu vašich údajov, vrátane šifrovania, 
                                bezpečného uloženia a pravidelných bezpečnostných auditov.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">6. Vaše práva</h2>
                            <p className="text-text-dark leading-relaxed mb-4">Máte právo:</p>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4">
                                <li>Pristupovať k svojim osobným údajom</li>
                                <li>Opraviť nesprávne údaje</li>
                                <li>Vymazať svoje údaje</li>
                                <li>Obmedziť spracovanie údajov</li>
                                <li>Prenosnosť údajov</li>
                                <li>Namietať voči spracovaniu</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">7. Kontakt</h2>
                            <p className="text-text-dark leading-relaxed">
                                Ak máte akékoľvek otázky týkajúce sa týchto zásad ochrany osobných údajov, kontaktujte nás na:
                            </p>
                            <div className="mt-4 bg-accent/10 border border-accent rounded-xl p-4">
                                <p className="text-text-dark"><strong>E-mail:</strong> privacy@taxa.sk</p>
                                <p className="text-text-dark"><strong>Adresa:</strong> Bratislava, Slovensko</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
