#!/bin/bash

echo "========================================"
echo "CryptoAML - Production Setup Script"
echo "========================================"
echo ""

echo "Step 1: Generating production secrets..."
node generate-secrets.js > secrets.txt
echo "Secrets saved to secrets.txt"
echo ""

echo "Step 2: Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi
echo "Docker is installed"
echo ""

echo "Step 3: Checking environment files..."
if [ ! -f ".env.production" ]; then
    echo "Creating .env.production from template..."
    cp .env.production.example .env.production
    echo ""
    echo "IMPORTANT: Edit .env.production with the secrets from secrets.txt"
    echo ""
    read -p "Press enter to continue..."
fi

echo "Step 4: Creating required directories..."
mkdir -p ssl backups backend/logs
echo "Directories created"
echo ""

echo "Step 5: Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "Dependencies installed"
echo ""

echo "Step 6: Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to generate Prisma client"
    exit 1
fi
echo "Prisma client generated"
echo ""

cd ..

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Copy secrets from secrets.txt to .env.production"
echo "2. Get SSL certificates (see DEPLOYMENT_GUIDE.md)"
echo "3. Update nginx-ssl.conf with your domain"
echo "4. Run: docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
