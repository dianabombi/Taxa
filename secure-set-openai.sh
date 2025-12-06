#!/bin/bash

# Secure OpenAI API Key Setup for TAXA Platform

echo -e "\033[0;36m========================================\033[0m"
echo -e "\033[0;36m   TAXA Platform - Secure Setup\033[0m"
echo -e "\033[0;36m========================================\033[0m"
echo ""

# 1. Check for OneDrive (simple check based on path string)
if [[ "$PWD" == *"OneDrive"* ]]; then
    echo -e "\033[0;33m⚠️  WARNING: Project is located in a OneDrive folder.\033[0m"
    echo -e "\033[0;33m    .env file will be synced to the cloud.\033[0m"
    echo -e "\033[0;33m    Recommended: Move project to a local folder.\033[0m"
    echo ""
fi

# 2. Check .env file
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "\033[0;32m✅ Created .env from template\033[0m"
    else
        echo -e "\033[0;31m❌ .env.example not found! Cannot create configuration.\033[0m"
        exit 1
    fi
fi

# 3. Securely prompt for API Key
echo -n "Please enter your OpenAI API Key (input will be hidden): "
read -s OPENAI_KEY
echo ""

if [ -z "$OPENAI_KEY" ]; then
    echo -e "\033[0;31m❌ API Key cannot be empty.\033[0m"
    exit 1
fi

# 4. Update .env file
# Escape special characters in key if any (though API keys are usually safe)
# Using sed to replace the line
if grep -q "^OPENAI_API_KEY=" .env; then
    sed -i "s|^OPENAI_API_KEY=.*|OPENAI_API_KEY=$OPENAI_KEY|" .env
else
    echo "OPENAI_API_KEY=$OPENAI_KEY" >> .env
fi

echo -e "\033[0;32m✅ OpenAI API Key saved to .env\033[0m"

# 5. Restart Backend
echo -e "\033[0;36m🔄 Restarting backend service...\033[0m"
docker compose restart backend

# 6. Show Status
echo ""
echo -e "\033[0;36m========================================\033[0m"
echo -e "\033[0;32m   ✅ TAXA Platform is Ready!\033[0m"
echo -e "\033[0;36m========================================\033[0m"
echo ""
echo -e "Frontend: \033[0;34mhttp://localhost:3000\033[0m"
echo -e "Backend:  \033[0;34mhttp://localhost:8000/docs\033[0m"
echo -e "MinIO:    \033[0;34mhttp://localhost:9001\033[0m"
echo ""
