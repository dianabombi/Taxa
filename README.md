# TAXA Platform

Moderná daňová platforma s AI konzultantom a automatickým spracovaním dokumentov.

## 🚀 Rýchly štart

### Automatická inštalácia (odporúčané)

```bash
# 1. Prejdite do WSL
wsl

# 2. Prejdite do priečinka projektu
cd /mnt/c/Users/info/OneDrive/Dokumenty/TAXA

# 3. Spustite setup skript
chmod +x setup.sh
./setup.sh
```

Setup skript automaticky:
- ✅ Skontroluje Docker
- ✅ Vytvorí `.env` súbor
- ✅ Opýta sa na API kľúče
- ✅ Nainštaluje Tesseract (ak potrebné)
- ✅ Nainštaluje npm balíčky
- ✅ Spustí Docker kontajnery

### Manuálna inštalácia

```bash
# 1. Vytvorte .env súbor
cp .env.example .env

# 2. Upravte .env a pridajte API kľúče
nano .env

# 3. Nainštalujte závislosti
cd frontend && npm install && cd ..
sudo apt-get install tesseract-ocr tesseract-ocr-slk

# 4. Spustite Docker
docker compose up -d --build
```

## 📋 Funkcie

### Frontend
- 🏠 **Landing page** - Moderný dizajn s gradientmi
- 🔐 **Registrácia/Prihlásenie** - JWT autentifikácia
- 📊 **Dashboard** - Prehľad dokumentov a štatistík
- 📄 **Nahrávanie dokumentov** - Drag & drop
- 🤖 **AI Chat** - Daňový konzultant
- 🌍 **4 jazyky** - Slovenčina, Angličtina, Ukrajinčina, Ruština

### Backend
- 🔒 **Autentifikácia** - JWT tokeny, bcrypt
- 📁 **Správa dokumentov** - Upload, list, delete
- 🔍 **OCR/IDP** - Automatické spracovanie dokumentov
  - Mindee (98%+ presnosť)
  - Tesseract (bezplatný)
  - Veryfi, Klippa
- 💬 **AI Chat** - OpenAI GPT-4 integrácia
- 🗄️ **PostgreSQL** - S pgvector pre RAG

## 🔧 Konfigurácia

### API Kľúče

#### OpenAI (povinné pre AI chat)

> [!TIP]
> **Bezpečné nastavenie (Odporúčané)**
> Pre bezpečné nastavenie OpenAI API kľúča spustite `secure-set-openai.ps1` (Windows) alebo `secure-set-openai.sh` (Linux). Skript zapíše kľúč do `.env` lokálne a reštartuje backend. Kľúč sa nikde neukladá ani neposiela.

**Manuálne nastavenie:**
1. Získajte na https://platform.openai.com/api-keys
2. Pridajte do `.env`: `OPENAI_API_KEY=sk-...`

#### Mindee (odporúčané pre OCR)
1. Zaregistrujte sa na https://platform.mindee.com/
2. Vytvorte projekt
3. Skopírujte API kľúč
4. Pridajte do `.env`: `MINDEE_API_KEY=...`

**Bezplatný tier**: 250 dokumentov/mesiac

### OCR Provideri

| Provider | Presnosť | Cena | Odporúčanie |
|----------|----------|------|-------------|
| Mindee | 98%+ | $0.10-0.30/dok | ⭐⭐⭐⭐⭐ |
| Tesseract | 85-90% | Zadarmo | ⭐⭐⭐ |
| Veryfi | 99%+ | $0.10-0.50/dok | ⭐⭐⭐⭐ |
| Klippa | 98%+ | €0.08-0.25/dok | ⭐⭐⭐⭐ |

## 📱 Použitie

### 1. Otvorte aplikáciu
```
http://localhost:3000
```

### 2. Zaregistrujte sa
- Kliknite "Registrácia"
- Vyplňte formulár
- Automatické presmerovanie na prihlásenie

### 3. Nahrajte dokumenty
- Dashboard → "Nahrať dokument"
- Drag & drop PDF/DOC/obrázky
- Automatické OCR spracovanie

### 4. Opýtajte sa AI
- Dashboard → "AI Konzultant"
- Napíšte otázku o daniach
- Získajte okamžitú odpoveď

## 🛠️ Užitočné príkazy

```bash
# Zobraziť logy
docker compose logs -f

# Zobraziť logy konkrétneho kontajnera
docker compose logs -f frontend
docker compose logs -f backend

# Reštartovať kontajnery
docker compose restart

# Zastaviť kontajnery
docker compose down

# Rebuildiť a spustiť
docker compose up -d --build

# Vymazať všetko a začať odznova
docker compose down -v
./setup.sh
```

## 📚 Dokumentácia

- [OCR Integration Guide](./docs/OCR_GUIDE.md)
- [API Documentation](http://localhost:8000/docs)
- [Walkthrough](./docs/walkthrough.md)

## 🐛 Troubleshooting

### Frontend sa nespúšťa
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..
docker compose up -d --build frontend
```

### Backend chyby
```bash
docker compose logs backend
```

### OCR nefunguje
- Skontrolujte API kľúč v `.env`
- Pre Tesseract: `sudo apt-get install tesseract-ocr`

### Docker Desktop nie je spustený
```bash
# Spustite Docker service
sudo service docker start

# Skontrolujte status
docker ps
```

## 🏗️ Technológie

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL + pgvector
- OpenAI API
- Mindee/Tesseract OCR

### Infrastructure
- Docker Compose
- WSL2 Ubuntu
- MinIO (file storage)

## 📝 Licencia

MIT

## 👨‍💻 Autor

TAXA Platform - 2024
