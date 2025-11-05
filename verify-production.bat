@echo off
echo Production Verification Script
echo ==================================
echo.

set ERRORS=0
set WARNINGS=0

echo Checking Docker...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker installed
) else (
    echo [ERROR] Docker not installed
    set /a ERRORS+=1
)

echo Checking Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker Compose installed
) else (
    echo [ERROR] Docker Compose not installed
    set /a ERRORS+=1
)

echo Checking environment variables...
if "%JWT_SECRET%"=="" (
    echo [WARNING] JWT_SECRET not set
    set /a WARNINGS+=1
) else (
    echo [OK] JWT_SECRET configured
)

echo Checking services...
docker-compose ps | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Services are running
) else (
    echo [WARNING] Services not running
    set /a WARNINGS+=1
)

echo Checking health endpoints...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend health check passed
) else (
    echo [ERROR] Backend health check failed
    set /a ERRORS+=1
)

curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] ML Service health check passed
) else (
    echo [ERROR] ML Service health check failed
    set /a ERRORS+=1
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend health check passed
) else (
    echo [ERROR] Frontend health check failed
    set /a ERRORS+=1
)

echo.
echo ==================================
echo Verification Summary
echo ==================================
echo Errors: %ERRORS%
echo Warnings: %WARNINGS%
echo.

if %ERRORS% equ 0 (
    echo [OK] Production verification PASSED
    exit /b 0
) else (
    echo [ERROR] Production verification FAILED
    exit /b 1
)
