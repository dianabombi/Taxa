'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">Všeobecné obchodné podmienky</h1>
                    </div>

                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] space-y-8">
                        <p className="text-text-light">
                            Posledná aktualizácia: {new Date().toLocaleDateString('sk-SK')}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">1. Všeobecné ustanovenia</h2>
                            <p className="text-text-dark leading-relaxed">
                                Tieto všeobecné obchodné podmienky (ďalej len "VOP") upravujú práva a povinnosti medzi 
                                spoločnosťou TAXA Platform (ďalej len "poskytovateľ") a používateľmi služby (ďalej len "používateľ"). 
                                Používaním našej platformy súhlasíte s týmito podmienkami.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">2. Vymedzenie pojmov</h2>
                            <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] space-y-2">
                                <p className="text-text-dark"><strong>Platforma:</strong> Webová aplikácia TAXA dostupná na taxa.sk</p>
                                <p className="text-text-dark"><strong>Služby:</strong> Automatická evidencia príjmov a výdavkov, AI pomoc pre každodenné účtovníctvo, generovanie daňových priznaní</p>
                                <p className="text-text-dark"><strong>Účet:</strong> Používateľský účet vytvorený registráciou</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">3. Registrácia a účet</h2>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4">
                                <li>Na používanie služieb je potrebná registrácia</li>
                                <li>Pri registrácii musíte poskytnúť pravdivé a aktuálne údaje</li>
                                <li>Ste zodpovední za bezpečnosť svojho hesla</li>
                                <li>Jeden používateľ môže mať iba jeden aktívny účet</li>
                                <li>Účet nie je prenosný na inú osobu</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">4. Poskytované služby</h2>
                            <p className="text-text-dark leading-relaxed mb-4">Platforma poskytuje nasledujúce služby:</p>
                            <div className="space-y-3">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">Automatická evidencia príjmov a výdavkov</h3>
                                    <p className="text-text-light text-sm">Nahrajte faktúru alebo doklad a TAXA automaticky rozpozná či ide o príjem alebo výdavok a zaradí ho do správnej kategórie</p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">AI pomocník pre každodenné účtovníctvo</h3>
                                    <p className="text-text-light text-sm">Neviete ako niečo zaúčtovať? Opýtajte sa AI vyškoleného na slovenskom daňovom systéme a získajte okamžitú odpoveď</p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">Daňové priznanie na jeden klik</h3>
                                    <p className="text-text-light text-sm">Všetky príjmy a výdavky máte pripravené. Stlačte tlačidlo a TAXA vygeneruje vaše kompletné daňové priznanie</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">5. Poplatky a platby</h2>
                            <p className="text-text-dark leading-relaxed">
                                Základné funkcie platformy sú dostupné bezplatne. Pokročilé funkcie sú spoplatnené podľa aktuálneho cenníka 
                                zverejneného na webovej stránke. Všetky ceny sú uvedené s DPH.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">6. Povinnosti používateľa</h2>
                            <ul className="list-disc list-inside text-text-dark space-y-2 ml-4">
                                <li>Používať služby v súlade so zákonom</li>
                                <li>Poskytnúť pravdivé a aktuálne údaje</li>
                                <li>Nepoužívať platformu na nelegálne účely</li>
                                <li>Nezneužívať AI konzultanta na spam alebo testovanie</li>
                                <li>Nenarúšať funkčnosť platformy</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">7. Obmedzenie zodpovednosti</h2>
                            <div className="bg-accent/10 border border-accent rounded-xl p-4">
                                <p className="text-text-dark leading-relaxed">
                                    Služby sú poskytované "ako sú". Poskytovateľ nezodpovedá za škody vzniknuté nesprávnym použitím služieb 
                                    alebo chybami vo vygenerovaných daňových priznaniach. Odporúčame konzultovať výsledky s daňovým poradcom.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">8. Ukončenie účtu</h2>
                            <p className="text-text-dark leading-relaxed">
                                Používateľ môže kedykoľvek požiadať o zrušenie účtu. Poskytovateľ si vyhradzuje právo zablokovať 
                                alebo zrušiť účet pri porušení týchto VOP.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">9. Zmeny VOP</h2>
                            <p className="text-text-dark leading-relaxed">
                                Poskytovateľ si vyhradzuje právo kedykoľvek zmeniť tieto VOP. O zmenách budeme používateľov informovať 
                                e-mailom a na webovej stránke.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">10. Záverečné ustanovenia</h2>
                            <p className="text-text-dark leading-relaxed">
                                Tieto VOP sa riadia právnym poriadkom Slovenskej republiky. Prípadné spory budú riešené príslušnými 
                                súdmi Slovenskej republiky.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">11. Kontakt</h2>
                            <div className="bg-accent/10 border border-accent rounded-xl p-4">
                                <p className="text-text-dark"><strong>E-mail:</strong> info@taxa.sk</p>
                                <p className="text-text-dark"><strong>Telefón:</strong> +421 900 000 000</p>
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
