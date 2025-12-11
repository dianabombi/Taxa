"""
ICO (Identifikačné číslo organizácie) Verification Service
Verifies Slovak business registration numbers against official government registries
"""

import requests
from typing import Optional, Dict
import re
import asyncio
from functools import lru_cache
import hashlib
import time


class ICOVerificationService:
    """
    Verify ICO against Slovak government registries
    Primary: Register organizácií Štatistického úradu SR (registeruz.sk)
    Fallback: Web scraping from zrsr.sk
    Optional: FinStat API (requires API key)
    
    Features:
    - Fast API calls with 3-second timeout
    - In-memory caching (1-hour TTL)
    - Async execution for speed
    """
    
    # Official Register organizácií API
    REGISTER_UZ_API = "https://www.registeruz.sk/cruz-public/api/uctovnej-jednotky"
    
    # ZRSR (Register živnostenského podnikania)
    ZRSR_URL = "https://www.zrsr.sk/"
    
    # FinStat API (commercial)
    FINSTAT_API = "https://finstat.sk/api/detail"
    
    # Cache for verified ICOs (in-memory, 1-hour TTL)
    _cache = {}
    _cache_ttl = 3600  # 1 hour in seconds
    
    def __init__(self, finstat_api_key: Optional[str] = None):
        self.finstat_api_key = finstat_api_key
        self.timeout = 3  # 3 seconds timeout for API calls
        
    def validate_ico_format(self, ico: str) -> bool:
        """
        Validate ICO format
        ICO should be 8 digits
        """
        # Remove spaces and non-digits
        ico_clean = re.sub(r'\D', '', ico)
        
        # Must be exactly 8 digits
        if len(ico_clean) != 8:
            return False
        
        # Must be numeric
        if not ico_clean.isdigit():
            return False
        
        return True
    
    def normalize_ico(self, ico: str) -> str:
        """Normalize ICO to 8-digit format"""
        ico_clean = re.sub(r'\D', '', ico)
        return ico_clean.zfill(8)
    
    def _get_cache_key(self, ico: str) -> str:
        """Generate cache key for ICO"""
        return f"ico_{ico}"
    
    def _get_from_cache(self, ico: str) -> Optional[Dict]:
        """Get cached ICO data if not expired"""
        cache_key = self._get_cache_key(ico)
        
        if cache_key in self._cache:
            cached_data, timestamp = self._cache[cache_key]
            
            # Check if cache is still valid (1 hour TTL)
            if time.time() - timestamp < self._cache_ttl:
                return cached_data
            else:
                # Remove expired cache
                del self._cache[cache_key]
        
        return None
    
    def _save_to_cache(self, ico: str, data: Dict):
        """Save ICO data to cache"""
        cache_key = self._get_cache_key(ico)
        self._cache[cache_key] = (data, time.time())
    
    async def verify_ico_registeruz(self, ico: str) -> Optional[Dict]:
        """
        Verify ICO using official Register organizácií Štatistického úradu SR API
        
        This is the primary and most reliable method
        Free to use, official government data
        Includes caching for faster repeated lookups
        
        Args:
            ico: 8-digit ICO number
            
        Returns:
            Dictionary with company information or None if not found
        """
        if not self.validate_ico_format(ico):
            return None
        
        ico_normalized = self.normalize_ico(ico)
        
        # Check cache first
        cached_result = self._get_from_cache(ico_normalized)
        if cached_result:
            return cached_result
        
        try:
            # Call official API with short timeout
            url = f"{self.REGISTER_UZ_API}/{ico_normalized}"
            response = requests.get(url, timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                
                # Parse response
                if data and isinstance(data, dict):
                    result = {
                        "ico": ico_normalized,
                        "valid": True,
                        "source": "registeruz.sk",
                        "company_name": data.get("nazov") or data.get("obchodnyNazov"),
                        "legal_form": data.get("pravnaForma"),
                        "address": self._format_address(data.get("sidlo")),
                        "dic": data.get("dic"),
                        "ic_dph": data.get("icDph"),
                        "status": data.get("stav"),
                        "registered": data.get("datumZapisu"),
                        "raw_data": data
                    }
                    
                    # Cache successful result
                    self._save_to_cache(ico_normalized, result)
                    
                    return result
            
            return None
            
        except requests.exceptions.Timeout:
            print(f"RegisterUZ API timeout for ICO {ico_normalized}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"RegisterUZ API error: {e}")
            return None
    
    def _format_address(self, address_data: Optional[Dict]) -> Optional[str]:
        """Format address from RegisterUZ data"""
        if not address_data:
            return None
        
        parts = []
        
        if address_data.get("ulica"):
            parts.append(address_data["ulica"])
        if address_data.get("cislo"):
            parts.append(str(address_data["cislo"]))
        if address_data.get("psc"):
            parts.append(str(address_data["psc"]))
        if address_data.get("obec"):
            parts.append(address_data["obec"])
        
        return ", ".join(parts) if parts else None
    
    async def verify_ico_finstat(self, ico: str) -> Optional[Dict]:
        """
        Verify ICO using FinStat API (commercial service)
        
        Requires API key (paid service)
        More detailed information including financial data
        
        Args:
            ico: 8-digit ICO number
            
        Returns:
            Dictionary with company information or None if not found
        """
        if not self.finstat_api_key:
            return None
        
        if not self.validate_ico_format(ico):
            return None
        
        ico_normalized = self.normalize_ico(ico)
        
        try:
            headers = {
                "Authorization": f"Bearer {self.finstat_api_key}",
                "Content-Type": "application/json"
            }
            
            url = f"{self.FINSTAT_API}?ico={ico_normalized}"
            response = requests.get(url, headers=headers, timeout=self.timeout)
            
            if response.status_code == 200:
                data = response.json()
                
                return {
                    "ico": ico_normalized,
                    "valid": True,
                    "source": "finstat.sk",
                    "company_name": data.get("Name"),
                    "legal_form": data.get("LegalForm"),
                    "address": data.get("Address"),
                    "dic": data.get("Dic"),
                    "ic_dph": data.get("IcDph"),
                    "status": data.get("Status"),
                    "registered": data.get("Created"),
                    "employees": data.get("Employees"),
                    "revenue": data.get("Revenue"),
                    "raw_data": data
                }
            
            return None
            
        except requests.exceptions.RequestException as e:
            print(f"FinStat API error: {e}")
            return None
    
    async def verify_ico(self, ico: str, use_finstat: bool = False) -> Dict:
        """
        Verify ICO using available services
        
        Priority:
        1. Register organizácií (free, official)
        2. FinStat (if API key provided and use_finstat=True)
        3. Return invalid if all fail
        
        Args:
            ico: ICO number to verify
            use_finstat: Whether to try FinStat API
            
        Returns:
            Dictionary with verification result and company data
        """
        # Validate format first
        if not self.validate_ico_format(ico):
            return {
                "valid": False,
                "error": "Invalid ICO format. ICO must be 8 digits.",
                "ico": ico
            }
        
        ico_normalized = self.normalize_ico(ico)
        
        # Try RegisterUZ first (free, official)
        result = await self.verify_ico_registeruz(ico_normalized)
        if result:
            return result
        
        # Try FinStat if enabled and API key available
        if use_finstat and self.finstat_api_key:
            result = await self.verify_ico_finstat(ico_normalized)
            if result:
                return result
        
        # ICO not found in any registry
        return {
            "valid": False,
            "error": "ICO not found in Slovak business registries",
            "ico": ico_normalized,
            "checked_sources": ["registeruz.sk"] + (["finstat.sk"] if use_finstat else [])
        }
    
    async def get_company_details(self, ico: str) -> Optional[Dict]:
        """
        Get complete company details for auto-filling registration form
        
        Returns formatted data ready for user registration
        """
        result = await self.verify_ico(ico, use_finstat=False)
        
        if not result.get("valid"):
            return None
        
        # Format data for registration form
        return {
            "ico": result.get("ico"),
            "company_name": result.get("company_name"),
            "business_address": result.get("address"),
            "legal_form": result.get("legal_form"),
            "dic": result.get("dic"),
            "ic_dph": result.get("ic_dph"),
            "status": result.get("status"),
            "verification_source": result.get("source"),
            "verified": True
        }


# Utility function for bulk ICO validation
async def validate_multiple_icos(icos: list[str]) -> Dict[str, Dict]:
    """
    Validate multiple ICOs at once
    Useful for batch verification
    """
    service = ICOVerificationService()
    results = {}
    
    for ico in icos:
        result = await service.verify_ico(ico)
        results[ico] = result
    
    return results


# Simple synchronous wrapper for easier use
def verify_ico_sync(ico: str) -> Dict:
    """
    Synchronous wrapper for ICO verification
    For use in non-async contexts
    """
    import asyncio
    
    service = ICOVerificationService()
    
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(service.verify_ico(ico))
