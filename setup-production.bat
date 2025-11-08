@echo off
echo ========================================
echo CryptoAML - Production Setup Script
echo ========================================
echo.

echo Step 1: Generating production secrets...
node generate-secrets.js > secrets.txt
echo Secrets saved to secrets.txt
echo.

echo Step 2: Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo Docker is installed
echo.

echo Step 3: Checking environment files...
if not exist ".env.production" (
    echo Creating .env.production from template...
    copy .env.production.example .env.production
    echo.
    echo IMPORTANT: Edit .env.production with the secrets from secrets.txt
    echo.
    pause
)

echo Step 4: Creating required directories...
if not exist "ssl" mkdir ssl
if not exist "backups" mkdir backups
if not exist "backend\logs" mkdir backend\logs
echo Directories created
echo.

echo Step 5: Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed
echo.

echo Step 6: Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo Prisma client generated
echo.

cd ..

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy secrets from secrets.txt to .env.production
echo 2. Get SSL certificates (see DEPLOYMENT_GUIDE.md)
echo 3. Update nginx-ssl.conf with your domain
echo 4. Run: docker-compose -f docker-compose.prod.yml up -d
echo.
echo For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
pause
