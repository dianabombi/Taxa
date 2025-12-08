'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Scale, Check } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';

export default function GDPRPage() {
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
                            <Scale className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-primary">GDPR - Ochrana osobných údajov</h1>
                    </div>

                    <div className="bg-bg-card rounded-3xl p-8 shadow-[8px_8px_16px_#A3B1C6,-8px_-8px_16px_#FFFFFF] space-y-8">
                        <p className="text-text-light">
                            Posledná aktualizácia: {new Date().toLocaleDateString('sk-SK')}
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">Čo je GDPR?</h2>
                            <p className="text-text-dark leading-relaxed">
                                GDPR (General Data Protection Regulation) je nariadenie Európskej únie č. 2016/679 o ochrane 
                                fyzických osôb pri spracúvaní osobných údajov a o voľnom pohybe takýchto údajov. 
                                Platforma TAXA je plne v súlade s požiadavkami GDPR.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">Vaše práva podľa GDPR</h2>
                            <div className="space-y-3">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">Právo na prístup</h3>
                                        <p className="text-text-light text-sm">
                                            Máte právo vedieť, aké osobné údaje o vás spracúvame a požiadať o ich kópiu.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">Právo na opravu</h3>
                                        <p className="text-text-light text-sm">
                                            Môžete požiadať o opravu nesprávnych alebo neúplných osobných údajov.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">Právo na vymazanie ("právo byť zabudnutý")</h3>
                                        <p className="text-text-light text-sm">
                                            Môžete požiadať o vymazanie svojich osobných údajov za určitých podmienok.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">Právo na obmedzenie spracúvania</h3>
                                        <p className="text-text-light text-sm">
                                            V určitých prípadoch môžete požiadať o obmedzenie spracúvania vašich údajov.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">Právo na prenosnosť údajov</h3>
                                        <p className="text-text-light text-sm">
                                            Máte právo získať svoje osobné údaje v štruktúrovanom, bežne používanom formáte.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">Právo namietať</h3>
                                        <p className="text-text-light text-sm">
                                            Môžete namietať proti spracúvaniu vašich osobných údajov na marketingové účely.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF] flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-text-dark mb-1">Právo podať sťažnosť</h3>
                                        <p className="text-text-light text-sm">
                                            Máte právo podať sťažnosť na Úrad na ochranu osobných údajov SR.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">Ako uplatniť svoje práva</h2>
                            <div className="bg-accent/10 border border-accent rounded-xl p-6 space-y-4">
                                <p className="text-text-dark leading-relaxed">
                                    Na uplatnenie svojich práv nás môžete kontaktovať nasledujúcimi spôsobmi:
                                </p>
                                <div className="space-y-2">
                                    <p className="text-text-dark"><strong>E-mail:</strong> gdpr@taxa.sk</p>
                                    <p className="text-text-dark"><strong>Poštová adresa:</strong> TAXA Platform, Bratislava, Slovensko</p>
                                    <p className="text-text-dark"><strong>Telefón:</strong> +421 900 000 000</p>
                                </div>
                                <p className="text-text-light text-sm">
                                    Odpovieme vám do 30 dní od prijatia žiadosti. V zložitých prípadoch môžeme túto lehotu 
                                    predĺžiť o ďalších 60 dní, o čom vás budeme informovať.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">Právny základ spracovania údajov</h2>
                            <div className="space-y-3">
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">Súhlas</h3>
                                    <p className="text-text-light text-sm">
                                        Pre marketingové účely a analytické cookies vyžadujeme váš výslovný súhlas.
                                    </p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">Plnenie zmluvy</h3>
                                    <p className="text-text-light text-sm">
                                        Spracúvame údaje potrebné na poskytovanie našich služieb (daňové priznania, dokumenty).
                                    </p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">Oprávnený záujem</h3>
                                    <p className="text-text-light text-sm">
                                        Spracúvame údaje na zabezpečenie platformy a predchádzanie podvodom.
                                    </p>
                                </div>
                                <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                    <h3 className="font-semibold text-text-dark mb-2">Zákonná povinnosť</h3>
                                    <p className="text-text-light text-sm">
                                        Uchovávame údaje potrebné na splnenie daňových a účtovných zákonných povinností.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">Doba uchovávania údajov</h2>
                            <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <ul className="space-y-2 text-text-dark">
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">Účtovné dokumenty:</span>
                                        <span>10 rokov (zákonná povinnosť)</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">Daňové priznania:</span>
                                        <span>10 rokov (zákonná povinnosť)</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">Chat história:</span>
                                        <span>2 roky alebo do vymazania účtu</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">Profil používateľa:</span>
                                        <span>Do vymazania účtu</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="font-semibold min-w-[200px]">Marketingový súhlas:</span>
                                        <span>Do odvolania súhlasu</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">Bezpečnosť údajov</h2>
                            <p className="text-text-dark leading-relaxed mb-4">
                                Implementovali sme technické a organizačné opatrenia na ochranu vašich osobných údajov:
                            </p>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">SSL/TLS šifrovanie</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">Firewall ochrana</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">Pravidelné zálohovanie</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">Šifrovanie databázy</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">Kontrola prístupu</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <span className="text-text-dark text-sm">Bezpečnostné audity</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">Kontakt na DPO</h2>
                            <div className="bg-accent/10 border border-accent rounded-xl p-6">
                                <p className="text-text-dark mb-4">
                                    Ak máte akékoľvek otázky týkajúce sa ochrany osobných údajov, kontaktujte 
                                    nášho zodpovedného pracovníka pre ochranu údajov (DPO):
                                </p>
                                <div className="space-y-2">
                                    <p className="text-text-dark"><strong>E-mail:</strong> dpo@taxa.sk</p>
                                    <p className="text-text-dark"><strong>Telefón:</strong> +421 900 000 000</p>
                                    <p className="text-text-dark"><strong>Adresa:</strong> TAXA Platform, Bratislava, Slovensko</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-primary mb-4">Úrad na ochranu osobných údajov SR</h2>
                            <div className="bg-bg-main rounded-xl p-4 shadow-[inset_2px_2px_4px_#A3B1C6,inset_-2px_-2px_4px_#FFFFFF]">
                                <p className="text-text-dark mb-3">
                                    Máte právo podať sťažnosť na dozorný orgán:
                                </p>
                                <p className="text-text-dark"><strong>Úrad na ochranu osobných údajov SR</strong></p>
                                <p className="text-text-light text-sm">Hraničná 12, 820 07 Bratislava 27</p>
                                <p className="text-text-light text-sm">Tel: +421 2 3231 3214</p>
                                <p className="text-text-light text-sm">E-mail: statny.dozor@pdp.gov.sk</p>
                                <p className="text-text-light text-sm">Web: www.dataprotection.gov.sk</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
