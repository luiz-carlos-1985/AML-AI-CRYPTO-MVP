@echo off
echo ========================================
echo   Iniciando Frontend CryptoAML
echo ========================================
echo.

cd frontend

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

echo.
echo Iniciando servidor frontend na porta 3000...
echo.
call npm run dev
