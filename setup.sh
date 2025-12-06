#!/bin/bash

# TAXA Platform Setup Script
# Автоматичне налаштування платформи

set -e

echo "=================================="
echo "   TAXA Platform Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in WSL
if ! grep -qi microsoft /proc/version; then
    echo -e "${RED}Tento skript musí byť spustený v WSL (Windows Subsystem for Linux)${NC}"
    exit 1
fi

echo -e "${BLUE}Krok 1/5: Kontrola závislostí...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker nie je nainštalovaný!${NC}"
    echo "Prosím, nainštalujte Docker najprv."
    exit 1
fi

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo -e "${YELLOW}Docker nie je spustený. Spúšťam Docker...${NC}"
    sudo service docker start
    sleep 2
fi

echo -e "${GREEN}✓ Docker je nainštalovaný a spustený${NC}"

echo ""
echo -e "${BLUE}Krok 2/5: Konfigurácia API kľúčov...${NC}"

# Create .env file
if [ -f .env ]; then
    echo -e "${YELLOW}Súbor .env už existuje. Chcete ho prepísať? (y/n)${NC}"
    read -r overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Ponechávam existujúci .env súbor"
    else
        rm .env
    fi
fi

if [ ! -f .env ]; then
    echo "Vytváram .env súbor..."
    
    # OpenAI API Key
    echo ""
    echo -e "${YELLOW}Zadajte OpenAI API kľúč (pre AI chat):${NC}"
    echo "(Ak nemáte, stlačte Enter - môžete pridať neskôr)"
    read -r openai_key
    if [ -z "$openai_key" ]; then
        openai_key="your_openai_key_here"
    fi
    
    # OCR Provider selection
    echo ""
    echo -e "${YELLOW}Vyberte OCR provider:${NC}"
    echo "1) Tesseract (bezplatný, 85-90% presnosť)"
    echo "2) Mindee (odporúčané, 98%+ presnosť, 250 dokumentov/mesiac zadarmo)"
    echo "3) Veryfi (99%+ presnosť, platené)"
    echo "4) Klippa (98%+ presnosť, platené)"
    read -r ocr_choice
    
    case $ocr_choice in
        1)
            ocr_provider="tesseract"
            mindee_key=""
            veryfi_client=""
            veryfi_key=""
            klippa_key=""
            ;;
        2)
            ocr_provider="mindee"
            echo "Zadajte Mindee API kľúč (získajte na platform.mindee.com):"
            read -r mindee_key
            veryfi_client=""
            veryfi_key=""
            klippa_key=""
            ;;
        3)
            ocr_provider="veryfi"
            echo "Zadajte Veryfi Client ID:"
            read -r veryfi_client
            echo "Zadajte Veryfi API Key:"
            read -r veryfi_key
            mindee_key=""
            klippa_key=""
            ;;
        4)
            ocr_provider="klippa"
            echo "Zadajte Klippa API Key:"
            read -r klippa_key
            mindee_key=""
            veryfi_client=""
            veryfi_key=""
            ;;
        *)
            echo "Neplatná voľba, používam Tesseract"
            ocr_provider="tesseract"
            mindee_key=""
            veryfi_client=""
            veryfi_key=""
            klippa_key=""
            ;;
    esac
    
    # Generate random secret key
    secret_key=$(openssl rand -hex 32)
    
    # Create .env file
    cat > .env << EOF
# TAXA Platform Environment Variables
# Automaticky vygenerované $(date)

# OpenAI API Key (pre AI chat)
OPENAI_API_KEY=$openai_key

# OCR Provider
OCR_PROVIDER=$ocr_provider

# Mindee API Key
MINDEE_API_KEY=$mindee_key

# Veryfi API Keys
VERYFI_CLIENT_ID=$veryfi_client
VERYFI_API_KEY=$veryfi_key

# Klippa API Key
KLIPPA_API_KEY=$klippa_key

# Security
SECRET_KEY=$secret_key
EOF
    
    echo -e "${GREEN}✓ .env súbor vytvorený${NC}"
fi

echo ""
echo -e "${BLUE}Krok 3/5: Inštalácia OCR závislostí...${NC}"

if [ "$ocr_provider" = "tesseract" ] || [ -z "$ocr_provider" ]; then
    echo "Inštalujem Tesseract OCR..."
    sudo apt-get update -qq
    sudo apt-get install -y tesseract-ocr tesseract-ocr-slk tesseract-ocr-eng > /dev/null 2>&1
    echo -e "${GREEN}✓ Tesseract nainštalovaný${NC}"
else
    echo -e "${GREEN}✓ Používate cloud OCR, Tesseract nie je potrebný${NC}"
fi

echo ""
echo -e "${BLUE}Krok 4/5: Inštalácia frontend závislostí...${NC}"

cd frontend
if [ ! -d "node_modules" ]; then
    echo "Inštalujem npm balíčky..."
    npm install > /dev/null 2>&1
    echo -e "${GREEN}✓ NPM balíčky nainštalované${NC}"
else
    echo -e "${GREEN}✓ NPM balíčky už nainštalované${NC}"
fi
cd ..

echo ""
echo -e "${BLUE}Krok 5/5: Spúšťam Docker kontajnery...${NC}"

# Stop existing containers
if docker ps -a | grep -q taxa; then
    echo "Zastavujem existujúce kontajnery..."
    docker compose down > /dev/null 2>&1
fi

# Build and start containers
echo "Buildujem a spúšťam kontajnery (môže trvať 5-10 minút)..."
docker compose up -d --build

# Wait for containers to be healthy
echo "Čakám na spustenie kontajnerov..."
sleep 10

# Check container status
echo ""
echo -e "${BLUE}Status kontajnerov:${NC}"
docker compose ps

echo ""
echo "=================================="
echo -e "${GREEN}   ✓ Setup dokončený!${NC}"
echo "=================================="
echo ""
echo -e "${BLUE}Platforma je dostupná na:${NC}"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8000/docs"
echo "  MinIO:     http://localhost:9001"
echo ""
echo -e "${YELLOW}Poznámky:${NC}"
if [ "$openai_key" = "your_openai_key_here" ]; then
    echo "  ⚠ OpenAI API kľúč nie je nastavený - AI chat nebude fungovať"
    echo "    Pridajte ho do .env súboru: OPENAI_API_KEY=váš_kľúč"
fi
if [ "$ocr_provider" = "tesseract" ]; then
    echo "  ℹ Používate Tesseract (85-90% presnosť)"
    echo "    Pre lepšiu presnosť (98%+) použite Mindee"
fi
echo ""
echo -e "${BLUE}Užitočné príkazy:${NC}"
echo "  docker compose logs -f          # Zobraziť logy"
echo "  docker compose restart          # Reštartovať kontajnery"
echo "  docker compose down             # Zastaviť kontajnery"
echo "  docker compose up -d --build    # Rebuildiť a spustiť"
echo ""
echo -e "${GREEN}Otvorte http://localhost:3000 v prehliadači!${NC}"
echo ""
