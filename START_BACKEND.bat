@echo off
echo ========================================
echo   Iniciando Backend CryptoAML
echo ========================================
echo.

cd backend

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

echo.
echo Iniciando servidor backend na porta 3001...
echo.
call npm run dev
