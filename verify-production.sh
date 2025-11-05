#!/bin/bash

echo "🔍 Production Verification Script"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check Docker
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${RED}❌ Docker not installed${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check Docker Compose
echo "Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${RED}❌ Docker Compose not installed${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check environment variables
echo "Checking environment variables..."
if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}⚠️  JWT_SECRET not set${NC}"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "${GREEN}✅ JWT_SECRET configured${NC}"
fi

# Check if services are running
echo "Checking services..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Services are running${NC}"
    
    # Check each service
    for service in postgres redis backend ml-service frontend; do
        if docker-compose ps | grep $service | grep -q "Up"; then
            echo -e "${GREEN}  ✅ $service is running${NC}"
        else
            echo -e "${RED}  ❌ $service is not running${NC}"
            ERRORS=$((ERRORS+1))
        fi
    done
else
    echo -e "${YELLOW}⚠️  Services not running. Start with: docker-compose up -d${NC}"
    WARNINGS=$((WARNINGS+1))
fi

# Check health endpoints
echo "Checking health endpoints..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    ERRORS=$((ERRORS+1))
fi

if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅ ML Service health check passed${NC}"
else
    echo -e "${RED}❌ ML Service health check failed${NC}"
    ERRORS=$((ERRORS+1))
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend health check passed${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    ERRORS=$((ERRORS+1))
fi

# Summary
echo ""
echo "=================================="
echo "📊 Verification Summary"
echo "=================================="
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Production verification PASSED${NC}"
    exit 0
else
    echo -e "${RED}❌ Production verification FAILED${NC}"
    exit 1
fi
