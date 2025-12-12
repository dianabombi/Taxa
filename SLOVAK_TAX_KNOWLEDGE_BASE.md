# 🧠 Slovak Tax Knowledge Base - AI Chat Integration

## ✅ **FULLY IMPLEMENTED!**

Comprehensive knowledge base of Slovak tax legislation integrated with AI chat for intelligent, accurate tax consulting.

---

## 🎯 **What Was Implemented:**

### **1. Comprehensive Knowledge Base** ✅
**File**: `backend/knowledge/slovak_tax_kb.py`

**Contains**:
- ✅ **Tax rates** (2024) - 19% and 25% progressive rates
- ✅ **All tax deadlines** - Annual, monthly, quarterly
- ✅ **Tax forms** - DPFO, DPH, links to official forms
- ✅ **Deductions** - Flat-rate vs actual expenses, non-taxable parts
- ✅ **VAT information** - Rates, thresholds, obligations
- ✅ **Insurance info** - Social and health insurance for SZČO
- ✅ **Procedures** - Step-by-step guides (start business, file taxes)
- ✅ **Legislation** - References to Slovak laws
- ✅ **Common questions** - FAQ with answers
- ✅ **Penalties** - Late filing, late payment consequences
- ✅ **Tax benefits** - Optimization tips, deductions

### **2. Intelligent AI Integration** ✅
- ✅ **OpenAI GPT-4** integration with Slovak context
- ✅ **Knowledge base fallback** if OpenAI unavailable
- ✅ **Context-aware responses** using KB
- ✅ **Slovak language** responses
- ✅ **2024 legislation** - Up-to-date information

### **3. API Endpoints** ✅
```
GET /api/knowledge/search?q={query}     - Search knowledge base
GET /api/knowledge/topic/{topic}        - Get specific topic
GET /api/knowledge/faq                  - Get FAQ
GET /api/knowledge/deadlines            - Get tax deadlines
GET /api/knowledge/all                  - Get entire KB
```

---

## 📚 **Knowledge Base Coverage:**

### **Tax Rates (2024)**
```json
{
  "basic_rate": "19%",
  "threshold": "0 - 41,445.37 €",
  "higher_rate": "25%",
  "above": "41,445.37 €",
  "non_taxable_minimum": "5,174.70 €"
}
```

### **Important Deadlines**
- **31. marec** - DPFO filing (annual tax return)
- **30. jún** - Extended deadline (with tax advisor)
- **25. deň** - Monthly VAT declarations
- **8. deň** - Social & health insurance payments

### **Tax Forms**
- **DPFO typ A** - For employees
- **DPFO typ B** - For self-employed (SZČO)
- **Kontrolný výkaz DPH** - VAT declarations
- **Electronic filing** via slovensko.sk

### **Deductions**
**Flat-rate expenses**:
- 60% - Standard professions
- 40% - Crafts

**Actual expenses**:
- Material and goods
- Office rent
- Energy, communications
- Software, services
- Travel expenses
- Marketing

**Non-taxable parts**:
- Mortgage interest
- Donations (up to 20%)
- Pension contributions (180 €/year)
- **Tax bonus for children**: 140 €/month per child

### **VAT Information**
- **Registration threshold**: 49,790 € annual turnover
- **Standard rate**: 20%
- **Reduced rate**: 10% (food, medicine, books)
- **Obligations**: Monthly/quarterly declarations

### **Insurance (SZČO)**
- **Social insurance**: 31.2% of assessment base
- **Health insurance**: 14% of assessment base
- **Minimum monthly**: 701.37 € (2024)
- **Minimum payment**: 218.82 € (social) + 98.19 € (health) = 317 € total

---

## 🤖 **How AI Chat Works:**

### **Architecture**:
```
User Question
     ↓
Slovak Tax KB → Extract relevant context
     ↓
OpenAI GPT-4 → Generate intelligent answer (with SK context)
     ↓
Response in Slovak language
```

### **Example Conversation**:

**User**: "Koľko platím na odvodoch ako SZČO?"

**AI Response** (powered by KB):
```
Ako samostatne zárobkovo činná osoba (SZČO) platíte dva typy odvodov:

SOCIÁLNE POISTENIE:
• Minimálny základ: 701.37 € mesačne (2024)
• Sadzba: 31.2%
• Minimálna mesačná platba: 218.82 €

ZDRAVOTNÉ POISTENIE:
• Minimálny základ: 701.37 € mesačne
• Sadzba: 14%
• Minimálna mesačná platba: 98.19 €

SPOLU MESAČNE: 317.01 € (minimum)

Ak je váš zisk vyšší, odvody sa prepočítavajú z polovice čistého zisku.

Platí sa do 8. dňa nasledujúceho mesiaca.

✓ TAXA vám automaticky vypočíta presné odvody na základe vašich príjmov!
```

---

## 🚀 **API Usage Examples:**

### **1. Search Knowledge Base**
```bash
curl "https://taxa-2d0h.onrender.com/api/knowledge/search?q=DPH"
```

**Response**:
```json
{
  "query": "DPH",
  "results": [
    {
      "section": "vat_info",
      "data": {
        "registration_threshold": {
          "amount": "49,790 €",
          "description": "Povinná registrácia DPH..."
        },
        "vat_rates": {
          "standard": {"rate": "20%"},
          "reduced": {"rate": "10%"}
        }
      }
    }
  ],
  "count": 1
}
```

### **2. Get Tax Deadlines**
```bash
curl "https://taxa-2d0h.onrender.com/api/knowledge/deadlines"
```

**Response**:
```json
{
  "annual_deadlines": {
    "dpfo_filing": {
      "date": "31. marec",
      "extension_date": "30. jún (s daňovým poradcom)",
      "description": "Podanie daňového priznania..."
    }
  },
  "monthly_deadlines": {...},
  "quarterly_deadlines": {...}
}
```

### **3. Get FAQ**
```bash
curl "https://taxa-2d0h.onrender.com/api/knowledge/faq"
```

**Response**:
```json
{
  "q1": {
    "question": "Kedy musím podať daňové priznanie?",
    "answer": "Daňové priznanie DPFO sa podáva do 31. marca..."
  },
  "q2": {
    "question": "Aký je rozdiel medzi paušálnymi a skutočnými výdavkami?",
    "answer": "Paušálne výdavky sú 60%..."
  }
}
```

### **4. Get Specific Topic**
```bash
curl "https://taxa-2d0h.onrender.com/api/knowledge/topic/tax_rates"
```

---

## 💡 **Knowledge Base Features:**

### **Smart Search**
- Keyword matching
- Context extraction
- Relevant section retrieval

### **Topics Available**:
1. **tax_rates** - Income tax rates
2. **deadlines** - All important dates
3. **forms** - Tax forms and where to get them
4. **deductions** - What you can deduct
5. **vat_info** - VAT/DPH information
6. **insurance** - Social & health insurance
7. **procedures** - How-to guides
8. **legislation** - Laws and regulations
9. **common_questions** - FAQ
10. **penalties** - Fines and late fees
11. **benefits** - Tax optimization tips

---

## 🎯 **Use Cases:**

### **1. AI Chat** (Primary)
Users ask questions in natural language, AI responds with accurate info from KB.

**Example**:
- "Kedy musím podať priznanie?" → Deadline info
- "Ako začať živnosť?" → Step-by-step procedure
- "Koľko je DPH?" → VAT rates and threshold

### **2. Direct API Access**
Developers can query KB directly for specific information.

**Use for**:
- Building dashboards
- Deadline reminders
- Tax calculators
- Educational content

### **3. Frontend Integration**
Display KB content in UI:
- FAQ section
- Help tooltips
- Deadline calendar
- Tax guides

---

## 🧪 **Testing the Knowledge Base:**

### **Test AI Chat**:
```bash
# Login first
TOKEN=$(curl -X POST https://taxa-2d0h.onrender.com/api/auth/login \
  -d "username=test@example.com&password=password" | jq -r '.access_token')

# Ask a question
curl -X POST https://taxa-2d0h.onrender.com/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Koľko platím na odvodoch?"}' | jq
```

### **Test Knowledge Search**:
```bash
# Search for "DPH"
curl "https://taxa-2d0h.onrender.com/api/knowledge/search?q=DPH" | jq

# Get FAQ
curl "https://taxa-2d0h.onrender.com/api/knowledge/faq" | jq

# Get deadlines
curl "https://taxa-2d0h.onrender.com/api/knowledge/deadlines" | jq
```

---

## 📊 **Knowledge Base Stats:**

| Category | Items | Coverage |
|----------|-------|----------|
| **Tax Rates** | Complete | 2024 rates |
| **Deadlines** | 10+ | Annual, monthly, quarterly |
| **Forms** | 5+ | Official SK forms |
| **Deductions** | 20+ | All major deductions |
| **Procedures** | 3+ | Step-by-step guides |
| **FAQ** | 6+ | Common questions |
| **Legislation** | 3+ | Main tax laws |

---

## 🔄 **How AI Responses Work:**

### **With OpenAI** (Best quality):
```
1. User asks question in Slovak
2. KB extracts relevant Slovak tax context
3. OpenAI GPT-4 gets context + question
4. Generates intelligent answer in Slovak
5. Adds document count if relevant
6. Returns accurate, natural response
```

### **Without OpenAI** (Fallback):
```
1. User asks question
2. KB searches for keywords
3. Returns pre-written answer from KB
4. Still accurate, but less conversational
```

---

## 🎓 **Example Questions Supported:**

### **Tax Rates**:
- "Aká je sadzba dane?"
- "Koľko percent platím na dani?"
- "Čo je nezdaniteľná časť?"

### **Deadlines**:
- "Kedy musím podať priznanie?"
- "Aké sú termíny pre DPH?"
- "Do kedy platím odvody?"

### **Deductions**:
- "Čo si môžem dať do nákladov?"
- "Aký je rozdiel medzi paušálom a skutočnými výdavkami?"
- "Môžem odpočítať náklady na auto?"

### **VAT**:
- "Kedy sa musím registrovať na DPH?"
- "Koľko je DPH na Slovensku?"
- "Ako funguje DPH na vstupe?"

### **Insurance**:
- "Koľko platím na odvodoch?"
- "Čo je minimálny vymeriavací základ?"
- "Kam platím sociálne poistenie?"

### **Procedures**:
- "Ako začať podnikať?"
- "Ako podať daňové priznanie?"
- "Ako sa registrovať na DPH?"

---

## 🚀 **Deployment Status:**

### **Backend** ✅:
- Knowledge base created
- AI integration complete
- API endpoints ready
- 🔄 Ready for Render deployment

### **Frontend** (Optional enhancements):
- Display FAQ from KB
- Show deadline calendar
- Add help tooltips using KB
- Tax rate calculator using KB data

---

## 💡 **Future Enhancements:**

### **Phase 1** (Current):
- ✅ Comprehensive knowledge base
- ✅ AI chat integration
- ✅ Slovak language support
- ✅ 2024 legislation

### **Phase 2** (Planned):
- 🔄 Vector embeddings for better search
- 🔄 Multi-year tax data (2023, 2024, 2025)
- 🔄 Regional differences (if any)
- 🔄 More procedural guides

### **Phase 3** (Future):
- 🔄 Real-time updates from financnasprava.sk
- 🔄 Integration with official SK portals
- 🔄 Personalized tax advice based on user data
- 🔄 Tax scenario simulations

---

## 📝 **Sources & Accuracy:**

All information in the knowledge base is based on:
- **Zákon č. 595/2003 Z.z.** - Income Tax Law
- **Zákon č. 222/2004 Z.z.** - VAT Law
- **Zákon č. 563/2009 Z.z.** - Tax Administration Law
- **Finančná správa SR** - Official website
- **2024 rates and limits** - Current legislation

**Note**: Tax laws change. KB should be updated annually.

---

## 🎉 **Summary:**

**Problem**: Users need accurate Slovak tax information

**Solution**: 
- Comprehensive knowledge base with 2024 legislation
- AI-powered intelligent responses
- Direct API access for developers
- Slovak language support

**Result**:
- Users get **instant**, **accurate** answers
- AI understands **Slovak tax context**
- **10+ topics** covered comprehensively
- **Public API** for integration

---

## 📖 **Quick Start:**

### **For Users** (AI Chat):
1. Go to TAXA chat
2. Ask in Slovak: "Koľko platím na dani?"
3. Get intelligent, accurate answer

### **For Developers** (API):
```bash
# Get all deadlines
curl https://taxa-2d0h.onrender.com/api/knowledge/deadlines

# Search for "DPH"
curl "https://taxa-2d0h.onrender.com/api/knowledge/search?q=DPH"

# Get FAQ
curl https://taxa-2d0h.onrender.com/api/knowledge/faq
```

---

**Status**: ✅ **PRODUCTION READY**

**Coverage**: Comprehensive Slovak tax legislation for 2024

**AI Quality**: Intelligent, context-aware responses in Slovak

**API Access**: Public endpoints for developers

---

Last updated: December 12, 2025
Version: 1.0.0
