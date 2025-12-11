"""
Slovak Tax Calculator Service
Implements Slovak tax legislation for DPFO (Type B - Self-employed)
Based on 2024 tax laws
"""

from datetime import datetime
from typing import Dict, List, Optional
from decimal import Decimal


class SlovakTaxCalculator:
    """
    Calculator for Slovak income tax (Daň z príjmov fyzických osôb)
    For self-employed individuals (SZČO - Samostatne zárobkovo činná osoba)
    """
    
    # 2024 Tax rates and limits
    TAX_RATE_BASIC = Decimal("0.19")  # 19% up to limit
    TAX_RATE_HIGH = Decimal("0.25")   # 25% above limit
    TAX_THRESHOLD = Decimal("41445.37")  # € threshold for 25% rate
    
    NON_TAXABLE_MINIMUM = Decimal("5174.70")  # € per year (nezdaniteľná časť)
    TAX_BONUS_CHILD = Decimal("140.00")  # € per month per child
    
    # Flat-rate expenses (paušálne výdavky) percentages
    FLAT_RATE_STANDARD = Decimal("0.60")  # 60% for most professions
    FLAT_RATE_CRAFT = Decimal("0.40")     # 40% for crafts
    
    # Social and health insurance rates for self-employed
    SOCIAL_INSURANCE_RATE = Decimal("0.312")  # 31.2%
    HEALTH_INSURANCE_RATE = Decimal("0.14")   # 14%
    MIN_ASSESSMENT_BASE_2024 = Decimal("701.37")  # Minimum monthly base
    
    # VAT rates
    VAT_STANDARD = Decimal("0.20")  # 20%
    VAT_REDUCED = Decimal("0.10")   # 10%
    VAT_THRESHOLD = Decimal("49790.00")  # Registration threshold
    
    def __init__(self, year: int = 2024):
        self.year = year
        
    def calculate_flat_rate_expenses(
        self, 
        income: Decimal, 
        profession_type: str = "standard"
    ) -> Decimal:
        """
        Calculate flat-rate expenses (paušálne výdavky)
        
        Args:
            income: Gross income in EUR
            profession_type: "standard" (60%) or "craft" (40%)
        """
        rate = self.FLAT_RATE_STANDARD if profession_type == "standard" else self.FLAT_RATE_CRAFT
        return income * rate
    
    def calculate_tax_base(
        self,
        income: Decimal,
        expenses: Optional[Decimal] = None,
        use_flat_rate: bool = True,
        profession_type: str = "standard"
    ) -> Decimal:
        """
        Calculate tax base (základ dane)
        
        Args:
            income: Total income
            expenses: Actual expenses (if not using flat-rate)
            use_flat_rate: Use flat-rate expenses (paušálne výdavky)
            profession_type: Type of profession for flat-rate calculation
        """
        if use_flat_rate:
            expenses = self.calculate_flat_rate_expenses(income, profession_type)
        else:
            expenses = expenses or Decimal("0")
        
        tax_base = income - expenses
        return max(tax_base, Decimal("0"))
    
    def calculate_insurance_contributions(
        self,
        assessment_base: Decimal,
        months: int = 12
    ) -> Dict[str, Decimal]:
        """
        Calculate social and health insurance contributions
        
        Args:
            assessment_base: Monthly assessment base (vymeriavací základ)
            months: Number of months
        """
        # Ensure minimum base
        monthly_base = max(assessment_base, self.MIN_ASSESSMENT_BASE_2024)
        
        social_monthly = monthly_base * self.SOCIAL_INSURANCE_RATE
        health_monthly = monthly_base * self.HEALTH_INSURANCE_RATE
        
        return {
            "social_insurance_monthly": social_monthly.quantize(Decimal("0.01")),
            "health_insurance_monthly": health_monthly.quantize(Decimal("0.01")),
            "social_insurance_yearly": (social_monthly * months).quantize(Decimal("0.01")),
            "health_insurance_yearly": (health_monthly * months).quantize(Decimal("0.01")),
            "total_yearly": ((social_monthly + health_monthly) * months).quantize(Decimal("0.01"))
        }
    
    def calculate_income_tax(
        self,
        tax_base: Decimal,
        non_taxable_parts: Optional[Decimal] = None,
        children_count: int = 0
    ) -> Dict[str, Decimal]:
        """
        Calculate income tax (daň z príjmov)
        
        Args:
            tax_base: Tax base after expenses
            non_taxable_parts: Additional non-taxable parts (donations, mortgage interest, etc.)
            children_count: Number of dependent children for tax bonus
        """
        # Apply non-taxable minimum
        taxable_income = tax_base - self.NON_TAXABLE_MINIMUM
        
        # Apply additional non-taxable parts
        if non_taxable_parts:
            taxable_income -= non_taxable_parts
        
        taxable_income = max(taxable_income, Decimal("0"))
        
        # Calculate tax based on progressive rates
        if taxable_income <= self.TAX_THRESHOLD:
            tax = taxable_income * self.TAX_RATE_BASIC
        else:
            tax = (self.TAX_THRESHOLD * self.TAX_RATE_BASIC + 
                   (taxable_income - self.TAX_THRESHOLD) * self.TAX_RATE_HIGH)
        
        # Apply tax bonus for children
        tax_bonus = Decimal(children_count) * self.TAX_BONUS_CHILD * Decimal("12")  # Annual
        final_tax = max(tax - tax_bonus, Decimal("0"))
        
        return {
            "taxable_income": taxable_income.quantize(Decimal("0.01")),
            "tax_before_bonus": tax.quantize(Decimal("0.01")),
            "tax_bonus": tax_bonus.quantize(Decimal("0.01")),
            "final_tax": final_tax.quantize(Decimal("0.01"))
        }
    
    def calculate_complete_tax_return(
        self,
        income: Decimal,
        expenses: Optional[Decimal] = None,
        use_flat_rate: bool = True,
        profession_type: str = "standard",
        children_count: int = 0,
        additional_non_taxable: Optional[Decimal] = None,
        paid_advances: Optional[Decimal] = None
    ) -> Dict:
        """
        Complete tax return calculation
        
        Returns all necessary values for DPFO Type B form
        """
        # 1. Calculate tax base
        tax_base = self.calculate_tax_base(income, expenses, use_flat_rate, profession_type)
        
        # 2. Calculate insurance contributions (deductible from tax base)
        # For simplified calculation, use 50% of tax base as assessment base
        monthly_assessment_base = (tax_base / Decimal("12"))
        insurance = self.calculate_insurance_contributions(monthly_assessment_base)
        
        # Insurance contributions are deductible
        adjusted_tax_base = tax_base - insurance["total_yearly"]
        adjusted_tax_base = max(adjusted_tax_base, Decimal("0"))
        
        # 3. Calculate income tax
        tax_calculation = self.calculate_income_tax(
            adjusted_tax_base,
            additional_non_taxable,
            children_count
        )
        
        # 4. Calculate final amount to pay/refund
        paid_advances = paid_advances or Decimal("0")
        balance = tax_calculation["final_tax"] - paid_advances
        
        return {
            "year": self.year,
            "income": {
                "gross_income": income.quantize(Decimal("0.01")),
                "expenses": (self.calculate_flat_rate_expenses(income, profession_type) 
                            if use_flat_rate else (expenses or Decimal("0"))).quantize(Decimal("0.01")),
                "expense_type": "flat_rate" if use_flat_rate else "actual",
                "expense_rate": (self.FLAT_RATE_STANDARD if profession_type == "standard" 
                               else self.FLAT_RATE_CRAFT) if use_flat_rate else None,
                "tax_base": tax_base.quantize(Decimal("0.01"))
            },
            "insurance": insurance,
            "tax_base_after_insurance": adjusted_tax_base.quantize(Decimal("0.01")),
            "tax": tax_calculation,
            "payment": {
                "paid_advances": paid_advances.quantize(Decimal("0.01")),
                "balance": balance.quantize(Decimal("0.01")),
                "to_pay": balance.quantize(Decimal("0.01")) if balance > 0 else Decimal("0"),
                "to_refund": abs(balance.quantize(Decimal("0.01"))) if balance < 0 else Decimal("0")
            },
            "summary": {
                "total_tax_burden": (tax_calculation["final_tax"] + insurance["total_yearly"]).quantize(Decimal("0.01")),
                "effective_tax_rate": ((tax_calculation["final_tax"] / income * 100).quantize(Decimal("0.01")) 
                                      if income > 0 else Decimal("0"))
            }
        }
    
    def is_vat_payer_required(self, turnover: Decimal) -> bool:
        """Check if VAT registration is required based on turnover"""
        return turnover > self.VAT_THRESHOLD
    
    def calculate_vat(self, amount: Decimal, rate_type: str = "standard") -> Dict[str, Decimal]:
        """Calculate VAT amounts"""
        rate = self.VAT_STANDARD if rate_type == "standard" else self.VAT_REDUCED
        vat_amount = amount * rate
        
        return {
            "base_amount": amount.quantize(Decimal("0.01")),
            "vat_rate": rate,
            "vat_amount": vat_amount.quantize(Decimal("0.01")),
            "total_with_vat": (amount + vat_amount).quantize(Decimal("0.01"))
        }
