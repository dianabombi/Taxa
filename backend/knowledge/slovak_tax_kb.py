"""
Slovak Tax Legislation Knowledge Base
Comprehensive database of Slovak tax laws, regulations, deadlines, and procedures
For AI-powered tax assistance
"""

from typing import Dict, List
from datetime import datetime


class SlovakTaxKnowledgeBase:
    """
    Knowledge base for Slovak tax legislation and procedures
    Updated for 2024/2025 tax year
    """
    
    def __init__(self):
        self.knowledge = self._build_knowledge_base()
    
    def _build_knowledge_base(self) -> Dict:
        """Build comprehensive Slovak tax knowledge base"""
        return {
            "tax_rates": self._get_tax_rates(),
            "deadlines": self._get_tax_deadlines(),
            "forms": self._get_tax_forms(),
            "deductions": self._get_deductions(),
            "vat_info": self._get_vat_info(),
            "insurance": self._get_insurance_info(),
            "procedures": self._get_procedures(),
            "legislation": self._get_legislation(),
            "common_questions": self._get_common_questions(),
            "penalties": self._get_penalties(),
            "benefits": self._get_tax_benefits()
        }
    
    def _get_tax_rates(self) -> Dict:
        """Slovak income tax rates for 2024"""
        return {
            "income_tax": {
                "year": 2024,
                "rates": {
                    "basic_rate": {
                        "rate": "19%",
                        "threshold": "0 - 41,445.37 €",
                        "description": "Základná sadzba dane pre príjmy do 41,445.37 €"
                    },
                    "higher_rate": {
                        "rate": "25%",
                        "threshold": "nad 41,445.37 €",
                        "description": "Vyššia sadzba dane pre príjmy presahujúce 41,445.37 €"
                    }
                },
                "non_taxable_minimum": {
                    "amount": "5,174.70 €",
                    "description": "Nezdaniteľná časť základu dane ročne"
                }
            },
            "corporate_tax": {
                "standard_rate": "21%",
                "small_business": {
                    "rate": "15%",
                    "condition": "Príjmy do 100,000 €",
                    "description": "Znížená sadzba pre malé podniky"
                }
            }
        }
    
    def _get_tax_deadlines(self) -> Dict:
        """Important tax deadlines for Slovak taxpayers"""
        return {
            "annual_deadlines": {
                "dpfo_filing": {
                    "date": "31. marec",
                    "extension_date": "30. jún (s daňovým poradcom)",
                    "description": "Podanie daňového priznania k dani z príjmov fyzických osôb (DPFO)",
                    "penalty": "Pokuta až do 3,500 € za nepodanie"
                },
                "dppo_filing": {
                    "date": "31. marec",
                    "extension_date": "30. jún (s daňovým poradcom)",
                    "description": "Podanie daňového priznania k dani z príjmov právnických osôb (DPPO)"
                },
                "vat_annual": {
                    "date": "31. január",
                    "description": "Súhrnné hlásenie DPH za predchádzajúci rok (pre platiteľov DPH)"
                }
            },
            "monthly_deadlines": {
                "vat_monthly": {
                    "date": "25. deň nasledujúceho mesiaca",
                    "description": "Mesačné kontrolné výkazy DPH a platba DPH"
                },
                "income_tax_advance": {
                    "date": "Kvartálne/Polročne",
                    "description": "Preddavky na daň z príjmov pre SZČO"
                }
            },
            "quarterly_deadlines": {
                "vat_quarterly": {
                    "date": "25. deň po konci štvrťroka",
                    "description": "Štvrťročné kontrolné výkazy DPH (pre menších platiteľov)"
                },
                "social_insurance": {
                    "date": "Do 8. dňa nasledujúceho mesiaca",
                    "description": "Platba odvodov do Sociálnej poisťovne"
                },
                "health_insurance": {
                    "date": "Do 8. dňa nasledujúceho mesiaca",
                    "description": "Platba odvodov do zdravotnej poisťovne"
                }
            }
        }
    
    def _get_tax_forms(self) -> Dict:
        """Slovak tax forms and where to get them"""
        return {
            "dpfo": {
                "type_a": {
                    "name": "DPFO typ A",
                    "for": "Zamestnanci (len príjmy zo závislej činnosti)",
                    "url": "https://www.financnasprava.sk/sk/elektronicke-sluzby/verejne-sluzby/elektronicke-formular/tlaciva-danovych-priznan"
                },
                "type_b": {
                    "name": "DPFO typ B",
                    "for": "SZČO - živnostníci, slobodné povolania",
                    "url": "https://www.financnasprava.sk/sk/elektronicke-sluzby/verejne-sluzby/elektronicke-formular/tlaciva-danovych-priznan",
                    "description": "Najčastejšie pre samostatne zárobkovo činné osoby"
                }
            },
            "vat_forms": {
                "kontrolny_vykaz": {
                    "name": "Kontrolný výkaz DPH",
                    "frequency": "Mesačne/Štvrťročne",
                    "url": "https://www.financnasprava.sk/sk/elektronicke-sluzby/verejne-sluzby/elektronicke-formular"
                },
                "suhrne_hlasenie": {
                    "name": "Súhrnné hlásenie",
                    "for": "Dodávky do EÚ",
                    "frequency": "Mesačne"
                }
            },
            "electronic_filing": {
                "portal": "www.slovensko.sk",
                "description": "Elektronické podanie cez portál slovensko.sk s eID alebo kvalifikovaným certifikátom",
                "advantage": "Predĺžený termín do 30. júna"
            }
        }
    
    def _get_deductions(self) -> Dict:
        """Tax deductible items and expenses"""
        return {
            "self_employed_expenses": {
                "flat_rate": {
                    "standard": {
                        "rate": "60%",
                        "description": "Paušálne výdavky pre väčšinu povolaní",
                        "example": "Príjem 30,000 € → Výdavky 18,000 € → Základ dane 12,000 €"
                    },
                    "craft": {
                        "rate": "40%",
                        "description": "Paušálne výdavky pre remeselnícke činnosti"
                    }
                },
                "actual_expenses": {
                    "description": "Skutočné preukázateľné výdavky",
                    "requires": "Faktúry, doklady, účtovné záznamy",
                    "examples": [
                        "Nákup materiálu a tovaru",
                        "Nájomné kancelárie/priestorov",
                        "Energie (elektrika, plyn, voda)",
                        "Komunikácie (telefón, internet)",
                        "Cestovné náklady",
                        "Daňové poradenstvo",
                        "Účtovnícke služby",
                        "Software a licencie",
                        "Vzdelávanie súvisiace s podnikaním",
                        "Reklama a marketing"
                    ]
                }
            },
            "non_taxable_parts": {
                "mortgage_interest": {
                    "max_amount": "Do výšky zaplateného úroku",
                    "description": "Úroky z hypotéky na vlastné bývanie"
                },
                "donations": {
                    "max_amount": "20% základu dane alebo min. 3% z príjmov",
                    "description": "Dary na verejnoprospešné účely, registrované organizácie"
                },
                "pension_contributions": {
                    "max_amount": "180 € ročne",
                    "description": "Príspevky do doplnkového dôchodkového sporenia (3. pilier)"
                }
            },
            "tax_bonus_children": {
                "amount": "140 € mesačne na dieťa",
                "annual": "1,680 € ročne na dieťa",
                "condition": "Vyživované dieťa do 18 rokov (resp. 25 rokov študent)",
                "description": "Daňový bonus na vyživované deti"
            }
        }
    
    def _get_vat_info(self) -> Dict:
        """VAT (DPH) information for Slovakia"""
        return {
            "registration_threshold": {
                "amount": "49,790 €",
                "period": "Za predchádzajúcich 12 po sebe nasledujúcich kalendárnych mesiacov",
                "description": "Povinná registrácia DPH po prekročení obratu"
            },
            "vat_rates": {
                "standard": {
                    "rate": "20%",
                    "applies_to": "Väčšina tovarov a služieb"
                },
                "reduced": {
                    "rate": "10%",
                    "applies_to": [
                        "Potraviny",
                        "Lieky",
                        "Knihy",
                        "Niektoré zdravotnícke pomôcky"
                    ]
                }
            },
            "vat_payer_obligations": {
                "kontrolny_vykaz": "Mesačne/štvrťročne do 25. dňa",
                "payment": "Do 25. dňa nasledujúceho mesiaca",
                "intrastat": "Pri obchode v rámci EÚ",
                "suhrne_hlasenie": "Pri dodávkach do iných krajín EÚ"
            },
            "vat_deduction": {
                "description": "Odpočítanie DPH na vstupe",
                "requires": "Byť platiteľom DPH, mať faktúru s DPH",
                "examples": "Nákup tovaru, služieb, energie pre podnikanie"
            }
        }
    
    def _get_insurance_info(self) -> Dict:
        """Social and health insurance for self-employed"""
        return {
            "social_insurance": {
                "rate": "31.2%",
                "components": {
                    "sickness": "4.4%",
                    "pension": "18.0%",
                    "disability": "6.0%",
                    "unemployment": "0.0% (SZČO neplatí)",
                    "guarantee": "0.0% (SZČO neplatí)",
                    "reserve_fund": "2.8%"
                },
                "minimum_base_2024": {
                    "amount": "701.37 € mesačne",
                    "annual": "8,416.44 €"
                },
                "minimum_monthly_payment": "218.82 € (31.2% z 701.37 €)",
                "deadline": "Do 8. dňa nasledujúceho mesiaca"
            },
            "health_insurance": {
                "rate": "14%",
                "minimum_base_2024": "701.37 € mesačne",
                "minimum_monthly_payment": "98.19 € (14% z 701.37 €)",
                "deadline": "Do 8. dňa nasledujúceho mesiaca",
                "providers": [
                    "Všeobecná zdravotná poisťovňa (VšZP)",
                    "Dôvera zdravotná poisťovňa",
                    "Union zdravotná poisťovňa"
                ]
            },
            "calculation_example": {
                "scenario": "SZČO s príjmom 30,000 € ročne, paušálne výdavky 60%",
                "income": "30,000 €",
                "expenses": "18,000 € (60%)",
                "tax_base": "12,000 €",
                "monthly_assessment_base": "1,000 € (12,000 / 12)",
                "social_insurance_monthly": "312 € (31.2% z 1,000)",
                "health_insurance_monthly": "140 € (14% z 1,000)",
                "total_monthly": "452 €",
                "total_annual": "5,424 €"
            }
        }
    
    def _get_procedures(self) -> Dict:
        """Step-by-step procedures for common tax tasks"""
        return {
            "start_business": {
                "steps": [
                    "1. Registrácia živnosti na Živnostenskom úrade (alebo príslušnej profesijnej komore)",
                    "2. Automatické pridelenie IČO",
                    "3. Registrácia na Daňovom úrade (DIČ) - do 30 dní",
                    "4. Registrácia v Sociálnej poisťovni - do 8 dní",
                    "5. Registrácia v zdravotnej poisťovni - do 8 dní",
                    "6. Registrácia pre DPH (ak je potrebná) - dobrovoľne alebo povinne po prekročení obratu",
                    "7. Zriadenie účtu v banke (odporúčané)",
                    "8. Voľba typu účtovníctva (jednoduché/podvojné)"
                ],
                "documents_needed": [
                    "Občiansky preukaz",
                    "Doklad o vzdelaní (ak je potrebný pre živnosť)",
                    "Výpis z registra trestov (pre viazané živnosti)"
                ]
            },
            "file_tax_return": {
                "steps": [
                    "1. Zozbierať všetky doklady (faktúry, výdavky, príjmy)",
                    "2. Vypočítať príjmy a výdavky za celý rok",
                    "3. Vyplniť formulár DPFO typ B",
                    "4. Priložiť prílohy (ak sú potrebné)",
                    "5. Podať elektronicky cez slovensko.sk ALEBO osobne/poštou",
                    "6. Uhradiť daň do 31. marca (resp. 30. júna)"
                ],
                "deadline": "31. marec (alebo 30. jún s daňovým poradcom)",
                "electronic_advantage": "Predĺžený termín, rýchlejšie spracovanie"
            },
            "register_vat": {
                "voluntary": {
                    "when": "Kedykoľvek, aj s nulovým obratom",
                    "advantage": "Možnosť odpočítať DPH na vstupe",
                    "disadvantage": "Administratívna záťaž (mesačné/štvrťročné výkazy)"
                },
                "mandatory": {
                    "when": "Po prekročení obratu 49,790 € za 12 mesiacov",
                    "deadline": "Do 20 dní po prekročení",
                    "penalty": "Pokuta za neskorú registráciu"
                }
            }
        }
    
    def _get_legislation(self) -> Dict:
        """Key Slovak tax legislation references"""
        return {
            "main_laws": {
                "income_tax": {
                    "number": "Zákon č. 595/2003 Z.z.",
                    "name": "Zákon o dani z príjmov",
                    "url": "https://www.zakonypreludi.sk/zz/2003-595"
                },
                "vat": {
                    "number": "Zákon č. 222/2004 Z.z.",
                    "name": "Zákon o dani z pridanej hodnoty",
                    "url": "https://www.zakonypreludi.sk/zz/2004-222"
                },
                "tax_administration": {
                    "number": "Zákon č. 563/2009 Z.z.",
                    "name": "Zákon o správe daní (daňový poriadok)",
                    "url": "https://www.zakonypreludi.sk/zz/2009-563"
                }
            },
            "authorities": {
                "financial_administration": {
                    "name": "Finančná správa SR",
                    "website": "https://www.financnasprava.sk",
                    "contact": "048/431 7222 (call centrum)"
                },
                "social_insurance": {
                    "name": "Sociálna poisťovňa",
                    "website": "https://www.socpoist.sk",
                    "contact": "0800 123 123"
                }
            }
        }
    
    def _get_common_questions(self) -> Dict:
        """FAQ - Common questions and answers"""
        return {
            "q1": {
                "question": "Kedy musím podať daňové priznanie?",
                "answer": "Daňové priznanie DPFO sa podáva do 31. marca (alebo do 30. júna, ak ho podáva daňový poradca). Týka sa to SZČO a osôb s príjmami zo závislej činnosti, ktoré chcú uplatniť odpočty alebo mali príjmy od viacerých zamestnávateľov."
            },
            "q2": {
                "question": "Aký je rozdiel medzi paušálnymi a skutočnými výdavkami?",
                "answer": "Paušálne výdavky sú 60% (resp. 40%) z príjmov bez potreby dokladov. Skutočné výdavky sú preukázateľné náklady s faktúrami. Použijete tú variantu, ktorá je pre vás výhodnejšia."
            },
            "q3": {
                "question": "Kedy sa musím registrovať ako platiteľ DPH?",
                "answer": "Povinne po prekročení obratu 49,790 € za posledných 12 mesiacov. Dobrovoľne kedykoľvek, ak chcete odpočítavať DPH na vstupe."
            },
            "q4": {
                "question": "Koľko platím na odvody ako SZČO?",
                "answer": "Minimálne: Sociálne poistenie 218.82 € + zdravotné poistenie 98.19 € = 317 € mesačne (z minimálneho základu 701.37 €). Ak je váš zisk vyšší, odvody sa počítajú z polovice zisku."
            },
            "q5": {
                "question": "Môžem si uplatniť daňový bonus na deti?",
                "answer": "Áno, ak máte vyživované dieťa. Daňový bonus je 140 € mesačne (1,680 € ročne) na každé dieťa. Znižuje sa daň, prípadne dostanete preplatok."
            },
            "q6": {
                "question": "Aké výdavky si môžem dať do nákladov?",
                "answer": "Všetky výdavky súvisiace s podnikaním: nákup tovaru, nájom, energie, telefón, internet, software, účtovníctvo, reklama, cestovné, vzdelávanie. Musíte mať faktúry a doklady."
            }
        }
    
    def _get_penalties(self) -> Dict:
        """Penalties for non-compliance"""
        return {
            "late_filing": {
                "dpfo": "Pokuta do 3,500 € za nepodanie alebo omeškanie daňového priznania",
                "vat": "Pokuta do 3,000 € za nepodanie kontrolného výkazu DPH"
            },
            "late_payment": {
                "interest": "Úrok z omeškania - aktuálne 9.5% ročne (2024)",
                "penalty": "Dodatočná pokuta až do výšky nezaplatenej dane"
            },
            "incorrect_filing": {
                "penalty": "Pokuta za nesprávne údaje do 10,000 €",
                "correction": "Možnosť dodatočného daňového priznania do 3 rokov"
            }
        }
    
    def _get_tax_benefits(self) -> Dict:
        """Tax benefits and optimization tips"""
        return {
            "legal_optimization": {
                "expense_choice": "Porovnajte paušálne vs. skutočné výdavky - použite výhodnejšie",
                "vat_timing": "Ak nakupujete drahé vybavenie, registrujte sa na DPH pred nákupom",
                "income_timing": "Rozložte príjmy medzi roky, ak je to možné",
                "family_help": "Zamestnajte rodinného príslušníka (zdanenie len 19% namiesto 19% + odvody)"
            },
            "deductions_maximize": {
                "children": "Uplatnite daňový bonus na všetky vyživované deti",
                "mortgage": "Uplatnite úroky z hypotéky",
                "donations": "Darujte na verejnoprospešné účely (odpočet až 20% základu dane)",
                "pension": "Sporenie na dôchodok v 3. pilieri (odpočet do 180 €)"
            },
            "avoid_mistakes": {
                "keep_receipts": "Uchovávajte všetky faktúry a doklady min. 10 rokov",
                "separate_accounts": "Oddeľte podnikateľské a osobné financie",
                "regular_payments": "Plaťte odvody včas (vyhnutie sa úrokom z omeškania)",
                "use_accountant": "Zvážte účtovníka/daňového poradcu pri zložitejších prípadoch"
            }
        }
    
    def search_knowledge(self, query: str) -> List[Dict]:
        """
        Search knowledge base for relevant information
        Simple keyword matching - can be enhanced with embeddings/vector search
        """
        query_lower = query.lower()
        results = []
        
        # Keywords mapping
        keywords_map = {
            "sadzba": ["tax_rates"],
            "termín": ["deadlines"],
            "lehota": ["deadlines"],
            "formulár": ["forms"],
            "tlačivo": ["forms"],
            "odpočet": ["deductions"],
            "výdavky": ["deductions"],
            "dph": ["vat_info"],
            "odvody": ["insurance"],
            "poistné": ["insurance"],
            "postup": ["procedures"],
            "ako": ["procedures"],
            "zákon": ["legislation"],
            "pokuta": ["penalties"],
            "bonus": ["benefits", "deductions"],
            "deti": ["deductions"],
        }
        
        # Find relevant sections
        relevant_sections = set()
        for keyword, sections in keywords_map.items():
            if keyword in query_lower:
                relevant_sections.update(sections)
        
        # If no specific keywords, return common questions
        if not relevant_sections:
            relevant_sections = ["common_questions"]
        
        # Collect results
        for section in relevant_sections:
            if section in self.knowledge:
                results.append({
                    "section": section,
                    "data": self.knowledge[section]
                })
        
        return results
    
    def get_context_for_ai(self, query: str) -> str:
        """
        Get formatted context for AI based on user query
        Returns string with relevant knowledge
        """
        results = self.search_knowledge(query)
        
        if not results:
            return "Všeobecné informácie o slovenskom daňovom systéme sú k dispozícii."
        
        context = "KONTEXT - Slovenská daňová legislatíva:\n\n"
        
        for result in results:
            section_name = result["section"].replace("_", " ").title()
            context += f"=== {section_name} ===\n"
            context += self._format_section(result["data"])
            context += "\n\n"
        
        return context
    
    def _format_section(self, data, indent=0) -> str:
        """Recursively format section data for AI context"""
        formatted = ""
        indent_str = "  " * indent
        
        if isinstance(data, dict):
            for key, value in data.items():
                formatted += f"{indent_str}{key}: "
                if isinstance(value, (dict, list)):
                    formatted += "\n" + self._format_section(value, indent + 1)
                else:
                    formatted += f"{value}\n"
        elif isinstance(data, list):
            for item in data:
                formatted += f"{indent_str}- {item}\n"
        else:
            formatted += f"{indent_str}{data}\n"
        
        return formatted


# Quick access functions
def get_tax_info(topic: str) -> Dict:
    """Quick access to specific tax information"""
    kb = SlovakTaxKnowledgeBase()
    return kb.knowledge.get(topic, {})


def search_tax_kb(query: str) -> List[Dict]:
    """Search the knowledge base"""
    kb = SlovakTaxKnowledgeBase()
    return kb.search_knowledge(query)


def get_ai_context(query: str) -> str:
    """Get formatted context for AI"""
    kb = SlovakTaxKnowledgeBase()
    return kb.get_context_for_ai(query)
