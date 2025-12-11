# Slovak Tax Return Feature - Implementation Summary

## ✅ **COMPLETED - Backend Implementation**

### **1. Slovak Tax Calculator Service** (`backend/services/tax_calculator.py`)

Comprehensive tax calculation service with 2024 Slovak tax legislation:

#### **Features Implemented:**
- ✅ **Income tax calculation** (19% and 25% progressive rates)
- ✅ **Flat-rate expenses** (paušálne výdavky) - 60% and 40% options
- ✅ **Actual expenses** support (skutočné výdavky)
- ✅ **Non-taxable minimum** (€5,174.70)
- ✅ **Tax bonus for children** (€140/month per child)
- ✅ **Social insurance calculation** (31.2% rate)
- ✅ **Health insurance calculation** (14% rate)
- ✅ **VAT calculations** (20% standard, 10% reduced)
- ✅ **Complete DPFO Type B calculations**

#### **Key Functions:**
```python
calculator = SlovakTaxCalculator(year=2024)

# Calculate complete tax return
result = calculator.calculate_complete_tax_return(
    income=Decimal("35000"),
    use_flat_rate=True,
    profession_type="standard",
    children_count=1,
    paid_advances=Decimal("500")
)
```

---

### **2. Tax Return API Endpoints** (`backend/main.py`)

Three new API endpoints added:

#### **POST /api/tax-return/calculate**
Calculate complete tax return for a year:
- Aggregates ALL uploaded documents (invoices, receipts)
- Calculates income and expenses automatically
- Performs complete Slovak tax calculations
- Returns DPFO Type B form data ready for submission

**Request:**
```json
{
  "year": 2024,
  "use_flat_rate": true,
  "profession_type": "standard",
  "children_count": 1,
  "additional_non_taxable": 0,
  "paid_advances": 500
}
```

**Response:**
```json
{
  "calculation": {
    "income": { "gross_income": 35000, "expenses": 21000, "tax_base": 14000 },
    "tax": { "final_tax": 1500.50, "tax_bonus": 1680 },
    "payment": { "to_pay": 0, "to_refund": 179.50 }
  },
  "documents_used": [...],
  "form_data": { "taxpayer": {...}, "income_section": {...} }
}
```

#### **GET /api/tax-return/documents/{year}**
Get all documents for a specific tax year

#### **POST /api/tax-return/generate-pdf/{year}**
Generate PDF of DPFO Type B form (placeholder for now)

#### **POST /api/tax-return/export-xml/{year}**
Export in XML format for electronic submission (placeholder for now)

---

## 📋 **NEXT STEPS - Frontend Implementation**

### **What Needs to Be Built:**

### **1. Enhanced Declaration Page** (`frontend/app/dashboard/declaration/page.tsx`)

**Current**: Basic 3-step wizard with manual input
**Needs**: Full integration with backend API

**Implementation Plan:**

```typescript
// Step 1: Select Year & Options
- Tax year selector (2024, 2023, 2022)
- Expense type: Flat-rate (paušálne) vs Actual (skutočné)
- Profession type: Standard (60%) vs Craft (40%)
- Number of children
- Paid advances amount

// Step 2: Review Documents
- Show all documents from selected year
- Display: invoices (income), receipts (expenses)
- Allow manual adjustments/corrections
- Option to add/remove documents

// Step 3: Tax Calculation
- Call /api/tax-return/calculate
- Display full calculation breakdown:
  * Gross income
  * Expenses (calculated or flat-rate)
  * Tax base
  * Insurance contributions
  * Final tax
  * Amount to pay/refund

// Step 4: Form Preview
- Show DPFO Type B form with all values filled
- Allow review and corrections
- Download options:
  * PDF format
  * XML format for electronic submission
  * Instructions for submission
```

---

## 🎯 **Feature Capabilities**

### **What Users Can Do:**

1. **Select Tax Year** - Choose which year to file for
2. **Choose Expense Method**:
   - Flat-rate (paušálne výdavky) - 60% automatic
   - Actual expenses (skutočné výdavky) - from uploaded receipts
3. **Configure Tax Situation**:
   - Number of dependent children (for tax bonus)
   - Already paid tax advances
   - Additional non-taxable parts
4. **Automatic Document Aggregation**:
   - System automatically finds all invoices/receipts for the year
   - Calculates total income and expenses
5. **Complete Tax Calculation**:
   - Income tax (19%/25% progressive)
   - Social and health insurance
   - Tax bonuses and deductions
6. **Form Generation**:
   - DPFO Type B form with all fields filled
   - Export as PDF or XML
   - Instructions for electronic submission

---

## 🔧 **Implementation Time Estimate**

### **Already Done (2-3 hours):**
- ✅ Tax calculator with Slovak legislation
- ✅ API endpoints for calculations
- ✅ Document aggregation logic
- ✅ Backend deployed to Render

### **Frontend Implementation (4-6 hours):**
- 🔲 Multi-step wizard with real API calls (2 hours)
- 🔲 Document review interface (1 hour)
- 🔲 Tax calculation display (1 hour)
- 🔲 Form preview component (1 hour)
- 🔲 PDF generation (1 hour - using reportlab or similar)
- 🔲 XML export (1 hour)

### **Total: 6-9 hours for complete feature**

---

## 📚 **Slovak Tax Legislation Reference**

### **2024 Tax Rates:**
- **19%** for income up to €41,445.37
- **25%** for income above €41,445.37
- **Non-taxable minimum**: €5,174.70/year
- **Tax bonus per child**: €140/month (€1,680/year)

### **Flat-Rate Expenses (Paušálne výdavky):**
- **60%** for most professions
- **40%** for crafts and specific professions

### **Insurance Contributions (Self-Employed):**
- **Social insurance**: 31.2% of assessment base
- **Health insurance**: 14% of assessment base
- **Minimum monthly base**: €701.37

### **VAT (DPH):**
- **Standard rate**: 20%
- **Reduced rate**: 10%
- **Registration threshold**: €49,790/year turnover

---

## 🚀 **How to Deploy**

### **Backend is LIVE:**
Backend with tax calculator is already deployed to Render:
```
https://taxa-2d0h.onrender.com
```

### **Test the API:**
```bash
# Login first to get token
curl -X POST https://taxa-2d0h.onrender.com/api/auth/login \
  -d "username=your@email.com&password=yourpass"

# Calculate tax return
curl -X POST https://taxa-2d0h.onrender.com/api/tax-return/calculate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"year": 2024, "use_flat_rate": true, "children_count": 1}'
```

### **Frontend Update:**
Once frontend is updated:
1. Commit changes
2. Push to GitHub
3. Vercel auto-deploys
4. Feature live at: `https://taxa-five.vercel.app/dashboard/declaration`

---

## 💡 **Next Session Action Items**

1. **Update frontend declaration page** with full wizard
2. **Add PDF generation** library (reportlab-py or pdfkit)
3. **Create XML export** function for Slovak FA format
4. **Add Slovak translations** for all new UI elements
5. **Test complete flow** from document upload to tax return generation

---

## 📝 **Notes**

- All calculations follow **2024 Slovak tax law**
- System automatically aggregates documents by **upload date**
- Users can override automatic calculations with manual inputs
- PDF/XML generation are placeholders - need proper templates
- Consider adding **document categorization** for better accuracy
- Future: Add **AI suggestions** for tax optimization

---

**Status**: Backend ✅ COMPLETE | Frontend 🔲 IN PROGRESS
**Deployed**: Yes, on Render.com
**Ready for**: Frontend integration and testing
