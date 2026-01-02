"""
Automatická aktualizácia slovenskej daňovej legislatívy pomocou AI
Kontroluje zmeny v zákonoch raz týždenne a aktualizuje knowledge base
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import openai
from pathlib import Path
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SlovakTaxLawUpdater:
    """
    Automatický updater pre slovenskú daňovú legislatívu
    Používa AI na kontrolu a aktualizáciu daňových zákonov
    """
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.update_log_path = Path("updates/law_updates.json")
        self.update_log_path.parent.mkdir(exist_ok=True)
        
        # Zoznam kľúčových zákonov na sledovanie
        self.monitored_laws = [
            {
                "name": "Zákon č. 595/2003 Z.z. o dani z príjmov",
                "description": "Upravuje daň z príjmov fyzických a právnických osôb",
                "key_areas": ["sadzby dane", "nezdaniteľné minimum", "daňové odpočty"]
            },
            {
                "name": "Zákon č. 222/2004 Z.z. o dani z pridanej hodnoty",
                "description": "Upravuje DPH, registráciu platiteľov a sadzby",
                "key_areas": ["registračná povinnosť", "sadzby DPH", "odpočet DPH"]
            },
            {
                "name": "Zákon č. 563/2009 Z.z. o správe daní (daňový poriadok)",
                "description": "Upravuje správu daní, lehoty a sankcie",
                "key_areas": ["lehoty na podanie", "pokuty", "daňové konanie"]
            },
            {
                "name": "Zákon č. 461/2003 Z.z. o sociálnom poistení",
                "description": "Komplexne upravuje sociálne poistenie SZČO (živnostníkov)",
                "key_areas": [
                    "povinnosť platiť sociálne poistenie pre SZČO",
                    "výška vymeriavacieho základu (min/max sumy)",
                    "sadzby poistného (nemocenské, dôchodkové, invalidné, garančné, úrazové, rezervný fond solidarity)",
                    "podmienky vzniku a zániku poistenia",
                    "lehoty na platby (do 8. dnia v mesiaci)",
                    "ohlasovanie zmien Sociálnej poisťovni",
                    "výnimky a oslobodenia od poistenia"
                ],
                "implementing_regulations": [
                    "Vyhláška Ministerstva práce, sociálnych vecí a rodiny SR - stanovuje ročne aktuálnu výšku min/max vymeriavacieho základu"
                ],
                "authority": "Sociálna poisťovňa (www.socpoist.sk)"
            },
            {
                "name": "Zákon č. 580/2004 Z.z. o zdravotnom poistení",
                "description": "Komplexne upravuje zdravotné poistenie SZČO (živnostníkov)",
                "key_areas": [
                    "povinnosť platiť zdravotné poistenie pre SZČO",
                    "výška vymeriavacieho základu (min/max sumy)",
                    "sadzba poistného (14% z vymeriavacieho základu)",
                    "podmienky vzniku a zániku poistenia",
                    "lehoty na platby (do 8. dňa v nasledujúcom mesiaci)",
                    "povinnosť podávať prehľady o príjmoch",
                    "výnimky a oslobodenia (napr. pri súbežnom zamestnaní)",
                    "práva a povinnosti poistenej osoby"
                ],
                "implementing_regulations": [
                    "Vyhláška Ministerstva zdravotníctva SR - stanovuje ročne aktuálnu výšku min/max vymeriavacieho základu"
                ],
                "authorities": [
                    "Všeobecná zdravotná poisťovňa (VšZP)",
                    "Dôvera zdravotná poisťovňa",
                    "Union zdravotná poisťovňa"
                ],
                "note": "Živnostník si môže vybrať ktorúkoľvek poisťovňu a platí tej, v ktorej je registrovaný"
            }
        ]
        
    def check_for_updates(self) -> Dict:
        """
        Kontroluje zmeny v daňovej legislatíve pomocou AI
        """
        logger.info("🔍 Začínam kontrolu aktualizácií daňových zákonov...")
        
        if not self.openai_api_key:
            logger.warning("⚠️ OpenAI API key nie je nastavený - preskakujem aktualizáciu")
            return {"status": "skipped", "reason": "no_api_key"}
        
        try:
            client = openai.OpenAI(api_key=self.openai_api_key)
            
            # Zistiť aktuálny dátum
            current_date = datetime.now().strftime("%Y-%m-%d")
            
            # Vytvor detailný zoznam zákonov pre AI
            laws_detail = []
            for law in self.monitored_laws:
                law_text = f"- {law['name']}\n  {law['description']}"
                if 'key_areas' in law:
                    law_text += f"\n  Kľúčové oblasti: {', '.join(law['key_areas'][:3])}"
                if 'authority' in law:
                    law_text += f"\n  Správny orgán: {law['authority']}"
                laws_detail.append(law_text)
            
            # Prompt pre AI na kontrolu zmien
            prompt = f"""Aktuálny dátum: {current_date}

Skontroluj, či došlo k zmenám v nasledujúcich slovenských daňových a sociálnych zákonoch za posledných 7 dní:

{chr(10).join(laws_detail)}

DÔLEŽITÉ - Pre Zákon č. 461/2003 Z.z. o sociálnom poistení venuj špeciálnu pozornosť:
- Zmeny vo výške minimálneho/maximálneho vymeriavacieho základu
- Zmeny v sadzbách poistného (nemocenské, dôchodkové, invalidné, garančné, úrazové)
- Nové vyhlášky Ministerstva práce, sociálnych vecí a rodiny SR
- Zmeny v lehotách na platby
- Nové výnimky alebo oslobodenia od poistenia

DÔLEŽITÉ - Pre Zákon č. 580/2004 Z.z. o zdravotnom poistení venuj špeciálnu pozornosť:
- Zmeny vo výške minimálneho/maximálneho vymeriavacieho základu
- Zmeny v sadzbe poistného (aktuálne 14%)
- Nové vyhlášky Ministerstva zdravotníctva SR
- Zmeny v lehotách na platby a podávanie prehľadov
- Nové výnimky pri súbežnom zamestnaní
- Zmeny v právach a povinnostiach poistencov

Pre každý zákon uveď:
1. Či došlo k zmene (áno/nie)
2. Ak áno, aké konkrétne zmeny (sadzby, pravidlá, termíny, sumy)
3. Dátum účinnosti zmien
4. Dopad na živnostníkov a SZČO
5. Odkaz na príslušnú vyhlášku alebo novelu (ak existuje)

Odpoveď formátuj ako JSON s nasledujúcou štruktúrou:
{{
    "has_updates": true/false,
    "last_checked": "{current_date}",
    "updates": [
        {{
            "law": "názov zákona",
            "changed": true/false,
            "changes": ["zoznam zmien"],
            "effective_date": "YYYY-MM-DD",
            "impact": "popis dopadu",
            "regulation_reference": "odkaz na vyhlášku/novelu (ak existuje)"
        }}
    ]
}}"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system", 
                        "content": "Si expert na slovenskú daňovú legislatívu. Sleduj zmeny v zákonoch a poskytuj presné informácie o aktualizáciách."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.3
            )
            
            # Parsovať odpoveď
            ai_response = response.choices[0].message.content
            
            # Extrahovať JSON z odpovede
            try:
                # Nájsť JSON v odpovedi
                start_idx = ai_response.find('{')
                end_idx = ai_response.rfind('}') + 1
                json_str = ai_response[start_idx:end_idx]
                update_data = json.loads(json_str)
            except:
                # Ak sa nepodarí parsovať, vytvor základnú štruktúru
                update_data = {
                    "has_updates": False,
                    "last_checked": current_date,
                    "updates": [],
                    "raw_response": ai_response
                }
            
            # Uložiť log aktualizácie
            self._save_update_log(update_data)
            
            if update_data.get("has_updates"):
                logger.info(f"✅ Nájdené aktualizácie zákonov: {len(update_data.get('updates', []))} zmien")
                self._apply_updates(update_data)
            else:
                logger.info("✓ Žiadne nové zmeny v legislatíve")
            
            return update_data
            
        except Exception as e:
            logger.error(f"❌ Chyba pri kontrole aktualizácií: {e}")
            return {
                "status": "error",
                "error": str(e),
                "last_checked": datetime.now().isoformat()
            }
    
    def _apply_updates(self, update_data: Dict):
        """
        Aplikuje nájdené aktualizácie do knowledge base
        """
        logger.info("📝 Aplikujem aktualizácie do knowledge base...")
        
        # Vytvor súbor s aktualizáciami
        updates_file = Path("knowledge/law_updates.json")
        
        # Načítaj existujúce aktualizácie
        if updates_file.exists():
            with open(updates_file, 'r', encoding='utf-8') as f:
                existing_updates = json.load(f)
        else:
            existing_updates = {"updates": []}
        
        # Pridaj nové aktualizácie
        for update in update_data.get("updates", []):
            if update.get("changed"):
                existing_updates["updates"].append({
                    "date": update_data["last_checked"],
                    "law": update["law"],
                    "changes": update.get("changes", []),
                    "effective_date": update.get("effective_date"),
                    "impact": update.get("impact")
                })
        
        # Ulož aktualizované dáta
        with open(updates_file, 'w', encoding='utf-8') as f:
            json.dump(existing_updates, f, ensure_ascii=False, indent=2)
        
        logger.info(f"✅ Aktualizácie uložené do {updates_file}")
    
    def _save_update_log(self, update_data: Dict):
        """
        Uloží log o kontrole aktualizácií
        """
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "data": update_data
        }
        
        # Načítaj existujúci log
        if self.update_log_path.exists():
            with open(self.update_log_path, 'r', encoding='utf-8') as f:
                logs = json.load(f)
        else:
            logs = {"checks": []}
        
        # Pridaj nový záznam
        logs["checks"].append(log_entry)
        
        # Ponechaj len posledných 52 kontrol (1 rok)
        logs["checks"] = logs["checks"][-52:]
        
        # Ulož log
        with open(self.update_log_path, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
    
    def get_latest_updates(self) -> Optional[Dict]:
        """
        Vráti najnovšie aktualizácie zákonov
        """
        updates_file = Path("knowledge/law_updates.json")
        
        if updates_file.exists():
            with open(updates_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        return None
    
    def get_update_history(self, limit: int = 10) -> List[Dict]:
        """
        Vráti históriu kontrol aktualizácií
        """
        if self.update_log_path.exists():
            with open(self.update_log_path, 'r', encoding='utf-8') as f:
                logs = json.load(f)
                return logs.get("checks", [])[-limit:]
        
        return []


def run_weekly_update():
    """
    Spustí týždennú kontrolu aktualizácií
    """
    updater = SlovakTaxLawUpdater()
    result = updater.check_for_updates()
    return result


if __name__ == "__main__":
    # Testovanie
    print("🚀 Spúšťam kontrolu daňových zákonov...")
    result = run_weekly_update()
    print(f"📊 Výsledok: {json.dumps(result, ensure_ascii=False, indent=2)}")
